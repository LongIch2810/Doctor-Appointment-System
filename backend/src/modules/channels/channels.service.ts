import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Channel from 'src/entities/channel.entity';
import { Repository } from 'typeorm';
import ChannelMembers from 'src/entities/channelMembers.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepo: Repository<Channel>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepo: Repository<ChannelMembers>,
  ) {}

  async createChannel(member_ids: number[]) {
    const createdChannel = this.channelRepo.create();
    const newChannel = await this.channelRepo.save(createdChannel);
    const members = member_ids.map((m) =>
      this.channelMembersRepo.create({ channel: newChannel, user: { id: m } }),
    );

    await this.channelMembersRepo.save(members);

    return await this.channelRepo.findOne({
      where: { id: newChannel.id },
      relations: ['participants', 'participants.user'],
    });
  }

  findChannelsByUserId(userId: number) {}

  async findChannelByParticipants(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new BadRequestException('');
    }
    let channel = await this.channelRepo
      .createQueryBuilder('channel')
      .innerJoin('channel.participants', 'participant')
      .innerJoin('participant.user', 'user')
      .where('user.id IN (:...ids)', { ids: [senderId, receiverId] })
      .groupBy('channel.id')
      .having('COUNT(DISTINCT user.id) = 2')
      .getOne();

    if (!channel) {
      channel = await this.createChannel([senderId, receiverId]);
    }

    return await this.getChannelByChannelId(channel!.id);
  }

  async getChannelByChannelId(channelId: number) {
    const result = await this.channelRepo
      .createQueryBuilder('c')
      .select('c.id', 'channel_id')
      .addSelect('c.created_at', 'created_at')
      .addSelect('c.updated_at', 'updated_at')
      .addSelect(
        `json_agg(json_build_object(
        'id', u.id,
        'fullname',u.fullname,
        'username', u.username,
        'picture', u.picture
      ))`,
        'participants',
      )
      .innerJoin('c.participants', 'p')
      .innerJoin('p.user', 'u')
      .where('c.id = :channelId', { channelId })
      .groupBy('c.id')
      .addGroupBy('c.created_at')
      .addGroupBy('c.updated_at')
      .getRawOne();

    return result;
  }
}
