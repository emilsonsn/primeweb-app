import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { SegmentStatus } from '@models/segment';
import { DialogSegmentComponent } from '@shared/dialogs/dialog-segment/dialog-segment.component';
import { SegmentService } from '@services/segment.service';

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
    private readonly _segmentService : SegmentService,
    private readonly _toastrService: ToastrService
  ) {
    this._headerService.setTitle('Segmentos');
    this._headerService.setUpperTitle('Segmentos - Primeweb')
  }

  ngOnInit() {
    this.formFilters = this._fb.group({
      name : [''],
      status : ['']
    })
  }

  // Modais
  public openNewSegmentDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogSegmentComponent, {
      ...dialogConfig,
    })
    .afterClosed()
      .subscribe((res) => {
        if(res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      });

  }

  public openEditSegmentDialog(segment) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogSegmentComponent, {
      data: { segment },
      ...dialogConfig,
    })
    .afterClosed()
      .subscribe((res) => {
        if(res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
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
            this._segmentService.delete(request.id).subscribe({
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

  // Utils
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearStatus() {
    this.formFilters.get('status').patchValue('');
    this.updateFilters();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      name : '',
      status : ''
    })
    this.updateFilters();
  }

}
