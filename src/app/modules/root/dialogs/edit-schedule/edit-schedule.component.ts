import { Component, OnInit } from '@angular/core';
import { EditDataService } from '../../../../services/edit-data.service';
import { Schedule,Employees,Route,Transport } from 'src/app/javaclasses/classes';
import { RestService } from '../../../../services/rest.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent implements OnInit {

  constructor(
    private editDataService: EditDataService,
    private restService: RestService,
    private router: Router,
  ) { }

  data:Schedule;  //данные сотрудника
  exist:boolean;   //новый 0 существующий 1


  showTransport:boolean;
  showDrivers:boolean;
  showRoutes:boolean;

  drivers = [];
  routes = [];
  transports = [];

  ngOnInit() {
    this.showTransport=false;
    this.showDrivers=false;
    this.showRoutes=false;

    this.data = this.editDataService.editData;
    this.exist = this.editDataService.exist;

    this.getSheduleFillData();

      if(!this.exist){
        this.data = new Schedule(0);
        this.data.date = new Date();
        this.data.workOrder = 1;

      } 

      console.log(this.data);
      
     }

     focus(target:string){
       switch(target){
         case "routes":
            this.showTransport=false;
            this.showDrivers=false;
            this.showRoutes=true;
           break;

           case "transport":
              this.showTransport=true;
              this.showDrivers=false;
              this.showRoutes=false;
           break;

           case "drivers":
              this.showTransport=false;
              this.showDrivers=true;
              this.showRoutes=false;
           break;
       }
     }

     DateChanged(date:Date){
       this.data.date=date;
       console.log(this.data.date);
     }

     transportChanged(number:string){
       var id:number;
      for(let i in this.transports){
        if(this.transports[i].number==number){
          id=Number(i);
          break;
        }
      }
      if(id==undefined){
        this.data.transporttransportId = undefined;
        window.alert("Невозможно выбрать указанный транспорт!");
      }   else this.data.transporttransportId = this.transports[id];
     }

     driverChanged(fio:string){
      var id:number;
     for(let i in this.drivers){
       if(this.drivers[i].fio==fio){
        id=Number(i);
         break;
       }
     }
     if(id==undefined)
     {
      this.data.currentDriver = undefined;
      window.alert("Невозможно выбрать указанного водителя!")
     } else this.data.currentDriver = this.drivers[id];
    }

    routeChanged(sign:string){
      var id:number;
     for(let i in this.routes){
       if(this.routes[i].sign==sign){
        id=Number(i);
         break;
       }
     }
     console.log(this.routes[id]);
     if(id==undefined){
      this.data.currentRoute = undefined;
      window.alert("Невозможно выбрать указанный маршрут!");
     }  else this.data.currentRoute = this.routes[id];
    }

    workOrderChanged(workOrder:number){
      this.data.workOrder=workOrder;
    }

     decline(){
      window.location.reload();
     }

     createNew(){
      console.log(this.data);
      if(!this.checkData()){
        window.alert("Заполните все поля!");
      }
      else{
//содержимое json
const params={
  login: localStorage.getItem('login'),
  accessToken: localStorage.getItem('accessToken'),

  date: [this.data.date],
  driverIds: [this.data.currentDriver.employeeId],
  order: [this.data.workOrder],
  routeIds: [this.data.currentRoute.routeId],
  transportIds: [this.data.transporttransportId.transportId],
}

//запрос добавление данных
this.restService.call('set/addRecord',params,'POST')
.subscribe((res: any) => {
  //истек токен
    if(res.status=="invalid token"){

      const refreshParams = {
        login: localStorage.getItem('login'),
        expiresOn: localStorage.getItem('expiresOn'),
         refreshToken: localStorage.getItem('refreshToken')
      };
      //пробуем обновить
      this.restService.call('get/refresh', refreshParams, 'POST')
      .subscribe((res: any) => {
        localStorage.setItem("expiresOn",res.expiresOn);
        localStorage.setItem("refreshToken",res.refreshToken);
        localStorage.setItem("accessToken",res.accessToken);
        if(localStorage.getItem("accessToken")=="undefined")
          this.router.navigate(['home']);
      
          //обновляем данные для запроса
          params.login = localStorage.getItem('login');
          params.accessToken = localStorage.getItem('accessToken');

        //и все заного
      this.restService.call('set/addRecord',params,'POST')
      .subscribe((res: any) => {
        console.log(res);
        window.location.reload();
      });
    });
  }
  else{
    console.log(res);
    window.location.reload();
  }
});
      }
     }

     confirm(){
      console.log(this.data);
      if(!this.checkData()){
        window.alert("Заполните все поля!");
      }
      else{
        //содержимое json
const params={
  login: localStorage.getItem('login'),
  token: localStorage.getItem('accessToken'),

  id: [this.data.recordId],
  date: [this.data.date],
  driverId: [this.data.currentDriver.employeeId],
  workOrder: [this.data.workOrder],
  routeId: [this.data.currentRoute.routeId],
  transportId: [this.data.transporttransportId.transportId],
}

//запрос на изменение данных
this.restService.call('set/changeRecordsData',params,'POST')
.subscribe((res: any) => {
  //истек токен
    if(res.status=="invalid token"){

      const refreshParams = {
        login: localStorage.getItem('login'),
        expiresOn: localStorage.getItem('expiresOn'),
         refreshToken: localStorage.getItem('refreshToken')
      };
      //пробуем обновить
      this.restService.call('get/refresh', refreshParams, 'POST')
      .subscribe((res: any) => {
        localStorage.setItem("expiresOn",res.expiresOn);
        localStorage.setItem("refreshToken",res.refreshToken);
        localStorage.setItem("accessToken",res.accessToken);
        if(localStorage.getItem("accessToken")=="undefined")
          this.router.navigate(['home']);
      
          //обновляем данные для запроса
          params.login = localStorage.getItem('login');
          params.token = localStorage.getItem('accessToken');

        //и все заного
      this.restService.call('set/changeRecordsData',params,'POST')
      .subscribe((res: any) => {
        console.log(res);
        window.location.reload();
      });
    });
  }
  else{
    console.log(res);
    window.location.reload();
  }
});
      }
     }

     checkData(){
      if(
        this.data.currentDriver==undefined ||
        this.data.currentRoute==undefined ||
        this.data.transporttransportId==undefined
        ) return false;
        else return true;
     }



     getSheduleFillData(){

      const params = {
        login: localStorage.getItem('login'),
        token: localStorage.getItem('accessToken')
      };

      this.restService.call('get/sheduleFillData', params, 'POST')
      .subscribe((res: any) => {
       console.log(res);

       if(res.status=="invalid token"){
        const refreshParams = {
          login: localStorage.getItem('login'),
          expiresOn: localStorage.getItem('expiresOn'),
           refreshToken: localStorage.getItem('refreshToken')
        };

        this.restService.call('get/refresh', refreshParams, 'POST')
        .subscribe((res: any) => {
          localStorage.setItem("expiresOn",res.expiresOn);
          localStorage.setItem("refreshToken",res.refreshToken);
          localStorage.setItem("accessToken",res.accessToken);
          if(localStorage.getItem("accessToken")!="undefined")
            window.location.reload();
            else this.router.navigate(['home']);

            this.restService.call('get/sheduleFillData', params, 'POST')
            .subscribe((res: any) => {

          for(let i=0;i<res[0].length;i++)
            this.drivers[i] = new Employees(res[0][i]); 
                   
           for(let i=0;i<res[1].length;i++)
            this.routes[i] = new Route(res[1][i]);

            for(let i=0;i<res[2].length;i++)
              this.transports[i] = new Transport(res[2][i]);

              console.log(res);
            });   
        });        
       }
       else{

        for(let i=0;i<res[0].length;i++)
            this.drivers[i] = new Employees(res[0][i]); 
                   
           for(let i=0;i<res[1].length;i++)
            this.routes[i] = new Route(res[1][i]);

            for(let i=0;i<res[2].length;i++)
              this.transports[i] = new Transport(res[2][i]);
        }
      }); 
    }





  }
