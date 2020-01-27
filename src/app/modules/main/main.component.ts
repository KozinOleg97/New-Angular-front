import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import {RestService} from '../../services/rest.service';
import {Deal} from '../../beans/deal';
import {Box} from '../../beans/box';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public deals: Array<Deal> = new Array<Deal>();
  public freeBoxList: Array<Box> = new Array<Box>();

  public value;
  constructor(
    private headerService: HeaderService,
  private restService: RestService,


    ) { }

  ngOnInit() {
    this.loadBoxData();
    this.loadDealsData();

    const accessToken = localStorage.getItem('accessToken');
      if(accessToken!=null && accessToken!="undefined")
      this.headerService.setTitle('Добро пожаловать, '+localStorage.getItem("username")+'!');
        else
     this.headerService.setTitle('Добро пожаловать, гость!');
  }

  routeChanged(value: string) {
    this.value = value;


    var strings = value.split(" ");

    var id = +strings[1];

    this.addNewDeal(id);

    this.loadDealsData();


    console.log(id);
  }

  addNewDeal(box_id: number ){

    let login = localStorage.getItem('login');
    let password = localStorage.getItem('password');


    const params = {
      login,
      password,
      box_id
    };
    console.log(params);
    this.restService.call('deal/create', params, 'POST')
      .subscribe((res: any) => {
          //console.log(res);
          //this.deals = res.dealList;
          console.log(res.deal);
        }
      );

  }

  loadBoxData() {

    this.restService.call('box/free', null, 'GET')
      .subscribe((res: any) => {
          //console.log(res);
          this.freeBoxList = res.boxList;
          console.log(this.freeBoxList);
        }
      );
  }

  loadDealsData() {

    let login = localStorage.getItem('login');
    let password = localStorage.getItem('password');

    const params = {
      login,
      password
    };
    console.log(params);
    this.restService.call('deal/show', params, 'POST')
      .subscribe((res: any) => {
          //console.log(res);
          this.deals = res.dealList;
          console.log(this.freeBoxList);
        }
      );
  }

}
