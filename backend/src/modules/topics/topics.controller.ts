import { Body, Controller, Post } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { BodyFilterTopicsDto } from './dto/bodyFilterTopics.dto';

@Controller('topics')
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @Post()
  async getTopics(@Body() bodyFilterTopics: BodyFilterTopicsDto) {}
}
