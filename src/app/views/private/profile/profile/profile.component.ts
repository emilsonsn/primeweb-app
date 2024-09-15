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
    name: 'Gabriel',
    email: 'gm@gmail.com',
    phone: '83996161228',
    cpf: '33333333327',
    cpf_cnpj: '24242424424255',
    birth_date: '2017-09-21',
    whatsapp: 0,
    status: UserStatus.ATIVO,
    createdAt: '2016-02-20',
    updatedAt: '2016-02-25',
    sector_id: ''
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
