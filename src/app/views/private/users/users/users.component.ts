import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header.service';
import { RequestService } from '@services/request.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '@services/order.service';
import { SegmentStatus } from '@models/segment';
import { DialogSegmentComponent } from '@shared/dialogs/dialog-segment/dialog-segment.component';
import { UserService } from '@services/user.service';
import { finalize } from 'rxjs';
import { DialogUserComponent } from '@shared/dialogs/dialog-user/dialog-user.component';
import { User } from '@models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  public formFilters: FormGroup;
  public filters;

  public loading: boolean = false;

  protected statusSelection = Object.values(SegmentStatus);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _orderService: OrderService,
    private readonly _toastr: ToastrService
  ) {
    this._headerService.setTitle('Usuários');
    this._headerService.setUpperTitle('Usuários - Primeweb')
  }

  ngOnInit() {
    this.formFilters = this._fb.group({
      name : [null],
      email : [null],
      status : [null]
    });
  }

  // Modais
  openDialogUser(user?) {
    this._dialog
      .open(DialogUserComponent, {
        data: {user},
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const id = +res.get('id');
          if (id) {
            this._patchUser(res);
            return;
          }

          this._postUser(res);
        }
      });
  }

  _patchUser(user: FormData) {
    this._initOrStopLoading();
    const id = +user.get('id');
    this._userService
      .patchUser(id, user)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _postUser(user) {
    this._initOrStopLoading();

    this._userService
      .postUser(user)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  onDeleteUser(id) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, {data: {text}})
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.deleteUser(id);
        }
      });
  }

  deleteUser(id: number) {
    this._initOrStopLoading();
    this._userService
      .deleteUser(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Utils
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

}
