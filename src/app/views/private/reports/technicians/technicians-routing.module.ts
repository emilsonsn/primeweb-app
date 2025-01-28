import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechniciansComponent } from './technicians.component';

const routes: Routes = [
  { path: '', component: TechniciansComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechniciansRoutingModule { }
