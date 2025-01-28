import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechniciansRoutingModule } from './technicians-routing.module';
import { TechniciansComponent } from './technicians.component';
import { TableTechniciansComponent } from '@shared/tables/table-technicians/table-technicians.component';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { MatOptionModule, MatRipple } from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    TechniciansComponent
  ],
  imports: [
    CommonModule,
    TechniciansRoutingModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatRipple,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMatSelectSearchModule,
    MatTabsModule
  ]
})
export class TechniciansModule { }
