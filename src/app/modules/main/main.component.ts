import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import {RestService} from '../../services/rest.service';
import {Deal} from '../../beans/deal';
import {Box} from '../../beans/box';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public deals: Array<Deal> = new Array<Deal>();
  public freeBoxList: Array<Box> = new Array<Box>();

  public value;
  selectedBox: Box;

  constructor(
    private headerService: HeaderService,
    private restService: RestService,


    ) { }

  ngOnInit() {
    this.loadBoxData();
    this.loadDealsData();

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
    this.loadBoxData();
    // this.loadDealsData();


    console.log(id);
  }

  addNewDeal(box_id: number ) {

    const login = localStorage.getItem('login');
    const password = localStorage.getItem('password');


    const params = {
      login,
      password,
      box_id
    };
    console.log(params);
    this.restService.call('deal/create', params, 'POST')
      .subscribe((res: any) => {
          // console.log(res);
          // this.deals = res.dealList;
          console.log(res.deal);
          this.loadDealsData();
          this.loadBoxData();
        }
      );

  }

  loadBoxData() {

    this.restService.call('box/free', null, 'GET')
      .subscribe((res: any) => {
          // console.log(res);
          this.freeBoxList = [];
          this.freeBoxList = res.boxList;
          console.log(this.freeBoxList);
        }
      );
  }

  loadDealsData() {

    const login = localStorage.getItem('login');
    const password = localStorage.getItem('password');

    const params = {
      login,
      password
    };
    console.log(params);
    this.restService.call('deal/show', params, 'POST')
      .subscribe((res: any) => {
          // console.log(res);
          this.deals = [];
          this.deals = res.dealList;
          console.log(this.freeBoxList);
        }
      );
  }

  selectBoxClick(boxSelect: NgModel) {


    this.addNewDeal(+boxSelect.model);
    console.log(boxSelect.model);
    // console.log(this.selectedBox.id);
  }
}
