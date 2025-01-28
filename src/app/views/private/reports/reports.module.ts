import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';

import { TablesModule } from '@shared/tables/tables.module';
import { DialogTechnicianComponent } from '@shared/dialogs/dialog-technician/dialog-technician.component';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';

@NgModule({
  declarations: [
    ReportsComponent
   
    
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    TablesModule
  ]
})
export class ReportsModule { }
