import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DialogConfirmComponent} from "@shared/dialogs/dialog-confirm/dialog-confirm.component";
import {Order, PageControl} from "@models/application";
import {ToastrService} from "ngx-toastr";
import {PhoneCallService} from "@services/phone-call.service";
import {SessionQuery} from "@store/session.query";
import {TestService} from "@services/test.service";
import {Occurrence} from "@models/occurrence";
import { SessionService } from '@store/session.service';
import { OccurrenceService } from '@services/occurrence.service';
import { DialogOccurrencePatchComponent } from '../dialog-occurrence-patch/dialog-occurrence-patch.component';

@Component({
  selector: 'app-dialog-contact-details',
  templateUrl: './dialog-contact-details.component.html',
  styleUrl: './dialog-contact-details.component.scss'
})
export class DialogContactDetailsComponent {

  public title: string = 'Detalhe de Ocorrências';
  is_admin: boolean = false;
  save: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly data: any,
    private readonly _toastr: ToastrService,
    private readonly _phoneCallService: PhoneCallService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _testService: TestService,
    private readonly dialogRef: MatDialogRef<DialogConfirmComponent>,
    private readonly _sessionService: SessionService,
    private readonly _occurrencesService: OccurrenceService,
    private readonly _dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    if (this.data?.text) {
      this.title = this.data.text;
    }

    if (this.data?.segments) {
      this.occurrences = this.data.occurrences;
    }

    this._sessionService.getUserFromBack().subscribe(res => {
      this.loadPermissions(res.role);
    });
  }

  public loadPermissions(role): void {
      if(role === 'Admin'){
        this.is_admin = true;
      }
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }


  public columns = [
    {
      slug: "id",
      order: false,
      title: "Id",
      classes: "",
    },
    {
      slug: "time",
      order: false,
      title: "Data e Hora",
      classes: "",
    },
    {
      slug: "observations",
      order: false,
      title: "Observações",
      classes: "",
    },
    {
      slug: "status",
      order: false,
      title: "Status",
      classes: "",
    },
  ];

  public occurrences: Occurrence[] = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  isFinancial: boolean = false;


  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  public openEditOccurenceDialog(occurrence) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      height: '300px',
      maxWidth: '500px',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogOccurrencePatchComponent, {
      data: occurrence,
      ...dialogConfig,
    }).afterClosed()
    .subscribe((res) => {
      if(res) {
        this.dialogRef.close(true);
      }
    });
  }

  deleteOccurrence(id){
    this._occurrencesService
    .delete(id)
    .subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this.dialogRef.close(true);
      },
      error: (error) =>{
        this._toastr.error(error.error.message);
      }
    })
  }

}
