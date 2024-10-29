import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderService } from '@services/header.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '@services/order.service';
import { ContactOriginEnum } from '@models/contact';
import { ContactService } from '@services/contact.service';
import { UserService } from '@services/user.service';
import { OccurrenceStatusEnum } from '@models/occurrence';
import { DialogClientComponent } from '@shared/dialogs/dialog-client/dialog-client.component';
import { ClientService } from '@services/client.service';
import { DialogClientStatusComponent } from '@shared/dialogs/dialog-client-status/dialog-client-status.component';
import { DialogClientKeywordComponent } from '@shared/dialogs/dialog-client-keyword/dialog-client-keyword.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  public formFilters: FormGroup;
  public filters;

  public loading: boolean = false;

  protected usersSelection;

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _clientService: ClientService,
    private readonly _orderService: OrderService,
    private readonly _toastrService: ToastrService,
    private readonly _userService: UserService
  ) {
    this._headerService.setTitle('Clientes');
    this._headerService.setUpperTitle('Clientes - Primeweb');
  }

  ngOnInit() {
    this.getUsers();

    this.formFilters = this._fb.group({
      company: [''],
      email: [''],
      domain: [''],
      phone: [''],
      name: [''],
      status: [''],
      user_id: [''],
      segment: [''],
      projeto: [''],
      tecnico: [''],
    });
  }

  // Modais
  public newClientDialog() {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      height: '90%',
      maxWidth: '1085px',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogClientComponent, {
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

  public openEditClientDialog(client) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      height: '90%',
      maxWidth: '1085px',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogClientComponent, {
        data: { client },
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

  public openDeleteClientDialog(request) {
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
            this._clientService.delete(request.id).subscribe({
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

  protected editStatus(client): void {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '550px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogClientStatusComponent, {
        data: { client },
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

  protected openKeyword(client): void {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      height: '80%',
      maxWidth: '1085px',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogClientKeywordComponent, {
        data: { client },
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

  // Utils
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearStatus() {
    this.formFilters.get('status').patchValue('');
    this.updateFilters();
  }

  public clearResponsible() {
    this.formFilters.get('responsible').patchValue('');
    this.updateFilters();
  }

  public clearOrigin() {
    this.formFilters.get('origin').patchValue('');
    this.updateFilters();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      company: '',
      domain: '',
      segment: '',
      tecnico: '',
      projeto: '',
      status: '',
    });
    this.updateFilters();
  }

  public getUsers() {
    this._userService.getUsers().subscribe({
      next: (res) => {
        this.usersSelection = res.data;
      },
    });
  }
}
