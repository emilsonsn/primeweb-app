import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {afterNextRender, Component, inject, Inject, Injector, signal, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {ApiResponse, PaymentForm} from '@models/application';
import {Banco, OrderResponsible, RequestOrder, RequestOrderStatus, RequestOrderType} from '@models/requestOrder';
import { User } from '@models/user';
import { ConstructionService } from '@services/construction.service';
import { OrderService } from '@services/order.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { RequestService } from '@services/request.service';
import { SessionQuery } from '@store/session.query';
import { PhoneCallOccurrenceStatusEnum, PhoneCallStatus } from '@models/phone-call';
import { OccurrenceService } from '@services/occurrence.service';
import { OccurrenceStatusEnum } from '@models/occurrence';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { DialogContactComponent } from '../dialog-contact/dialog-contact.component';
import { ContactService } from '@services/contact.service';

@Component({
  selector: 'app-dialog-occurrence',
  templateUrl: './dialog-occurrence.component.html',
  styleUrl: './dialog-occurrence.component.scss'
})
export class DialogOccurrenceComponent {

  public loading : boolean = false;
  public title : string = 'Nova Ocorrência';
  protected isNewOrder : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  protected statusSelection = Object.values(PhoneCallOccurrenceStatusEnum);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogOccurrenceComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _orderService : OrderService,
    private readonly _occurrenceService : OccurrenceService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
    private readonly _contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      date: [null, Validators.required],
      time: [null],
      observations: [''],
      status: [null, Validators.required],
      phone_call_id: [null]
    });
  }

  public post(occurrence) {
    this._initOrStopLoading();

    this._occurrenceService.post(occurrence)
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Ocorrência criada com sucesso!');
          if (this.form.get('status').value == 'ConvertedContact'){
            this.createContact();
          }
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error("Erro ao cadastrar ocorrência " + err.error.message);
        }
      });
  }

  public createContact(){
    this.openEditContactDialog(this._data);
  }

  public openEditContactDialog(contact) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      height: '90%',
      maxWidth: '1085px',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogContactComponent, {
      data: {
        contact :{
          ...contact,
          emails: [{id: null, email: contact.email}],
          phones: [{id: null, phone: contact.phone}],
        }
      },
      ...dialogConfig,
    }).afterClosed()
    .subscribe((res) => {
      if(res) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 200);
      }
    });
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this.post(
      {
        ...this.form.getRawValue(),
        date : dayjs(this.form.get('date').value).format('YYYY-MM-DD'),
        time : dayjs(this.form.get('date').value).format('HH:mm'),
        phone_call_id : this._data.id
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
