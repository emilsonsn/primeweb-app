import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientStatusEnum } from '@models/client';
import { ClientService } from '@services/client.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-client-status',
  templateUrl: './dialog-client-status.component.html',
  styleUrls: ['./dialog-client-status.component.scss']
})
export class DialogClientStatusComponent implements OnInit {

  protected loading : boolean = false;
  protected form: FormGroup;

  public statusSelect: string[] = Object.values(ClientStatusEnum);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly dialogRef: MatDialogRef<DialogClientStatusComponent>,
    private readonly _fb : FormBuilder,
    private readonly _clientService : ClientService,
    private readonly _toastr : ToastrService
  ) { }

  ngOnInit(): void {

    this.form = this._fb.group({
      client_id : [this._data?.client?.id, Validators.required],
      status: ['', Validators.required],
      date : ['']
    });

    console.log(this._data);
    console.log(this.form.getRawValue())
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    this._clientService.changeStatus({
      ...this.form.getRawValue(),
      date : dayjs(this.form.get('date').value).format('YYYY-MM-DD')
    })
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next : (res) => {
          this._toastr.success("Cliente atualizado!");
          this.dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error("Erro ao atualizar cliente!");
        }
      })

  }


  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

}
