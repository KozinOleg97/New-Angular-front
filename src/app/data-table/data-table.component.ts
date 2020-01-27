import {AfterViewInit, Component, OnInit, Output, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { DataTableDataSource, DataTableItem } from './data-table-datasource';
import {HeaderService} from '../services/header.service';
import {RestService} from '../services/rest.service';
import {Deal} from '../beans/deal';
import {Box} from '../beans/box';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<DataTableItem>;
  dataSource: DataTableDataSource;


  public deals: Array<Deal> = new Array<Deal>();
  public freeBoxList: Array<Box> = new Array<Box>();
  public value;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor(private headerService: HeaderService,
              private restService: RestService,) {

  }

  ngOnInit() {
    // this.dataSource = new DataTableDataSource();
    this.loadBoxData();
    this.loadDealsData();

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken != null && accessToken != 'undefined') {
      this.headerService.setTitle('Добро пожаловать, ' + localStorage.getItem('username') + '!');
    } else {
      this.headerService.setTitle('Добро пожаловать, гость!');
    }

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log(this.deals + "DASASDDAS");
  }

  private loadBoxData() {
    this.restService.call('box/free', null, 'GET')
      .subscribe((res: any) => {
          //console.log(res);
          this.freeBoxList = res.boxList;
          console.log(this.freeBoxList);
        }
      );

  }

  private loadDealsData() {

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
          this.dataSource = new DataTableDataSource();
          this.dataSource.data = res.dealList;
          //this.dataSource = res;
          //this.table.dataSource = this.dataSource.data;
          console.log(this.dataSource.data);
        }
      );
  }
}
