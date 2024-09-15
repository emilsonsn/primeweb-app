import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import {MatRipple} from "@angular/material/core";
import {MatDivider} from "@angular/material/divider";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';


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
    MatDivider,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    FullCalendarModule
  ]
})
export class ScheduleModule { }
