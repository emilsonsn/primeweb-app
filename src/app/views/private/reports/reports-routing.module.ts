import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { 
    path: 'technicians', 
    loadChildren: () => import('./technicians/technicians.module').then(m => m.TechniciansModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
