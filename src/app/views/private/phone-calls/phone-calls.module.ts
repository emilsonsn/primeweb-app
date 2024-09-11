import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneCallsRoutingModule } from './phone-calls-routing.module';
import { PhoneCallsComponent } from './phone-calls/phone-calls.component';
import { SharedModule } from '@shared/shared.module';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    PhoneCallsComponent
  ],
  imports: [
    CommonModule,
    PhoneCallsRoutingModule,
    SharedModule,
    MatRippleModule
  ]
})
export class PhoneCallsModule { }
