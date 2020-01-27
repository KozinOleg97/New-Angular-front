import { Component, OnInit } from '@angular/core';
import { EditDataService } from '../../../../services/edit-data.service';
import { Route } from 'src/app/javaclasses/classes';
import { RestService } from '../../../../services/rest.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.css']
})
export class EditRouteComponent implements OnInit {

  constructor(
    private editDataService: EditDataService,
    private restService: RestService,
    private router: Router,
  ) { }

  data:Route;  //данные сотрудника
  exist:boolean;   //новый 0 существующий 1

  ngOnInit() {
    this.data = this.editDataService.editData;
      this.exist = this.editDataService.exist;

      if(!this.exist){
        this.data = new Route(0);
        this.data.sign="new route";
        this.data.transportNeeded = 0;
        this.data.stopTimings = [0,0];
        this.data.stopsList = ["start","stop"];
      } 
      console.log(this.data);
     }

     addStop(){
       this.data.stopsList.push("new stop");
       this.data.stopTimings.push(0);
     }

     stopsListChanged(newValue:string, index:number){
      this.data.stopsList[index]=newValue;
     }

     stopTimingsChanged(newValue:string, index:number){
      this.data.stopTimings[index]=Number(newValue);
    }

    signChanged(newValue:string){
      this.data.sign=newValue;
    }

    transportNeededChanged(newValue:string){
      this.data.transportNeeded=Number(newValue);
    }
    removeStop(i:number){
      this.data.stopsList.splice(i,1);
      this.data.stopTimings.splice(i,1);
    }

     decline(){
      window.location.reload();
     }

     createNew(){
      console.log(this.data);
      if(!this.checkFields())
      window.alert("Заполните все поля!");
      if(this.data.stopsList.length<2)
      window.alert("Нужно больше остановок!");
      else{
//содержимое json
const params={
  login: localStorage.getItem('login'),
  token: localStorage.getItem('accessToken'),

  sign: this.data.sign,
  transportNeeded: this.data.transportNeeded,
  stopTimings: null,
  stopsList: null,
}

  var temp:string;
  temp="";
  for(var i in this.data.stopTimings)
    if(temp!="") temp = temp+","+this.data.stopTimings[i];
    else temp = temp + this.data.stopTimings[i];

  params.stopTimings = temp;

  temp="";
  for(var i in this.data.stopsList)
    if(temp!="") temp = temp+","+this.data.stopsList[i];
    else temp = temp + this.data.stopsList[i];

  params.stopsList = temp;

  //запрос на замену данных
this.restService.call('/set/addRoutes',params,'POST')
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
    this.restService.call('/set/addRoutes',params,'POST')
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
        if(!this.checkFields())
        window.alert("Заполните все поля!");
        if(this.data.stopsList.length<2)
        window.alert("Нужно больше остановок!");
        else{
          //содержимое json
          const params={
            login: localStorage.getItem('login'),
            token: localStorage.getItem('accessToken'),

            id: [this.data.routeId],
            sign: [this.data.sign],
            transportNeeded: [this.data.transportNeeded],
            stopTimings: [],
            stopsList: [],
          }

            var temp:string;
            temp="";
            for(var i in this.data.stopTimings)
              if(temp!="") temp = temp+","+this.data.stopTimings[i];
              else temp = temp + this.data.stopTimings[i];

            params.stopTimings = [temp];

            temp="";
            for(var i in this.data.stopsList)
              if(temp!="") temp = temp+","+this.data.stopsList[i];
              else temp = temp + this.data.stopsList[i];

            params.stopsList = [temp];

            //запрос на замену данных
        this.restService.call('set/changeRoutesData',params,'POST')
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
              this.restService.call('set/changeRoutesData',params,'POST')
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

     checkFields(){
       let returnValue:Boolean;
       returnValue = true;
      if(
        this.data.sign.length<1 ||
        this.data.transportNeeded<0
        ) returnValue = false;

        for(var i in this.data.stopsList)
          if(this.data.stopsList[i].length<1)
            returnValue = false;
        
        return returnValue;
     }
}
