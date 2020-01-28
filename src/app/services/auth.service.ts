// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService) {}
  /**
   * Эта штука непонятно зачем
   */

  public isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    console.log('112121212sasasasasasas'+accessToken);
    // Check whether the token is expired and return
    // true or false
    //return !token==null
    return false;
  }
}
