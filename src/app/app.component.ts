import { Component } from '@angular/core';
import { HeaderService } from './services/header.service';
import { Router } from '@angular/router';
import {ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]

})


export class AppComponent  {
  title = '';

  constructor(
    private headerService: HeaderService,
    private router: Router,
    ) {}

    loggedIn:boolean;


  ngOnInit() {
    const accessToken = localStorage.getItem('login');
      if(accessToken!=null) {
        this.headerService.setTitle('Добро пожаловать, '+localStorage.getItem("login")+'!');
        this.loggedIn = true;
      }
        else{
          this.headerService.setTitle('Добро пожаловать, гость!');
          this.loggedIn = false;
        }

    this.headerService.title.subscribe(title => {
     this.title = title;
     if((this.title=='Добро пожаловать, гость!!' &&
      this.loggedIn == true) ||
      (this.title!='Добро пожаловать, гость!' &&
      this.loggedIn == false)
     ){
      this.loggedIn =!this.loggedIn;
      window.location.reload();
     }

    });
  }

logOut(){
  localStorage.clear();
  this.headerService.setTitle('Добро пожаловать, гость!');
  this.router.navigate(['login']).then(()=>
  window.location.reload());
}

}

