import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CallStatus } from 'src/shared/enums/callStatus';
import { MessageType } from 'src/shared/enums/messageType';

export class CreateMessageDto {
  @IsEnum(MessageType)
  message_type: MessageType;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(CallStatus)
  @IsOptional()
  call_status?: CallStatus;

  @IsNumber()
  @IsOptional()
  call_duration?: number;

  @IsNumber()
  sender_id: number;

  @IsNumber()
  channel_id: number;
}
