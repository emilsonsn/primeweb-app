import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importando componentes compartilhados
import { TableTechniciansComponent } from './tables/table-technicians/table-technicians.component';
import { TableTechnicianContactComponent } from './tables/table-technicians/table-technician-contact/table-technician-contact.component';

// Importando módulos compartilhados
import { DialogsModule } from './dialogs/dialogs.module';
import { DirectivesModule } from './directives/directives.module';
import { LayoutsModule } from './layouts/layouts.module';
import { PipesModule } from './pipes/pipes.module';
import { TablesModule } from './tables/tables.module';
import { ComponentsModule } from './components/components.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    TableTechniciansComponent,
    TableTechnicianContactComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DialogsModule,
    DirectivesModule,
    LayoutsModule,
    MatProgressSpinnerModule,
    PipesModule,
    TablesModule,
    MatPaginatorModule,
  ],
  exports: [
    ComponentsModule,
    DialogsModule,
    DirectivesModule,
    LayoutsModule,
    PipesModule,
    TablesModule,
    TableTechniciansComponent,
    TableTechnicianContactComponent,
    MatPaginatorModule
  ]
})
export class SharedModule { }
