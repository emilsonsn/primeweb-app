import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {afterNextRender, Component, inject, Inject, Injector, signal, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {ApiResponse, PaymentForm} from '@models/application';
import { Construction } from '@models/construction';
import { Supplier, SupplierType } from '@models/supplier';
import {Banco, OrderResponsible, RequestOrder, RequestOrderStatus, RequestOrderType} from '@models/requestOrder';
import { User } from '@models/user';
import { ConstructionService } from '@services/construction.service';
import { OrderService } from '@services/order.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { dateValidator } from '@shared/validators/date';
import { RequestService } from '@services/request.service';
import { RequestStatus } from '@models/request';
import { SessionQuery } from '@store/session.query';
import { PhoneCallStatus } from '@models/phone-call';
import { OccurrenceStatusEnum } from '@models/occurrence';
import { OccurrenceService } from '@services/occurrence.service';

@Component({
  selector: 'app-dialog-calendar',
  templateUrl: './dialog-calendar.component.html',
  styleUrl: './dialog-calendar.component.scss'
})
export class DialogCalendarComponent {

  public loading : boolean = false;
  public title : string = 'Nova Ocorrência';
  protected isNewOrder : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  protected statusSelection = Object.values(OccurrenceStatusEnum);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogCalendarComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _dialog: MatDialog,
    private readonly _occurenceService : OccurrenceService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      date: [null, Validators.required],
      observations: [''],
      status: [null, Validators.required],
    });

    this.form.disable();

    this.title = `Ocorrência de ${this._data?.contact?.responsible || ''} | ID ${this._data?.id}`;

    this.form.patchValue({
      date: `${this._data?.date}T${this._data?.time}`,
      observations: this._data?.observations,
      status: this._data?.status,
    })
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    this._occurenceService.patch(this._data?.id, {
      ...this.form.getRawValue(),
      date: dayjs(this.form.get('date').value).format('YYYY-MM-DD'),
      time: dayjs(this.form.get('date').value).format('HH:mm')
    })
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Ocorrência atualizada com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error('Ocorreu um erro ao atualizar a ocorrência!');
        }
      })

  }

  public resendEmail(){
    this._occurenceService.resendEmail(this._data.id)
    .subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this._dialogRef.close(true);
      },
      error : (err) => {
        this._toastr.error(err.error.message);
      }
    })
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  public toggleEdit() : void {
    this.form.disabled ? this.form.enable() : this.form.disable();
  }

  // Getters


  // Imports
  // TextArea
  private _injector = inject(Injector);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      },
    );
  }

}
