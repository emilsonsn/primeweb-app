import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructionRoutingModule } from './segments-routing.module';
import { SegmentsComponent } from './segments/segments.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    SegmentsComponent
  ],
  imports: [
    CommonModule,
    ConstructionRoutingModule,
    SharedModule,
    MatDialogModule,
  ]
})
export class SegmentsModule { }
