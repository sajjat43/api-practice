import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import {User, Bookmark} from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {

  }
  signup() {
    return {msg: 'signup', status: 'success'};
  }
  signin() {
    return {msg: 'signin', status: 'success'};
  }
}
