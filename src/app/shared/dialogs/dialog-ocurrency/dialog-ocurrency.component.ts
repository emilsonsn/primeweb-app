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
import { DialogOrderSolicitationComponent } from '../dialog-order-solicitation/dialog-order-solicitation.component';
import { RequestService } from '@services/request.service';
import { RequestStatus } from '@models/request';
import { SessionQuery } from '@store/session.query';
import { PhoneCallStatus } from '@models/phone-call';

@Component({
  selector: 'app-dialog-ocurrency',
  templateUrl: './dialog-ocurrency.component.html',
  styleUrl: './dialog-ocurrency.component.scss'
})
export class DialogOcurrencyComponent {

  public loading : boolean = false;
  public title : string = 'Nova Ocorrência';
  protected isNewOrder : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  protected statusSelection = Object.values(PhoneCallStatus);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogOcurrencyComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _orderService : OrderService,
    private readonly _solicitationService : RequestService,
    private readonly _constructionService : ConstructionService,
    private readonly _userService : UserService,
    private readonly _supplierService : SupplierService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      date: [null, Validators.required],
      description: [''],
      status: [null, Validators.required],
    });

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

  public postOrder(order : RequestOrder) {
    if (!this.prepareFormData(order)){
      this.loading = false;
      return;
    }

    this._orderService.postOrder(this.prepareFormData(order))
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Pedido enviado com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error(err.error.error);
        }
      });
  }

  public patchOrder(id : number, order : RequestOrder) {
    if (!this.prepareFormData(order)){
      this.loading = false;
      return;
    }

    this._orderService.patchOrder(id, this.prepareFormData(order))
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Pedido atualizado com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error(err.error.error);
        }
      });
  }

  public prepareFormData(order : RequestOrder) {
    if(!order.items.length ){
      this._toastr.error('Item é um campo obrigatório');
      return;
    }

    const orderFormData = new FormData();

    Object.keys(order).forEach((key) => {

      if(key == 'order_files') {
        (order.order_files).forEach(file => {
          orderFormData.append('order_files[]', file);
        });
      }
      else if(key == 'date') {
        orderFormData.append('date', dayjs(order.date).format('YYYY-MM-DD'));
      }
      else if(key == 'items') {
        (order.items).forEach(item => {
          orderFormData.append('items[]', JSON.stringify(item));
        });
      }
      else
        orderFormData.append(key, order[key]);
    });

    return orderFormData;
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    console.log(this.form.getRawValue())

    if(this.isNewOrder) {
      this.postOrder(
        {
          ...this.form.getRawValue(),
          date : dayjs(this.form.get('date').value).format('YYYY-MM-DD HH:mm:ss')
        }
      );
    }
    else {}

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
