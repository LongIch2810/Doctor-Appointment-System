import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Conversation from 'src/entities/conversation.entity';
import { RoleMessage } from 'src/shared/enums/roleMessage';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async saveMessage(userId: number, role: RoleMessage, content: string) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại !');
    }
    await this.conversationRepo.save({
      user,
      role,
      content,
    });
  }

  async getChatHistory(userId: number) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại !');
    }
    const history = await this.conversationRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      take: 10,
    });

    return history;
  }

  async chatbotAnswer(userId: number, question: string, token: string) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại !');
    }

    try {
      const response = await axios.post(
        `${this.configService.get<string>('CHATBOT_URL')}/chatbot/chat`,
        {
          question,
          userId,
          token,
        },
      );
      return response.data.answer;
    } catch (error) {
      console.log('>>> error:', error);
      console.error('Chatbot error:', error?.response?.data || error.message);
      throw new HttpException(
        'Failed to get response from chatbot',
        error?.response?.status || 500,
      );
    }
  }
}
