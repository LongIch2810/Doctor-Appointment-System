import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RelativesService } from './relatives.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CreateRelativeDto } from './dto/createRelative.dto';

@Controller('relatives')
export class RelativesController {
  constructor(private readonly relativesService: RelativesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createRelative(@Request() req, @Body() body: CreateRelativeDto) {
    const { userId } = req.user;
    return this.relativesService.createRelative(userId, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findRelativesByRelationshipCodeAndName(
    @Request() req,
    @Query('relationship_code') relationshipCode: string,
    @Query('name') name: string,
  ) {
    const { userId } = req.user;
    console.log('>>> userId : ', userId);
    console.log('>>> relationshipCode : ', relationshipCode);
    console.log('>>> name : ', name);
    return this.relativesService.findRelativesByRelationshipCodeAndName({
      userId,
      relationshipCode,
      name,
    });
  }
}
