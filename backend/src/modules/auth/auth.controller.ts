import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/localAuth.guard';
import { AuthService } from './auth.service';
import { BodyRegisterDto } from './dto/bodyRegister.dto';
import { JwtRefreshAuthGuard } from 'src/common/guards/jwtRefresh.guard';
import { GoogleAuthGuard } from 'src/common/guards/google.guard';
import { ConfigService } from '@nestjs/config';
import { HealthProfileService } from '../health-profile/health-profile.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerData: BodyRegisterDto) {
    const { message } = await this.authService.register(registerData);
    return message;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { accessToken, refreshToken } = await this.authService.login(req);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      success: true,
      data: { accessToken, refreshToken },
      error: null,
    });

    // return res.redirect(
    //   this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    // );
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req, @Response() res) {
    const payload = req.user;
    const { newAccessToken, newRefreshToken } = await this.authService.refresh(
      req,
      payload,
    );
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      success: true,
      data: { message: 'Làm mới token thành công !' },
      error: null,
    });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Response() res) {
    const { message } = await this.authService.logout(req);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      success: true,
      data: { message },
      error: null,
    });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { accessToken, refreshToken } = await this.authService.login(req);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    );
  }

  @Post('set-new-password')
  async setNewPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ) {
    const { message } = await this.authService.setNewPassword(
      email,
      newPassword,
    );
    return message;
  }
}
