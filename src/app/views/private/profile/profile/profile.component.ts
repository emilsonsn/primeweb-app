import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserStatus } from '@models/user';
import { HeaderService } from '@services/header.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  protected form : FormGroup;
  protected loading : boolean = false;

  protected confirm_password : string;
  protected previous_password :string;

  protected user : User = {
    name: '',
    email: '',
    is_active: false,
    role: ''
  }

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _fb : FormBuilder,
    private readonly _toastrService : ToastrService
  ) {
    this._headerService.setTitle('Perfil');
    this._headerService.setUpperTitle('Perfil - Primeweb')
  }

  ngOnInit() {
    this.form = this._fb.group({
      name : [null, Validators.required],
      telephone : [null, Validators.required],
      password : [null, Validators.required],
    });
  }

  protected onSubmit() {
    if(this.loading || !this.form.valid) return;

    if(this.form.get('password').value != this.previous_password) {
      if(this.form.get('password').value != this.confirm_password) {
        this._toastrService.error('As senhas não conferem!');
        return;
      }
    }

  }

}
