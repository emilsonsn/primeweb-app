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
import { OccurrenceService } from '@services/occurrence.service';
import { OccurrenceStatusEnum } from '@models/occurrence';

@Component({
  selector: 'app-dialog-occurrence-contact',
  templateUrl: './dialog-occurrence-contact.component.html',
  styleUrl: './dialog-occurrence-contact.component.scss'
})
export class DialogOccurrenceContactComponent {

  public loading : boolean = false;
  public title : string = 'Nova Ocorrência';
  protected isNewOrder : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  protected statusSelection = Object.values(OccurrenceStatusEnum);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogOccurrenceContactComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _occurrenceService : OccurrenceService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      date: [null, Validators.required],
      time: [null],
      observations: [''],
      link: [null, Validators.required],
      status: [null, Validators.required],
      contact_id: [null]
    });

  }

  public post(occurrence) {
    this._occurrenceService.post(occurrence)
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Ocorrência criada com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error("Erro ao cadastrar ocorrência " + err.error.message);
        }
      });
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    this.post(
      {
        ...this.form.getRawValue(),
        date : dayjs(this.form.get('date').value).format('YYYY-MM-DD'),
        time : dayjs(this.form.get('date').value).format('HH:mm'),
        contact_id : this._data.id
      }
    );

  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._dialogRef.close(false);
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
