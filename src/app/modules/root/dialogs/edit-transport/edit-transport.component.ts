import { Component, OnInit } from '@angular/core';
import { EditDataService } from '../../../../services/edit-data.service';
import { Transport } from 'src/app/javaclasses/classes';
import { RestService } from '../../../../services/rest.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-transport',
  templateUrl: './edit-transport.component.html',
  styleUrls: ['./edit-transport.component.css']
})
export class EditTransportComponent implements OnInit {

  constructor(
    private editDataService: EditDataService,
    private restService: RestService,
    private router: Router,
  ) { }

  data:Transport;  //данные сотрудника
  exist:boolean;   //новый 0 существующий 1

  ngOnInit() {
    this.data = this.editDataService.editData;
    this.exist = this.editDataService.exist;

    if(!this.exist){
      this.data = new Transport(0);
      this.data.isAvailable = false;
      this.data.number = "AA000A00";
    } 
    console.log(this.data);
   }

   numberChanged(number:string){
    //window.alert(role);
    this.data.number=number;
   }

   isAvailableChanged(state:boolean){
    //window.alert(role);
    this.data.isAvailable=state;
   }

   confirm(){
    //проверка заполнения
    if(this.data.number.length<1) 
      window.alert("Заполните все поля!")
    else{
      console.log(this.data);

      //содержимое json
      const params={
        login: localStorage.getItem('login'),
        token: localStorage.getItem('accessToken'),

        number: [this.data.number],
        id: [this.data.transportId],
        available: [this.data.isAvailable]
      }

      //запрос на замену данных
      this.restService.call('set/changeTransportData',params,'POST')
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
            this.restService.call('/changeTransportData',params,'POST')
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

   decline(){
    window.location.reload();
   }

   createNew(){
     console.log(this.data);
       if(!(
       this.data.number.length>0 
        ))
        window.alert("заполните все поля!");                   
     else{

       //содержимое json
      const params={
        login: localStorage.getItem('login'),
        token: localStorage.getItem('accessToken'),

        number: [this.data.number],
      }

      //запрос на добавление данных
      this.restService.call('set/addTransport',params,'POST')
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
              this.restService.call('set/addTransport',params,'POST')
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
}
