import { ESLint } from 'eslint';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { PasswordService } from 'src/password/password.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UpdatePasswordDto } from 'src/password/dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordservice: PasswordService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}
  async login(loginDto: LoginUserDto) {
    console.log('login', loginDto);

    //validating email
    const result = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });
    console.log('email does exits in database');

    //then validating password after hashing
    const hash = await this.passwordservice.comparePassword(
      loginDto.password,
      result.password,
    );
    console.log('hash =', hash);
    //user logging in
    if (hash) {
      return this.signinUser(
        result.id,
        result.username,
        result.email,
        result.roles,
      );
    }
    //cant login / error
    else {
      throw new BadRequestException('email/password incorrect');
    }
  }

  async signinUser(
    userId: number,
    userName: string,
    userEmail: string,
    userRole: string,
  ) {
    const payload = {
      id: userId,
      username: userName,
      useremail: userEmail,
      roles: userRole,
    };
    console.log('payload created', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
