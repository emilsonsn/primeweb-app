import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneCallsRoutingModule } from './phone-calls-routing.module';
import { PhoneCallsComponent } from './phone-calls/phone-calls.component';
import { SharedModule } from '@shared/shared.module';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    PhoneCallsComponent
  ],
  imports: [
    CommonModule,
    PhoneCallsRoutingModule,
    SharedModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatRippleModule
  ]
})
export class PhoneCallsModule { }
