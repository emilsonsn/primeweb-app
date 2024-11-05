import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRoles, UserStatus } from '@models/user';
import { HeaderService } from '@services/header.service';
import { SessionService } from '@store/session.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  protected form : FormGroup;
  protected loading : boolean = false;
  protected loadingUser : boolean = false;

  protected confirm_password : string;
  protected previous_password :string;

  protected user? : User;

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _fb : FormBuilder,
    private readonly _toastrService : ToastrService,
    private readonly _sessionService: SessionService
  ) {
    this._headerService.setTitle('Perfil');
    this._headerService.setUpperTitle('Perfil - Prime Web')
  }

  ngOnInit() {
    this.getUserFromBack();

    this.form = this._fb.group({
      name : [null, Validators.required],
      telephone : [null, Validators.required],
    });
  }

  protected onSubmit() {
    if(this.loading || !this.form.valid) return;


  }

  // Utils

  public getUserFromBack() {
    this._initOrStopLoadingUser();

    this._sessionService.getUserFromBack()
      .pipe(finalize(() => {
        this._initOrStopLoadingUser();
      }))
      .subscribe(res => {
        this.user = res;

        this.form.patchValue({
          name : this.user.name,
          telephone : this.user.phone
        });

      });
  }

  public _initOrStopLoading() : void {
    this.loading = !this.loading;
  }

  public _initOrStopLoadingUser() : void {
    this.loadingUser = !this.loadingUser;
  }

}
