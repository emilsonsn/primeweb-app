import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {afterNextRender, Component, inject, Inject, Injector, signal, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { RequestService } from '@services/request.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-dialog-phone-call',
  templateUrl: './dialog-phone-call.component.html',
  styleUrl: './dialog-phone-call.component.scss'
})
export class DialogPhoneCallComponent {

  public loading : boolean = false;
  public title : string = 'Criar telefonema';
  protected isNewOrder : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  protected selectedFiles: File[] = [];
  protected filesToSend : {
    id: number,
    preview: string,
    file: File,
  }[] = [];

  protected filesToRemove : number[] = [];
  protected filesFromBack : {
    index : number,
    id: number,
    name : string,
    path: string, // Wasabi
  }[] = [];

  // Getters
  protected requestTypeSelection = Object.values(RequestOrderType);
  protected requestStatusSelection = Object.values(RequestOrderStatus);
  protected requestOrderPaymentSelection = Object.values(PaymentForm);
  protected requestResponsibleSelection = Object.values(OrderResponsible);

  protected constructions : Construction[] = [];
  protected users : User[] = [];
  protected suppliers : Supplier[] = [];
  protected typeSuppliers : SupplierType[] = [];

  public allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

  public bancos = signal<Banco[]>([]);
  public categories = signal<any[]>([]);

  public isAdmin = false;
  public hasGranatum = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogPhoneCallComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _orderService : OrderService,
    private readonly _solicitationService : RequestService,
    private readonly _constructionService : ConstructionService,
    private readonly _userService : UserService,
    private readonly _supplierService : SupplierService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
  ) {

    this._orderService.getBank().subscribe((b: ApiResponse<Banco[]>) => {
      this.bancos.set(b.data);
    })

    this._orderService.getCategories().subscribe((b: ApiResponse<any[]>) => {
      this.categories.set(b.data);
    })
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      enterprise: [null, Validators.required],
      domain: [null, Validators.required],
      telephone: [null, Validators.required],
      email: [null, Validators.required],
      date: [null, Validators.required],
      description: [''],
    });


    if (this._data) {
      this.isNewOrder = false;
      this.title = 'Editar Pedido';


      if(!this._data.edit) {
        this.isToEdit = true;
        this.form.disable();
      }

      this._data.order.files.forEach((file, index) => {
        this.filesFromBack.push({
          index : index,
          id: file.id,
          name: file.name,
          path: file.path
        });
      });

      this.form.patchValue(this._data.order);
    }

  }


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

    if(!order.order_files.length && !this.filesFromBack.length){
      this._toastr.error('Anexo é um campo obrigatório');
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

    if(this.isNewOrder) {
      this.postOrder(
        {
          ...this.form.getRawValue()
        }
      );
    }
    else {
      this.filesToRemove.forEach(file => {
        this._orderService.deleteFile(file)
          .subscribe({
            next : (res) => {

            },
            error : (err) => {
              this._toastr.error(err.error.error);
            }
          })
        })

      this.patchOrder(
        this._data.order.id,
        {
          ...this.form.getRawValue()
        }
      );
    }

  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

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
