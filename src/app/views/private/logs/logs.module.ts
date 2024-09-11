import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponent } from './logs/logs.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import {MatRipple} from "@angular/material/core";


@NgModule({
  declarations: [
    LogsComponent
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    SharedModule,
    MatDialogModule,
    MatRipple,
  ]
})
export class LogsModule { }
