import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContactOrigin } from '@models/contact';
import { Service } from '@models/service';
import { HeaderService } from '@services/header.service';
import { ServiceService } from '@services/service.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogServiceComponent } from '@shared/dialogs/dialog-service/dialog-service.component';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  public loading: boolean = false;

  public formFilters: FormGroup;
  public filters;

  userSelection = Object.values(ContactOrigin);

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _serviceService: ServiceService,
    private readonly _fb: FormBuilder,
    private readonly _headerService: HeaderService
  ) {
    this._headerService.setTitle('Logs');
    this._headerService.setUpperTitle('Logs - Primeweb')
  }

  ngOnInit() {
    this.formFilters = this._fb.group({
      user : [null],
      date : [null]
    })
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  openDialogService(service?: Service) {
    this._dialog
      .open(DialogServiceComponent, {
        data: { service },
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.id) {
            this._patchService(res);
            return;
          }

          this._postService(res);
        }
      });
  }

  _patchService(service: Service) {
    this._initOrStopLoading();

    this._serviceService
      .patchService(service.id, service)
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

  _postService(service: Service) {
    this._initOrStopLoading();

    this._serviceService
      .postService(service)
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

  onDeleteService(id: number) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteService(id);
        }
      });
  }

  _deleteService(id: number) {
    this._initOrStopLoading();
    this._serviceService
      .deleteService(id)
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
    console.log(this.formFilters.getRawValue())
    this.filters = {
      ...this.formFilters.getRawValue(),
      date : dayjs(this.formFilters.get('date').value).format("YYYY-MM-DD")
    };
  }

}
