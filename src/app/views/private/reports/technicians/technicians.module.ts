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
import { TechnicianContactComponent } from './technician-contact/technician-contact.component';
import { TechnicianPositionComponent } from './technician-position/technician-position.component';
import { TableTechnicianContactComponent } from '@shared/tables/table-technicians/table-technician-contact/table-technician-contact.component';
import { AnnualGridComponent } from './technician-position/annual-grid/annual-grid.component';
import { CurrentPositionComponent } from './technician-position/current-position/current-position.component';
import { TablesModule } from '@shared/tables/tables.module';

@NgModule({
  declarations: [
    TechniciansComponent,
    TechnicianContactComponent,
    TechnicianPositionComponent,
    AnnualGridComponent,
    CurrentPositionComponent,
    
    
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
    MatTabsModule,
    TablesModule
  ]
})
export class TechniciansModule { }
