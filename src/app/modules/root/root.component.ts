import { Component, OnInit } from '@angular/core';
import { EditDataService } from '../../services/edit-data.service';
import { RestService } from '../../services/rest.service'; 
import { Router } from '@angular/router';

import { Employees,Route,Schedule,Transport } from '../../javaclasses/classes';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';

//default data parameters
const defaultScheduleParams = {
  date: 'any',
  routeSign: 'any',
  workOrder: 'any',
  driverFio: 'any',
  transportNumber: 'any',
  page: 0,
  sizeLimit: 20  
}

const defaultEmployeesParams = {
  fio: 'any',
  role: 'any',
  timeMode: 'any',
  isAvailable: 'any',
  page: 0,
  sizeLimit: 20
}

const defaultRoutesParams = {
  sign: 'any',
  transportNeededPrefix: 'any',
  transportNeeded: 'any',
  page: 0,
  sizeLimit: 20
}

const defaultTransportParams = {
  number: 'any',
  isAvailable: 'any',
  page: 0,
  sizeLimit: 20
}


@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})

export class RootComponent implements OnInit {

  constructor(
    private restService: RestService,
    private editDataService: EditDataService,
    private router: Router
  ) {}

  //received data as classes
  personalInfo = [];
  schedule = [];
  employees = [];
  routes = [];
  transport = [];

  //what to show
  //edits
  isEmployeeEditVisible: boolean;
  isRouteEditVisible: boolean;
  isTransportEditVisible: boolean;
  isScheduleEditVisible: boolean;
  isDeleteFormVisible: boolean;
  isMainFormVisible: boolean;
  //mainForms elements
  showTable = [];
  //select options
  showTablesFilters = [];

  //selected row indexes 
  selectedRecordsIndexes = [];
  selectedEmployeesIndexes = [];
  selectedRoutesIndexes = [];
  selectedTransportIndexes = [];

  //paging limits
  scheduleLimit:number;
  transportLimit:number;
  routesLimit:number;
  employeeLimit:number;

  //cur pages
  scheduleCurPage:number;
  transportCurPage:number;
  routesCurPage:number;
  employeeCurPage:number;

  //select parameters
  scheduleParams:any;
  employeesParams:any;
  routesParams:any;
  transportParams:any;

  //shedule error list
  errorsList:any;

  ngOnInit() {
    //if no params saved
    if(localStorage.getItem('employeesParams')==undefined) 
      this.saveDefaultSelectParameters();     
    
    //recover select params
    this.restoreSelectParameters();

    //paging
    this.scheduleLimit = this.scheduleParams.sizeLimit;
    this.transportLimit = this.transportParams.sizeLimit;
    this.routesLimit = this.routesParams.sizeLimit;
    this.employeeLimit = this.employeesParams.sizeLimit;

    //set visibility
    for(let i=0;i<5;i++){
      this.showTable[i] = false;
      this.showTablesFilters[i] = false;
    }

    //only main form visible now
    this.isMainFormVisible = true;
    this.isEmployeeEditVisible = false;
    this.isRouteEditVisible = false;
    this.isTransportEditVisible = false;
    this.isScheduleEditVisible = false;
    this.isDeleteFormVisible = false;


    this.getData();
    this.getErrorsList();
  }

