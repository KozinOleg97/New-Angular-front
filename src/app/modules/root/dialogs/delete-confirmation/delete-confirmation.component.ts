import { Component, OnInit } from '@angular/core';
import { EditDataService } from '../../../../services/edit-data.service';
import { RestService } from '../../../../services/rest.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(
    private editDataService: EditDataService,
    private restService: RestService,
    private router: Router,
  ) { }


  data:any;

  ngOnInit() {
this.data = this.editDataService.editData;
console.log(this.data);
  }

deleteSelected(){
//содержимое json
const params={
  login: localStorage.getItem('login'),
  token: localStorage.getItem('accessToken'),

  idList: []
}
let table = "";
if(this.data[0]._fio!=undefined) table="Employees";
if(this.data[0].number!=undefined)  table="Transport";
if(this.data[0].sign!=undefined)  table="Routes";
if(this.data[0].recordId!=undefined)  table="Records";
console.log(table);
switch(table){
  case "Employees":
    for(var i in this.data){
      params.idList.push(this.data[i]._employeeId);
    }
    break;

    case "Transport":
        for(var i in this.data){
          params.idList.push(this.data[i].transportId);
        }
    break;

    case "Routes":
        for(var i in this.data){
          params.idList.push(this.data[i].routeId);
        }
    break;

    case "Records":
        for(var i in this.data){
          params.idList.push(this.data[i].recordId);
        }
    break;
}
//запрос на удаление
this.restService.call('set/delete'+table,params,'POST')
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
        this.restService.call('set/delete'+table,params,'POST')
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

decline(){
  window.location.reload();
}

}