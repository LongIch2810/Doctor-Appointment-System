import {
  Body,
  Controller,
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
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      success: true,
      data: { message: 'Login successfully !' },
      error: null,
    });
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
}
