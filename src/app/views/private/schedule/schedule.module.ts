import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import {MatRipple} from "@angular/material/core";
import {MatDivider} from "@angular/material/divider";


@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatRipple,
    MatDivider
  ]
})
export class ScheduleModule { }
