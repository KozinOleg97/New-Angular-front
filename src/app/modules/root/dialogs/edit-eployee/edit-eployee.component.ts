import { Component, OnInit } from '@angular/core';
import { EditDataService } from '../../../../services/edit-data.service';
import { Employees } from 'src/app/javaclasses/classes';
import { RestService } from '../../../../services/rest.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-eployee',
  templateUrl: './edit-eployee.component.html',
  styleUrls: ['./edit-eployee.component.css']
})
export class EditEployeeComponent implements OnInit {

  constructor(
    private editDataService: EditDataService,
    private restService: RestService,
    private router: Router,
  ) { }

  data:Employees;  //данные сотрудника
  exist:boolean;   //новый 0 существующий 1

  isChangeAccountData:boolean; //менять логин и пароль (для существующего опционально)

  login:string;
  password:string;

  ngOnInit() {    
      this.data = this.editDataService.editData;
      this.exist = this.editDataService.exist;

      this.isChangeAccountData = false;
      this.login="";
      this.password="";

      if(!this.exist){
        this.data = new Employees(0);
        this.data.accessLevel=1;
        this.data.isAvailable=false;
        this.data.role="driver";
        this.data.timeMode=5;        
        this.data.fio="";
      } 
      console.log(this.data);
     }

     FIOChanged(fio:string){
      //window.alert(fio);
      this.data.fio=fio;
     }
     
     accessLevelChanged(level:number){
      //window.alert(level);
      this.data.accessLevel=Number(level);
     }

     roleChanged(role:string){
      //window.alert(role);
      this.data.role=role;
     }

     timeModeChanged(timeMode:string){
      //window.alert(timeMode[0]);
      this.data.timeMode=Number(timeMode[0]);
      //window.alert(this.data.timeMode);
    }

    loginChanged(login:string){
      //window.alert(state);
      this.login=login;
     }

     passwordChanged(password:string){
      //window.alert(state);
      this.password=password;
     }

     isAvailableChanged(state:boolean){
      //window.alert(state);
      this.data.isAvailable=state;
     }
  

     confirm(){
      //проверка заполнения
      if(this.data.fio.length>1) 
        if(!(
          !this.isChangeAccountData || 
          (this.login.length>0 && this.password.length>0)
          ))
        window.alert("Заполните все поля!")
      else{
        console.log(this.data);

        //содержимое json
        const params={
          login: localStorage.getItem('login'),
          token: localStorage.getItem('accessToken'),
  
          accessLevel: [this.data.accessLevel],
          available: [this.data.isAvailable],
          fio: [this.data.fio],
          id: [this.data.employeeId],
          password: [null],
          role:[this.data.role],
          timeMode:[this.data.timeMode],
          username:[null]
        }
        //логин и пароль для новых или если отмечена замена
        if(this.isChangeAccountData){
          params.username = [this.login];
          params.password = [this.password];
        }


        //запрос на замену данных
        this.restService.call('set/changeEmployeesData',params,'POST')
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
              this.restService.call('set/changeEmployeesData',params,'POST')
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
       console.log(this.data.fio.length,this.login.length,this.password.length);
       if(!(
         this.data.fio.length>0 && 
         this.login.length>0  &&
          this.password.length>0
          ))
          window.alert("заполните все поля!");                   
       else{

         //содержимое json
        const params={
          login: localStorage.getItem('login'),
          token: localStorage.getItem('accessToken'),
  
          accessLevel: [this.data.accessLevel],
          fio: [this.data.fio],
          password: [this.password],
          role:[this.data.role],
          timeMode:[this.data.timeMode],
          username:[this.login]
        }

        //запрос на добавление данных
        this.restService.call('set/addEmployees',params,'POST')
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
                this.restService.call('set/addEmployees',params,'POST')
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

     changeAccountData(state:boolean){
      this.isChangeAccountData = state;
      console.log(this.isChangeAccountData);
     }
}
