// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
//import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  public logged:boolean;

  constructor(
    //public auth: AuthService,
     public router: Router
     ) {}
  canActivate(): boolean {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken);
      if(accessToken==null){
        window.alert("Token == NULL");
        this.router.navigate(['login']);
        return false;
      }
    return true;
  }
}
