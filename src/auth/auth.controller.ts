import { Controller, Post, Req, Body, ParseIntPipe } from '@nestjs/common';
import {Request} from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @Post('signup')
    // signup(@Req() req: Request) {
        signup(@Body() dto:AuthDto) {
      
       return this.authService.signup(dto);
    }
    // signup (
    //     @Body('email') email: string,
    //     @Body('password', ParseIntPipe) password: string,
    // ){
    //     console.log({
    //         email,
    //         type0fEmail: typeof email,
    //         password,
    //         type0fPassword: typeof password,
    //     })
    //     return this.authService.signup();
    // }

    @Post('signin')
    signin() {
        return this.authService.signin();
    }
}
