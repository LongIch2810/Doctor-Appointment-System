import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  handleSaveMessage(@Body() bodyCreateMessage: CreateMessageDto) {
    return this.messagesService.saveMessage(bodyCreateMessage);
  }

  @Get(':channelId')
  getMessagesByChannelId(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.messagesService.getMessageByChannelId(channelId, page);
  }
}
