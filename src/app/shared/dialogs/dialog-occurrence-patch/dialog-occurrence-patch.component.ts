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
  selector: 'app-dialog-occurrence-patch',
  templateUrl: './dialog-occurrence-patch.component.html',
  styleUrl: './dialog-occurrence-patch.component.scss'
})
export class DialogOccurrencePatchComponent {

  public loading : boolean = false;
  public title : string = 'Nova Ocorrência';
  protected isNewOrder : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  protected statusSelection = Object.values(PhoneCallOccurrenceStatusEnum);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogOccurrencePatchComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _occurrenceService : OccurrenceService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
    private readonly _contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null, [Validators.required]],
      observations: [''],      
    });

    this.form.patchValue(this._data);
  }


  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this.update(
      {
        ...this.form.getRawValue(),
      }
    );
  }

  private update(occurrence) {
    this._occurrenceService.patch(occurrence.id, occurrence)
    .subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this._dialogRef.close(true);
      },
      error: (error) => {
        this._toastr.error(error.error.message);
      }
    });
  }



  public onCancel(): void {
    this._dialogRef.close(false);
  }
}
