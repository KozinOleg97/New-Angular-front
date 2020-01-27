import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { HeaderService } from '../../services/header.service';
import {Deal} from '../../beans/deal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {




  constructor(
    private headerService: HeaderService,
    private router: Router,
    private restService: RestService
) { }

  ngOnInit() {
  }



  logIn(l: string, p: string) {

     const params = {
      login: l,
      password: p
    };
     this.restService.call('log', params, 'POST')
      .subscribe((res: any) => {
        // console.log(res);
        if (res.result == true) {
          localStorage.setItem('login', params.login);
          localStorage.setItem('role', res.role);
          localStorage.setItem('password', params.password);



          this.router.navigate(['/home']);
        } else { window.alert('incorrect login or password'); }

      });


  }

}

//////////////////////////////////////////


