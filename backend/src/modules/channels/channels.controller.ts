import { Body, Controller, Post } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}
  @Post('/find-by-participants')
  findChannelByParticipants(
    @Body() data: { senderId: number; receiverId: number },
  ) {
    return this.channelsService.findChannelByParticipants(
      data.senderId,
      data.receiverId,
    );
  }
}
