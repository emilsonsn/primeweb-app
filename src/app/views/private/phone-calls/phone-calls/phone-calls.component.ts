import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {HeaderService} from '@services/header.service';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import {ToastrService} from 'ngx-toastr';
import {DialogPhoneCallComponent} from '@shared/dialogs/dialog-phone-call/dialog-phone-call.component';
import {DialogOccurrenceComponent} from '@shared/dialogs/dialog-occurrence/dialog-occurrence.component';
import {PhoneCallService} from '@services/phone-call.service';
import {PhoneCall} from '@models/phone-call';
import {
  DialogPhoneCallDetailsComponent
} from '@shared/dialogs/dialog-phone-call-details/dialog-phone-call-details.component';
import {DialogContactDetailsComponent} from "@shared/dialogs/dialog-contact-details/dialog-contact-details.component";

@Component({
  selector: 'app-phone-calls',
  templateUrl: './phone-calls.component.html',
  styleUrl: './phone-calls.component.scss',
})
export class PhoneCallsComponent {
  public formFilters: FormGroup;
  public filters;

  public loading: boolean = false;

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _toastrService: ToastrService,
    private readonly _phoneCallService: PhoneCallService
  ) {
    this._headerService.setTitle('Telefonemas');
    this._headerService.setUpperTitle('Telefonemas - Primeweb')
  }

  ngOnInit() {
    this.formFilters = this._fb.group({
      company: [''],
      domain: [''],
      phone: ['']
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

    this._dialog.open(DialogPhoneCallComponent, {
      ...dialogConfig,
    }).afterClosed()
      .subscribe((res) => {
        if (res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      });
  }

  public openEditPhoneCallDialog(phoneCall) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogPhoneCallComponent, {
        data: {phoneCall},
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      });
  }

  public openDetailsPhoneCallDialog(phoneCall) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogContactDetailsComponent, {
      data: phoneCall,
      ...dialogConfig,
    }).afterClosed()
      .subscribe((res) => {
        if (res) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 200);
        }
      });
    ;
  }

  public openNewOccurrenceDialog(phoneCall) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogOccurrenceComponent, {
      data: phoneCall,
      ...dialogConfig,
    });
  }

  public openDeletePhoneCallDialog(phoneCall: PhoneCall) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: {text: `Tem certeza? Essa ação não pode ser revertida!`},
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          if (res) {
            this._phoneCallService.delete(phoneCall.id).subscribe({
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

  public clearFormFilters() {
    this.formFilters.patchValue({
      company: '',
      phone: '',
      domain: ''
    })
    this.updateFilters();
  }

}
