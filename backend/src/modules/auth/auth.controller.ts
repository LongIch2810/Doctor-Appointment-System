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
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshAuthGuard } from 'src/common/guards/jwtRefresh.guard';
import { GoogleAuthGuard } from 'src/common/guards/google.guard';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
    private mailService: MailService,
  ) {}

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
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

    return res.redirect(
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    );
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
      data: { message: 'Refresh token successfully !' },
      error: null,
    });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    const { message } = await this.authService.logout(req);
    return message;
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

  @Post('send-otp')
  async sendOtp() {
    await this.mailService.sendOtpEmail('huanbui646@gmail.com', '123456');
    return { message: 'Gửi otp thành công !' };
  }
}
