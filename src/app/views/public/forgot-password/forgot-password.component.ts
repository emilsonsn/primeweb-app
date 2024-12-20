import {Component} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "@services/user.service";
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  primaryBtnText: string = "Continuar";
  disablePrimaryBtn: boolean = false;
  showInput: boolean = true;
  countdown: number = 60;
  intervalId: any;
  loading: boolean = false;

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private readonly _userService: UserService,
    private readonly _toastr : ToastrService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.disablePrimaryBtn = true;
      this.loading = true;

      this._userService.recoverPassword(this.emailForm.value.email)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe({
          next: (res) => {
            this.showInput = false;

            this.startCountdown();
          },
          error: (err) => {
            this._toastr.error("Erro ao enviar e-mail de recuperação!")
            this.showInput = true;
            this.disablePrimaryBtn = false;
          }
          });
    }
  }

  onBack() {
    // Lógica para voltar à página anterior
    this.router.navigate(['login']);
  }

  startCountdown() {
    this.disablePrimaryBtn = true;
    this.primaryBtnText = `Reenviar (${this.countdown}s)`;
    this.intervalId = setInterval(() => {
      this.countdown--;
      this.primaryBtnText = `Reenviar (${this.countdown}s)`;
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.disablePrimaryBtn = false;
        this.primaryBtnText = "Reenviar";
        this.countdown = 60; // Reset countdown
      }
    }, 1000);
  }

  options: AnimationOptions = {
    path: '/assets/json/animation_no_recover.json',
  };

}
