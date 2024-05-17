import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
// import {User, Bookmark} from '@prisma/client';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
     private jwt: JwtService,
    private config: ConfigService,
    ) {} 

  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    // save the user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      // return the saved user
      return user;
    } catch (error) {
      // Handle unique constraint violation error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email address is already in use.');
        }
        throw error;
      }
      // Rethrow any other errors
      throw error;
    }
  }

 async signin(dto: AuthDto) {

    // find the user 
    const user = 
    await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    if (!user) 
      throw new ForbiddenException(
    'Credentials incorrect.'
    );

    // compare password 
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    if(!pwMatches) 
      throw new ForbiddenException(
      'Credentials incorrect.'
    );
    console.log(user.email);
    // send back the user 
    delete user.hash;

    // return user;
    return this.signToken(user.id, user.email);

    // return { msg: 'signin', status: 'success' };
  }
  async signToken(userId: number, email: string): Promise<string>{
    const payload = {
      sub: userId,
      email,
    };
    const secret =this.config.get('JWT_SECRET')
    return this.jwt.signAsync(payload,{
      expiresIn: '15m',
      secret: secret,
    });
  }
}
