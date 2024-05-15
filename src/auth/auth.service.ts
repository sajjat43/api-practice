import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return {msg: 'signup', status: 'success'};
  }
  signin() {
    return {msg: 'signin', status: 'success'};
  }
}
