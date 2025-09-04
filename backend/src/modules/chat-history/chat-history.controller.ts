import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { BodyMessageDto } from './dto/bodyMessage.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ConfigService } from '@nestjs/config';
import { BodyChatDto } from './dto/bodyChat.dto';

@Controller('chat-history')
@UseGuards(JwtAuthGuard)
export class ChatHistoryController {
  constructor(
    private chatHistoryService: ChatHistoryService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':userId')
  async getChatHistory(@Param('userId', ParseIntPipe) userId: number) {
    const history = await this.chatHistoryService.getChatHistory(userId);
    return history.reverse();
  }

  @Post()
  async saveMessage(@Body() body: BodyMessageDto) {
    const { userId, role, content } = body;
    await this.chatHistoryService.saveMessage(userId, role, content);
    return { message: 'Message saved successfully' };
  }

  @Post('chat')
  async chatWithChatbot(@Request() req, @Body() body: BodyChatDto) {
    const { userId } = req.user;
    const { accessToken: token } = req.cookies;
    console.log('>>> token:', token);
    const { question } = body;
    const answer = await this.chatHistoryService.chatbotAnswer(
      userId,
      question,
      token,
    );
    return { answer };
  }
}
