import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { BodyChangePasswordDto } from './dto/bodyChangePassword.dto';
import * as bcrypt from 'bcryptjs';
import { BodyUpdateUserDto } from './dto/bodyUpdateUser.dto';
import { removePasswordDeep } from 'src/utils/removePasswordDeep';
import { PartialUpdateUserDto } from './dto/partialUpdateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from 'src/uploads/cloudinary.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private cloudinaryService: CloudinaryService,
    private redisService: RedisCacheService,
  ) {}
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get('info')
  async getUserInfo(@Request() req: any) {
    const { userId } = req.user;
    const cachedUserInfo = await this.redisService.getData(`user:${userId}`);
    if (cachedUserInfo) {
      return cachedUserInfo;
    }
    const userInfo = await this.userService.findByUserId(userId);
    if (!userInfo) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }
    const userInfoWithoutPassword = removePasswordDeep(userInfo);
    await this.redisService.setData(
      `user:${userId}`,
      userInfoWithoutPassword,
      60 * 60,
    );
    return userInfo;
  }

  @Patch('update-info')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh JPG/PNG/GIF/WEBP'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async updateUserInfo(
    @Request() req,
    @Body() bodyUpdateUser: PartialUpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { userId } = req.user;

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    let uploadedResult: string = '';
    if (file) {
      uploadedResult = await this.cloudinaryService.uploadImage(file);
    }

    const fields = uploadedResult
      ? { ...bodyUpdateUser, picture: uploadedResult }
      : bodyUpdateUser;

    await this.userService.updateUserFields(userId, fields);

    const updatedUser = await this.userService.findByUserId(userId);
    await this.redisService.delData(`user:${userId}`);

    return updatedUser;
  }

  @Put('change-password')
  async changePassword(
    @Request() req,
    @Body() bodyChangePassword: BodyChangePasswordDto,
  ) {
    const { userId } = req.user;
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }
    const { old_password, new_password } = bodyChangePassword;

    const isMatchPassword = await bcrypt.compare(old_password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException('Mật khẩu cũ không trùng khớp.');
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    await this.userService.updateUserField(
      userId,
      'password',
      hashedNewPassword,
    );

    return { message: 'Thay đổi mật khẩu thành công.' };
  }
}
