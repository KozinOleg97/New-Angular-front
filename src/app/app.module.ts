import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {HeaderService} from './services/header.service';


import {AppComponent} from './app.component';
import {LoginComponent} from './modules/login/login.component';
import {MainComponent} from './modules/main/main.component';
import {RestService} from './services/rest.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {AuthService} from './services/auth.service';
import {AuthGuardService} from './services/auth-guard.service';


import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableComponent} from './table/table.component';
import {AdminpanelComponent} from './adminpanel/adminpanel.component';
import {CabinetComponent} from './cabinet/cabinet.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: MainComponent},
  {path: 'admin', component: AdminpanelComponent},
  {path: 'cabinet', component: CabinetComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}

];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    HttpModule, BrowserAnimationsModule
  ],
  exports: [
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
    TableComponent,
    AdminpanelComponent,
    CabinetComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
