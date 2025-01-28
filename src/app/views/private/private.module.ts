import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import {HomeModule} from "@app/views/private/home/home.module";
import { ReportsComponent } from './reports/reports.component';
import { TechniciansComponent } from './reports/technicians/technicians.component';
import { SharedModule } from '@shared/shared.module'; 
import { TablesModule } from '@shared/tables/tables.module'; 
import { DialogTechnicianComponent } from '@shared/dialogs/dialog-technician/dialog-technician.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';


@NgModule({
  declarations: [


  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    HomeModule,
    SharedModule,
    TablesModule
  ]
})
export class PrivateModule { }
