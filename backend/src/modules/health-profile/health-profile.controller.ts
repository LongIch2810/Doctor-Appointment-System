import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { HealthProfileService } from './health-profile.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { BodyUpdateHealthProfileDto } from './dto/bodyUpdateHealthProfile.dto';

@Controller('health-profiles')
@UseGuards(JwtAuthGuard)
export class HealthProfileController {
  constructor(private healthProfileService: HealthProfileService) {}

  @Patch('update-health-profile')
  async updateHealthProfile(
    @Request() req,
    @Body() bodyUpdateHealProfile: Partial<BodyUpdateHealthProfileDto>,
  ) {
    const { userId } = req.user;
    const { message } = await this.healthProfileService.updateHealthProfile(
      userId,
      bodyUpdateHealProfile,
    );
    return message;
  }

  @Get('info')
  async getHealthProfileDetail(@Request() req) {
    const { userId } = req.user;
    const healthProfile =
      await this.healthProfileService.getHealthProfile(userId);
    return healthProfile;
  }
}
