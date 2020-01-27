import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderService } from './services/header.service';


import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { MainComponent } from './modules/main/main.component';
import {RestService} from './services/rest.service';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';

import { RoutesComponent } from './modules/routes/routes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTableComponent } from './data-table/data-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: MainComponent },
  { path: 'routes', component: RoutesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'root',
  loadChildren: () => import('./modules/root/root.module').then(mod => mod.RootModule),
  canActivate: [AuthGuardService]
  }
]

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    HttpModule, BrowserAnimationsModule, MatTableModule, MatPaginatorModule, MatSortModule
      ],
      exports:[
        RouterModule
      ],
      providers: [
        HeaderService,
        RestService,
        AuthService,
        AuthGuardService
        ],

  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    RoutesComponent,
    DataTableComponent,
     ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
