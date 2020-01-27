// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
//import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    //public auth: AuthService,
     public router: Router
     ) {}
  canActivate(): boolean {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken);
      if(accessToken==null){
        window.alert("log in first, horosho?");
        this.router.navigate(['login']);
        return false;
      }
    return true;
  }
}