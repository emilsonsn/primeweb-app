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
import { Segment, SegmentStatus } from '@models/segment';
import { SegmentService } from '@services/segment.service';

@Component({
  selector: 'app-dialog-segment',
  templateUrl: './dialog-segment.component.html',
  styleUrl: './dialog-segment.component.scss'
})
export class DialogSegmentComponent {

  public loading : boolean = false;
  public title : string = 'Criar segmento';
  protected isNewSegment : boolean = true;
  protected isToEdit : boolean = false;

  protected form : FormGroup;

  // Getters
  protected statusSelection = Object.values(SegmentStatus);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogSegmentComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _segmentService : SegmentService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      name : [null, Validators.required],
      status : [null, Validators.required]
    });


    if (this._data) {
      this.isNewSegment = false;
      this.title = 'Editar Segmento';

      this.form.patchValue(this._data.segment);
    }

  }

  public post(segment : Segment) {
    if (!this.prepareFormData(segment)){
      this.loading = false;
      return;
    }

    this._segmentService.post(this.prepareFormData(segment))
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

  public patch(id : number, segment : Segment) {
    if (!this.prepareFormData(segment)){
      this.loading = false;
      return;
    }

    this._segmentService.patch(id, this.prepareFormData(segment))
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

  public prepareFormData(segment : Segment) {
    const orderFormData = new FormData();

    Object.keys(segment).forEach((key) => {
      orderFormData.append(key, segment[key]);
    });

    return orderFormData;
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    if(this.isNewSegment) {
      this.post(
        {
          ...this.form.getRawValue()
        }
      );
    }
    else {
      this.patch(
        this._data.segment.id,
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
