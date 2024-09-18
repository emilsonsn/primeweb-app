import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header.service';
import { RequestService } from '@services/request.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '@services/order.service';
import { DialogPhoneCallComponent } from '@shared/dialogs/dialog-phone-call/dialog-phone-call.component';
import { DialogOccurrenceComponent } from '@shared/dialogs/dialog-occurrence/dialog-occurrence.component';
import { ContactStatus } from '@models/contact';
import { DialogContactComponent } from '@shared/dialogs/dialog-contact/dialog-contact.component';
import { DialogContactDetailsComponent } from '@shared/dialogs/dialog-contact-details/dialog-contact-details.component';
import { DialogOccurrenceContactComponent } from '@shared/dialogs/dialog-occurrence-contact/dialog-occurrence-contact.component';
import { ContactService } from '@services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  public formFilters: FormGroup;
  public filters;

  public loading: boolean = false;

  protected statusSelection = Object.values(ContactStatus);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _contactService : ContactService,
    private readonly _orderService: OrderService,
    private readonly _toastrService: ToastrService
  ) {
    this._headerService.setTitle('Contatos');
    this._headerService.setUpperTitle('Contatos - Primeweb');
  }

  ngOnInit() {
    this.formFilters = this._fb.group({
      enterprise : [null],
      email : [null],
      domain : [null],
      telephone : [null],
      name : [null],
      status : [null],
      responsible : [null],
      origin : [null],
    })
  }

  // Modais
  public newContactDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      height: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogContactComponent, {
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

  public openEditContactDialog(contact) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      height: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogContactComponent, {
      data: { contact },
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

  public openDetailsContactDialog(request?) {
    this._orderService.getOrderById(request.order_id).subscribe((order) => {
      const dialogConfig: MatDialogConfig = {
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
        hasBackdrop: true,
        closeOnNavigation: true,
      };

      this._dialog.open(DialogContactComponent, {
        data: { order: order, edit: false },
        ...dialogConfig,
      });
    });
  }

  public openNewOccurrenceContactDialog(request) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogOccurrenceContactComponent, {
      ...dialogConfig,
    });
  }

  public openDeleteContactDialog(request) {
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
            this._contactService.delete(request.id).subscribe({
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
    console.log(this.formFilters.getRawValue())
    this.filters = this.formFilters.getRawValue();
  }
}

