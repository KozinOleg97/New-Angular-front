import { NgModule } from '@angular/core';
import { RootComponent } from './root.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditEployeeComponent } from './dialogs/edit-eployee/edit-eployee.component';
import { DeleteConfirmationComponent } from './dialogs/delete-confirmation/delete-confirmation.component';
import { EditRouteComponent } from './dialogs/edit-route/edit-route.component';
import { EditTransportComponent } from './dialogs/edit-transport/edit-transport.component';
import { EditScheduleComponent } from './dialogs/edit-schedule/edit-schedule.component';

const routes: Routes = [
  { path: '', component: RootComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
    ],
  declarations: [RootComponent, EditEployeeComponent, DeleteConfirmationComponent, EditRouteComponent, EditTransportComponent, EditScheduleComponent]
})
export class RootModule { }