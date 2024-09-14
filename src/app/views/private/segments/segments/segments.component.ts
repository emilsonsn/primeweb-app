import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header.service';
import { RequestService } from '@services/request.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '@services/order.service';
import { DialogOcurrencyComponent } from '@shared/dialogs/dialog-ocurrency/dialog-ocurrency.component';
import { SegmentStatus } from '@models/segment';
import { DialogSegmentComponent } from '@shared/dialogs/dialog-segment/dialog-segment.component';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrl: './segments.component.scss'
})
export class SegmentsComponent {
  public formFilters: FormGroup;
  public filters;

  public loading: boolean = false;

  protected statusSelection = Object.values(SegmentStatus);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _requestService: RequestService,
    private readonly _orderService: OrderService,
    private readonly _toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.formFilters = this._fb.group({
      name : [null],
      status : [null]
    })
  }

  // Modais
  public openNewPhoneCallDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogSegmentComponent, {
      ...dialogConfig,
    });
  }
  public openEditSegmentDialog(request) {
    this._orderService.getOrderById(request.order_id).subscribe((order) => {
      const dialogConfig: MatDialogConfig = {
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
        hasBackdrop: true,
        closeOnNavigation: true,
      };

      this._dialog.open(DialogSegmentComponent, {
        data: { order: order, edit: true },
        ...dialogConfig,
      });
    });
  }

  public openDeleteSegmentDialog(request) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: { text: `Tem certeza? Essa ação não pode ser revertida!` },
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this._requestService.deleteRequest(request.id).subscribe({
              next: (resData) => {
                this.loading = true;
                this._toastrService.success(resData.message);
                setTimeout(() => {
                  this.loading = false;
                }, 200);
              },
            });
          }
        },
      });
  }

  public testSegmentDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogSegmentComponent, {
      ...dialogConfig,
    });
  }

  // Utils
  public updateFilters() {
    console.log(this.formFilters.getRawValue())
    this.filters = this.formFilters.getRawValue();
  }
}



