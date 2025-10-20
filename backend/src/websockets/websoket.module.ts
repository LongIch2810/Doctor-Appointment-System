import { Module, forwardRef } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { MessagesModule } from 'src/modules/messages/messages.module';
import { ChatHistoryModule } from 'src/modules/chat-history/chat-history.module';
import { JwtModule } from '@nestjs/jwt';
import { WsCookieAuthGuard } from 'src/common/guards/wsCookieAuth.guard';
@Module({
  imports: [
    MessagesModule,
    ChatHistoryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [WebsocketGateway, WsCookieAuthGuard],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
