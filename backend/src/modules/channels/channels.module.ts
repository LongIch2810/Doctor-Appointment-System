import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Channel from 'src/entities/channel.entity';
import ChannelMembers from 'src/entities/channelMembers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelMembers])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
