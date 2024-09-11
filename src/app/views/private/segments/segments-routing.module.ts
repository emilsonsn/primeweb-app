import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SegmentsComponent} from "@app/views/private/segments/segments/segments.component";

const routes: Routes = [
  {
    path: '',
    component: SegmentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstructionRoutingModule { }
