import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SessionRoutingModule} from './session-routing.module';
import {LoginComponent} from './login/login.component';
import {SharedModule} from "@shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    PasswordRecoveryComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatError,
    MatLabel,
    MatInput,
    MatSuffix,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatButton,
    MatProgressSpinnerModule,

  ]
})
export class SessionModule {
}
