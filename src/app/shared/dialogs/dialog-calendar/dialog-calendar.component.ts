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

  protected statusSelection = Object.values(PhoneCallStatus);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogCalendarComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      date: [null, Validators.required],
      description: [''],
      status: [null, Validators.required],
    });

    this.form.disable();

    console.log(this._data)

    this.title = this._data._def.publicId;


  }

  // public loadPermissions(){
  //   this._sessionQuery.user$.subscribe(user => {
  //     if(user && user?.company_position.position !== 'Requester') {
  //       this.isAdmin = true;
  //     }else{
  //       this.form.get('purchase_status').disable();
  //     }
  //   })
  // }


  public prepareFormData(order : RequestOrder) {
    if(!order.items.length ){
      this._toastr.error('Item é um campo obrigatório');
      return;
    }

    const orderFormData = new FormData();

    Object.keys(order).forEach((key) => {
      orderFormData.append(key, order[key]);
    });

    return orderFormData;
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    console.log(this.form.getRawValue())

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
