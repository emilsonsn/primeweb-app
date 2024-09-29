import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogConfirmComponent} from "@shared/dialogs/dialog-confirm/dialog-confirm.component";
import {Order, PageControl} from "@models/application";
import {ToastrService} from "ngx-toastr";
import {PhoneCallService} from "@services/phone-call.service";
import {SessionQuery} from "@store/session.query";
import {TestService} from "@services/test.service";
import {Occurrence} from "@models/occurrence";

@Component({
  selector: 'app-dialog-contact-details',
  templateUrl: './dialog-contact-details.component.html',
  styleUrl: './dialog-contact-details.component.scss'
})
export class DialogContactDetailsComponent {

  public title: string = 'Detalhe de Ocorrências';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly data: any,
    private readonly _toastr: ToastrService,
    private readonly _phoneCallService: PhoneCallService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _testService: TestService,
    private readonly dialogRef: MatDialogRef<DialogConfirmComponent>,
  ) {
  }

  ngOnInit(): void {
    if (this.data?.text) {
      this.title = this.data.text;
    }

    if (this.data?.segments) {
      this.occurrences = this.data.occurrences;
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


}