  getData(){
        //get data
        const params = {
          login: localStorage.getItem('login'),
          token: localStorage.getItem('accessToken'),
    
          esp: this.employeesParams,
          rsp: this.routesParams,
          tsp: this.transportParams,
          ssp: this.scheduleParams,
        };

    this.restService.call('get/mydata', params, 'POST')
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
      });        
     }
     else{

      this.personalInfo = res[0];      

      if(res[1].length>0){
        for(let i=0;i<res[1].length;i++)
          this.schedule[i] = new Schedule(res[1][i]); 
      }       

      if(res.length>2)
      if(res[2].length>0){
        for(let i=0;i<res[2].length;i++)
          this.employees[i] = new Employees(res[2][i]); 
      }        
      if(res.length>3)
          if(res[3].length>0){
            for(let i=0;i<res[3].length;i++)
              this.routes[i] = new Route(res[3][i]);
          }          
          if(res.length>4)
          if(res[4].length>0){
            for(let i=0;i<res[4].length;i++)
              this.transport[i] = new Transport(res[4][i]);      
          }
     }       
      });
  }

  showEdit(editName:String, index:number){
    switch(editName){
      case "employee":
        this.editDataService.editData=(this.employees[index]);
        this.editDataService.exist = true;

        this.isEmployeeEditVisible = !this.isEmployeeEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "routes":
        this.editDataService.editData=(this.routes[index]);
        this.editDataService.exist = true;

        this.isRouteEditVisible = !this.isRouteEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "transport":
        this.editDataService.editData=(this.transport[index]);
        this.editDataService.exist = true;

        this.isTransportEditVisible = !this.isTransportEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "record":
        this.editDataService.editData=(this.schedule[index]);
        this.editDataService.exist = true;

        this.isScheduleEditVisible = !this.isScheduleEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;
    }    
  }

  createNew(editName:String){
    switch(editName){
      case "employee":
        this.editDataService.editData=null;
        this.editDataService.exist = false;

        this.isEmployeeEditVisible = !this.isEmployeeEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "route":
        this.editDataService.editData=null;
        this.editDataService.exist = false;

        this.isRouteEditVisible = !this.isRouteEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "transport":
        this.editDataService.editData=null;
        this.editDataService.exist = false;

        this.isTransportEditVisible = !this.isTransportEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "record":
        this.editDataService.editData=null;
        this.editDataService.exist = false;

        this.isScheduleEditVisible = !this.isScheduleEditVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;
    }    
  }


  deleteChosen(classname:string){
    switch(classname){  
      case "records":
        let records = [];
        for (var i in this.selectedRecordsIndexes)
        records.push(this.schedule[this.selectedRecordsIndexes[i]]);
        console.log(records);

        this.editDataService.editData=records;
        this.isDeleteFormVisible  = !this.isDeleteFormVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

      case "employees":
        let employees = [];
        for (var i in this.selectedEmployeesIndexes)
        employees.push(this.employees[this.selectedEmployeesIndexes[i]]);
        console.log(employees);

        this.editDataService.editData=employees;
        this.isDeleteFormVisible  = !this.isDeleteFormVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "routes":
        let routes = [];
        for (var i in this.selectedRoutesIndexes)
        routes.push(this.routes[this.selectedRoutesIndexes[i]]);
        console.log(routes);

        this.editDataService.editData=routes;
        this.isDeleteFormVisible  = !this.isDeleteFormVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;

        case "transport":
        let transport = [];
        for (var i in this.selectedTransportIndexes)
        transport.push(this.transport[this.selectedTransportIndexes[i]]);
        console.log(transport);

        this.editDataService.editData=transport;
        this.isDeleteFormVisible  = !this.isDeleteFormVisible;
        this.isMainFormVisible = !this.isMainFormVisible;
        break;
    }
  }

  changeSelected(classname:string,index:number){
    switch(classname){  
      case "records":
        let records_index = this.selectedRecordsIndexes.indexOf(index);
        if(records_index!=-1){
          this.selectedRecordsIndexes.splice(records_index,1);
          console.log("deleted"+index);
          console.log(this.selectedRecordsIndexes);
        } 
        else{
          this.selectedRecordsIndexes.push(index);
          console.log("added"+index);
          this.selectedRecordsIndexes.sort();
          console.log(this.selectedRecordsIndexes);
        }
        break;

      case "employees":
        let employees_index = this.selectedEmployeesIndexes.indexOf(index);
        if(employees_index!=-1){
          this.selectedEmployeesIndexes.splice(employees_index,1);
          console.log("deleted"+index);
          console.log(this.selectedEmployeesIndexes);
        } 
        else{
          this.selectedEmployeesIndexes.push(index);
          console.log("added"+index);
          this.selectedEmployeesIndexes.sort();
          console.log(this.selectedEmployeesIndexes);
        }
        break;

        case "routes":
        let routes_index = this.selectedRoutesIndexes.indexOf(index);
        if(routes_index!=-1){
          this.selectedRoutesIndexes.splice(routes_index,1);
          console.log("deleted"+index);
          console.log(this.selectedRoutesIndexes);
        } 
        else{
          this.selectedRoutesIndexes.push(index);
          console.log("added"+index);
          this.selectedRoutesIndexes.sort();
          console.log(this.selectedRoutesIndexes);
        }
        break;

        case "transport":
        let transport_index = this.selectedTransportIndexes.indexOf(index);
        if(transport_index!=-1){
          this.selectedTransportIndexes.splice(transport_index,1);
          console.log("deleted"+index);
          console.log(this.selectedTransportIndexes);
        } 
        else{
          this.selectedTransportIndexes.push(index);
          console.log("added"+index);
          this.selectedTransportIndexes.sort();
          console.log(this.selectedTransportIndexes);
        }
        break;
    }
  }

  changePagingLimit(table:string,value:number){
    switch(table){
      case "schedule":
        this.scheduleLimit = value;
        this.scheduleParams.sizeLimit = value;
        break;

        case "employees":
        this.employeeLimit = value;
        this.employeesParams.sizeLimit = value;
        break;

        case "transport":
        this.transportLimit = value;
        this.transportParams.sizeLimit = value;
        break;

        case "routes":
        this.routesLimit = value;
        this.routesParams.sizeLimit = value;
        break;
    }
    this.saveNewSelectParameters();
  }

  changeSelectParameters(table:string, parameter:string, value:any){
    switch(table){
      case 'schedule':
        switch(parameter){
          case 'date':
            if(value.length==10)
              this.scheduleParams.date = value;
            else
              this.scheduleParams.date = 'any';         
            break;
          case 'routeSign':
            this.scheduleParams.routeSign = value;
            break;
          case 'workOrder':
            this.scheduleParams.workOrder = value;
            break;
          case 'driverFio':
            this.scheduleParams.driverFio = value;
            break;
          case 'transportNumber':
            this.scheduleParams.transportNumber = value;
            break;
        }
        break;

      case 'employees':
          switch(parameter){
            case 'fio':
              this.employeesParams.fio = value;            
              break;
            case 'role':
              this.employeesParams.role = value;
              break;
            case 'timeMode':
              this.employeesParams.timeMode = value;
              break;
            case 'isAvailable':
              this.employeesParams.isAvailable = value;
              break;
          }
        break;

      case 'routes':
          switch(parameter){
            case 'sign':
              this.routesParams.sign = value;            
              break;
            case 'transportNeededPrefix':
              this.routesParams.transportNeededPrefix = value;
              break;
            case 'transportNeeded':
              this.routesParams.transportNeeded = value;
              break;
          }
        break;

      case 'transport':
          switch(parameter){
            case 'number':
              this.transportParams.number = value;            
              break;
            case 'isAvailable':
              this.transportParams.isAvailable= value;
              break;
          }
        break;
    }
    this.saveNewSelectParameters();
  }


  saveDefaultSelectParameters(){
    localStorage.setItem('scheduleParams',JSON.stringify(defaultScheduleParams));
    localStorage.setItem('employeesParams',JSON.stringify(defaultEmployeesParams));
    localStorage.setItem('routesParams',JSON.stringify(defaultRoutesParams));
    localStorage.setItem('transportParams',JSON.stringify(defaultTransportParams));
  }

  saveNewSelectParameters(){
    localStorage.setItem('scheduleParams',JSON.stringify(this.scheduleParams));
    localStorage.setItem('employeesParams',JSON.stringify(this.employeesParams));
    localStorage.setItem('routesParams',JSON.stringify(this.routesParams));
    localStorage.setItem('transportParams',JSON.stringify(this.transportParams));
  }

  restoreSelectParameters(){
    this.scheduleParams = JSON.parse(localStorage.getItem('scheduleParams'));
    this.employeesParams = JSON.parse(localStorage.getItem('employeesParams'));
    this.routesParams = JSON.parse(localStorage.getItem('routesParams'));
    this.transportParams = JSON.parse(localStorage.getItem('transportParams'));
  }

  getErrorsList(){

    this.showTable[5]=false;

    //содержимое json
    const params={
      login: localStorage.getItem('login'),
      token: localStorage.getItem('accessToken'),
    }

    //запрос 
    this.restService.call('get/sheduleErrors',params,'GET')
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
          this.restService.call('get/sheduleErrors',params,'POST')
          .subscribe((res: any) => {
            console.log(res);
            this.errorsList=res;
          });
        });
      }
      else{
        console.log(res);
        this.errorsList=res;
      }
    });
  }

  tableChangeVisible(i:number){
    this.showTable[i] = !this.showTable[i];
  }

  filterChangeVisible(i:number){
    this.showTablesFilters[i] = !this.showTablesFilters[i];
  }

  nextPage(table:String){
    switch(table){
      case "schedule":
        if(!(this.schedule.length==this.scheduleParams.sizeLimit)) break;
        this.scheduleParams.page++;
        this.schedule = [];
        this.saveNewSelectParameters();
        this.getData();
        break;

        case "employees":
        if(!(this.employees.length==this.employeesParams.sizeLimit)) break;
        this.employeesParams.page++;
        this.employees = [];
        this.saveNewSelectParameters();
        this.getData();
        break;

        case "transport":
        if(!(this.transport.length==this.transportParams.sizeLimit)) break;
        this.transportParams.page++;
        this.transport = [];
        this.saveNewSelectParameters();
        this.getData();
        break;

        case "routes":
        if(!(this.routes.length==this.routesParams.sizeLimit)) break;
        this.routesParams.page++;
        this.routes = [];
        this.saveNewSelectParameters();
        this.getData();
        break;
    }
    
  }

  prevPage(table:String){
    switch(table){
      case "schedule":
        if(!(this.scheduleParams.page>0))break;
        this.scheduleParams.page--;
        this.schedule = [];
        this.saveNewSelectParameters();
        this.getData();
        break;

        case "employees":
        if(!(this.employeesParams.page>0)) break;
        this.employeesParams.page--;
        this.employees = [];
        this.saveNewSelectParameters();
        this.getData();
        break;

        case "transport":
        if(!(this.transportParams.page>0))break;
        this.transportParams.page--;
        this.transport = [];
        this.saveNewSelectParameters();
        this.getData();
        break;

        case "routes":
        if(!(this.routesParams.page>0))break;
        this.routesParams.page--;
        this.routes = [];
        this.saveNewSelectParameters();
        this.getData();
        break;
    }

  }

  applyFilter(table:String){
    switch(table){
      case "schedule":
        this.scheduleParams.page = 0;
        this.schedule = [];
        break;

        case "employees":
        this.employeesParams.page = 0;
        this.employees = [];
        break;

        case "transport":
        this.transportParams.page = 0;
        this.transport = [];
        break;

        case "routes":
        this.routesParams.page = 0;
        this.routes = [];
        break;
    }
    this.saveNewSelectParameters();
    this.getData();
  }
}