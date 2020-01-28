import { Component, OnInit } from '@angular/core';
import {Deal} from '../beans/deal';
import {Box} from '../beans/box';
import {HeaderService} from '../services/header.service';
import {RestService} from '../services/rest.service';
import {NgModel} from '@angular/forms';
import {User} from '../beans/user';
import {Role} from '../beans/role';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})

export class AdminpanelComponent implements OnInit {

  public users: Array<User> = new Array<User>();
  public roles: Array<Role> = new Array<Role>();
  public freeBoxList: Array<Box> = new Array<Box>();

  public value;
  selectedBox: Box;

  constructor(
    private headerService: HeaderService,
    private restService: RestService,

  ) { }

  ngOnInit() {
    this.loadUserData();
    const login = localStorage.getItem('login');
    console.log('login');
    if (login != null && login != 'undefined') {
      this.headerService.setTitle('Добро пожаловать, ' + localStorage.getItem('login') + '!');
    } else {
      this.headerService.setTitle('Добро пожаловать, гость!');
    }
  }

  routeChanged(value: string) {
    this.value = value;


    const strings = value.split(' ');

    const id = +strings[1];

    // this.addNewDeal(id);

    this.freeBoxList = [];
    this.loadUserData();
    // this.loadDealsData();


    console.log(id);
  }


  loadRolesData() {
    this.restService.call('box/free', null, 'GET')
      .subscribe((res: any) => {
          // console.log(res);
          this.users = res.users;
          this.loadRolesData();
          console.log(this.freeBoxList);
        }
      );
  }

  loadUserData() {

    const login = localStorage.getItem('login');

    const params = {
      login,
    };
    console.log(params);
    this.restService.call('deal/show', params, 'POST')
      .subscribe((res: any) => {
          // console.log(res);
          this.users = [];
          this.users = res.UserList;
          //console.log(this.freeBoxList);
        }
      );
  }

  // selectBoxClick(boxSelect: NgModel) {
  //
  //
  //   this.addNewDeal(+boxSelect.model);
  //   console.log(boxSelect.model);
  //   // console.log(this.selectedBox.id);
  // }

}
