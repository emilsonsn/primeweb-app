import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructionRoutingModule } from './segments-routing.module';
import { SegmentsComponent } from './segments/segments.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    SegmentsComponent
  ],
  imports: [
    CommonModule,
    ConstructionRoutingModule,
    SharedModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SegmentsModule { }
