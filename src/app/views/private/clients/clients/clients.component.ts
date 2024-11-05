import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { debounceTime, map, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Segment } from '@models/segment';
import { SegmentService } from '@services/segment.service';
import { User, UserRoles } from '@models/user';
import { ClientStatusEnum } from '@models/client';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {

  protected _onDestroy = new Subject<void>();
  public loading: boolean = false;

  // Filters
  public formFilters: FormGroup;
  public filters;

  protected userSelect: User[] = [];
  protected technicalCtrl: FormControl<any> = new FormControl<any>(null);
  protected technicalFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredTechnicals: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  protected segmentSelect: Segment[] = [];
  protected segmentCtrl: FormControl<any> = new FormControl<any>(null);
  protected segmentFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredSegments: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  protected statusSelect = Object.values(ClientStatusEnum);

  constructor(
    private readonly _headerService: HeaderService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _fb: FormBuilder,
    private readonly _clientService: ClientService,
    private readonly _toastrService: ToastrService,
    private readonly _userService: UserService,
    private readonly _segmentService: SegmentService,

  ) {
    this._headerService.setTitle('Clientes');
    this._headerService.setUpperTitle('Clientes - Prime Web');

    // Getters
    this.getUsersFromBack();
    this.getSegmentsFromBack();

    // Filters Ctrl
    this.prepareFilterSegmentCtrl();
    this.prepareFilterTechnicalCtrl();
  }

  ngOnInit() {
    this.formFilters = this._fb.group({
      company: [''],
      domain: [''],
      status: [''],
      user_id: [''],
      segment_id: [''],
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

  // Filters
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      company: '',
      domain: '',
      segment_id: '',
      user_id: '',
      status: '',
    });
    this.updateFilters();
  }

  public clearStatus() {
    this.formFilters.get('status').patchValue('');
  }

  public clearSegment() {
    this.formFilters.get('segment_id').patchValue('');
  }

  public clearUserId() {
    this.formFilters.get('user_id').patchValue('');
  }

  // Filters Ctrl
  protected prepareFilterTechnicalCtrl() {
    this.technicalFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.userSelect
              .filter(
                (user) =>
                  user.role.toLowerCase() === UserRoles.Technical.toLowerCase()
              )
              .slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter((user) =>
              user.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredTechnicals.next(filtered);
      });
  }

  protected prepareFilterSegmentCtrl() {
    this.segmentFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.segmentSelect.slice();
          } else {
            return this.segmentSelect.filter((segment) =>
              segment.name.toLowerCase().includes(search)
            );

          }
        })
      )
      .subscribe((filtered) => {
        this.filteredSegments.next(filtered);
      });
  }

  // Getters
  public getUsersFromBack() {
    this._userService.getUsers().subscribe((res) => {
      this.userSelect = res.data;

      this.filteredTechnicals.next(
        this.userSelect
          .filter(
            (user) => user.role.toLowerCase() === UserRoles.Technical.toLowerCase()
          )
          .slice()

      );
    });
  }

  public getSegmentsFromBack() {
    this._segmentService.getList().subscribe((res) => {
      this.segmentSelect = res.data;

      this.filteredSegments.next(this.segmentSelect.slice());
    });
  }

}
