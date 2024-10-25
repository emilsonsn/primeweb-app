import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientStatusEnum } from '@models/client';
import { ClientService } from '@services/client.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-client-keyword',
  templateUrl: './dialog-client-keyword.component.html',
  styleUrls: ['./dialog-client-keyword.component.scss']
})
export class DialogClientKeywordComponent implements OnInit {

  protected loading : boolean = false;
  protected form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly dialogRef: MatDialogRef<DialogClientKeywordComponent>,
    private readonly _fb : FormBuilder,
    private readonly _clientService : ClientService,
    private readonly _toastr : ToastrService
  ) { }

  ngOnInit(): void {

    this.form = this._fb.group({
      client_id : [this._data?.client?.id, Validators.required],
      word_key: ['', Validators.required],
    });

  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    this._clientService.postKeyword({
      ...this.form.getRawValue(),
    })
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next : (res) => {
          this._toastr.success("Palavra chave adicionada!");
        },
        error : (err) => {
          this._toastr.error("Erro ao adicionar palavra chave!");
        }
      })

  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

}
