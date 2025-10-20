import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Channel from 'src/entities/channel.entity';
import Message from 'src/entities/message.entity';
import MessageAttachments from 'src/entities/messageAttachments.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/createMessage.dto';
import { UploadFileResponse } from 'src/shared/interfaces/uploadFileResponse';
import { decrypt, encrypt } from 'src/utils/encryption';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(MessageAttachments)
    private messageAttachmentRepo: Repository<MessageAttachments>,
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
  ) {}
  async saveMessage(bodyCreateMessage: CreateMessageDto) {
    if (bodyCreateMessage?.content) {
      bodyCreateMessage.content = encrypt(bodyCreateMessage.content);
    }
    const createdMessage = this.messageRepo.create({
      ...bodyCreateMessage,
      sender: { id: bodyCreateMessage.sender_id },
      channel: { id: bodyCreateMessage.channel_id },
    });
    const newMessage = await this.messageRepo.save(createdMessage);
    return this.getMessageByMessageId(newMessage.id);
  }

  async updateFilesMessage(messageId: number, files: UploadFileResponse[]) {
    const exists = await this.messageRepo.findOne({
      where: { id: messageId },
    });
    if (!exists) {
      throw new NotFoundException('Tin nhắn không tồn tại !');
    }
    const attachments = files.map((file) =>
      this.messageAttachmentRepo.create({
        message: { id: messageId },
        ...file,
      }),
    );

    await this.messageAttachmentRepo.save(attachments);
    return await this.getMessageByMessageId(messageId);
  }

  async getMessageByMessageId(messageId: number) {
    const message = await this.messageRepo.findOne({
      where: { id: messageId },
      relations: ['message_attachments', 'sender', 'channel'],
    });
    if (!message) {
      throw new NotFoundException('Tin nhắn không tồn tại !');
    }
    if (message?.content) {
      message.content = decrypt(message.content);
    }
    return message;
  }

  async getMessageByChannelId(
    channelId: number,
    page: number = 1,
    limit: number = 7,
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;

    const [messages, total] = await this.messageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.message_attachments', 'attachments')
      .where('message.channel_id = :channelId', { channelId })
      .orderBy('message.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const result = {
      total,
      messages: messages
        .map((m) => ({ ...m, content: m.content ? decrypt(m.content) : null }))
        .reverse(),
      page,
      limit,
      totalPages,
    };

    return result;
  }
}
