import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SessionQuery } from '@store/session.query';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-phone-call-details',
  templateUrl: './dialog-phone-call-details.component.html',
  styleUrl: './dialog-phone-call-details.component.scss'
})
export class DialogPhoneCallDetailsComponent {


  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogPhoneCallDetailsComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
  ) { }

}
