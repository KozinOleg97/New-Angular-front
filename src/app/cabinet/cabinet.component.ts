import { Component, OnInit } from '@angular/core';
import {Deal} from '../beans/deal';
import {Role} from '../beans/role';
import {NgModel} from '@angular/forms';
import {RestService} from '../services/rest.service';
import {PersonData} from '../beans/personData';


@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  public roleList: Array<Role> = new Array<Role>();
  nameBox: string;
  surnameBox: string;
  roleBox: Role;

  public data: Array<PersonData> = new Array<PersonData>();
  private _isAdmin: boolean;
  // outputName: string;
  // outputSurname: string;
  // outputRole: string;





  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }


  constructor(
    private restService: RestService,

  ) {
    // this.outputPersonData.name = '';
    // this.outputPersonData.surname = '';
    // this.outputPersonData.role.name = '';
  }

  ngOnInit() {


    console.log('INIT OF CABINET');
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    const password = localStorage.getItem('password');

    if (role == 'admin') {   this.isAdmin = true; }



    console.log('LOAD DATA OF CABINET');
    this.loadData(login, password);
    this.loadRoleData();

  }

  changePersonData(nameInput: NgModel, surnameInput: NgModel, roleInput: NgModel) {

    console.log(nameInput.value, surnameInput.value, roleInput.value);
    this.callChangeMainData(nameInput.value, surnameInput.value);
    if (this.isAdmin) {
      this.callChangeRole(roleInput.value);
    }
  }

  callChangeMainData(name: string, surname: string) {

    const login = localStorage.getItem('login');
    const password = localStorage.getItem('password');

    const params = {
      login,
      password,
      name,
      surname
    };
    console.log(params);
    this.restService.call('persondata/change', params, 'POST')
      .subscribe((res: any) => {
          // console.log(res);
        //  this.deals = [];
         // this.deals = res.dealList;
         // console.log(this.freeBoxList);
        }
      );
  }

  private callChangeRole(value: string) {

  }

  private loadData(login: string, password: string) {

    const params = {
      login,
      password
    };
    console.log('Load data ' + params);
    this.restService.call('persondata/show', params, 'POST')
      .subscribe((res: any) => {
           console.log(res);
           //this.outputPersonData = null;
           this.data = res.dataList;

           console.log(this.data);
        }
      );
  }

  loadRoleData() {

    this.restService.call('persondata/roles', null, 'GET')
      .subscribe((res: any) => {
          // console.log(res);
          this.roleList = [];
          this.roleList = res.roleList;
          console.log(this.roleList);
        }
      );
  }


}
