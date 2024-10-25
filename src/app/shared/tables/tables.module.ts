import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconButton } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import { TableUserComponent } from './table-users/table-users.component';
import {AvatarModule} from "@shared/components/avatar/avatar.module";
import { TablePhoneCallsComponent } from './table-phone-calls/table-phone-calls.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableSegmentsComponent } from './table-segments/table-segments.component';
import { TableContactsComponent } from './table-contacts/table-contacts.component';
import { TableLogsComponent } from './table-logs/table-logs.component';
import { MatIconModule } from '@angular/material/icon';
import { TableClientsComponent } from './table-clients/table-clients.component';
import { TableClientsContractsComponent } from './table-clients-contracts/table-clients-contracts.component';

const tables = [
  TableUserComponent,
  TablePhoneCallsComponent,
  TableSegmentsComponent,
  TableContactsComponent,
  TableLogsComponent,
  TableClientsComponent,
  TableClientsContractsComponent
]

@NgModule({
  declarations: [
    tables,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconButton,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    PipesModule,
    AvatarModule,
    MatIconModule,
  ],
  exports: [
    tables
  ],
})
export class TablesModule { }
