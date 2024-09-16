import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {afterNextRender, Component, inject, Inject, Injector, signal, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { SessionQuery } from '@store/session.query';
import { PhoneCallService } from '@services/phone-call.service';
import { PhoneCall } from '@models/phone-call';
import { Utils } from '@shared/utils';

@Component({
  selector: 'app-dialog-phone-call',
  templateUrl: './dialog-phone-call.component.html',
  styleUrl: './dialog-phone-call.component.scss'
})
export class DialogPhoneCallComponent {

  public title : string = 'Criar telefonema';

  public loading : boolean = false;

  public utils = Utils;

  protected isNewPhoneCall : boolean = true;

  protected form : FormGroup;

  public isAdmin = false;

  protected date;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogPhoneCallComponent>,
    private readonly _fb : FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _phoneCallService : PhoneCallService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      company: [null, Validators.required],
      domain: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      return_date: [null],
      return_time: [null],
      observations: [''],
    });

    if (this._data) {
      this.isNewPhoneCall = false;
      this.title = 'Editar Telefonema';

      this.form.patchValue({
        ...this._data.phoneCall,
        return_time: dayjs(this._data.return_time).format('HH:mm')
      });

      const returnDate = this.form.get('return_date').value + `T${this.form.get('return_time').value}`;
      this.date = new Date(returnDate);
    }
  }

  public postPhoneCall(phoneCall : PhoneCall) {
    if (!this.prepareFormData(phoneCall)){
      this.loading = false;
      return;
    }

    this._phoneCallService.post(this.prepareFormData(phoneCall))
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Telefonema criado com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error("Erro ao cadastrar telefonema: " + err.error.message);
        }
      });
  }

  public patchPhoneCall(id : number, phoneCall : PhoneCall) {
    if (!this.prepareFormData(phoneCall)){
      this.loading = false;
      return;
    }

    this._phoneCallService.patch(id, this.prepareFormData(phoneCall))
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this._toastr.success('Telefonema atualizado com sucesso!');
          this._dialogRef.close(true);
        },
        error : (err) => {
          this._toastr.error("Erro ao atualizar telefonema: " + err.error.message);
        }
      });
  }

  public prepareFormData(phoneCall : PhoneCall) {
    const phoneCallFormData = new FormData();

    console.log(phoneCall)

    Object.keys(phoneCall).forEach((key) => {
      phoneCallFormData.append(key, phoneCall[key]);
    });

    return phoneCallFormData;
  }

  public onConfirm(): void {
    if(!this.form.valid || this.loading || !this.date) return;

    this._initOrStopLoading();

    if(this.isNewPhoneCall) {
      this.postPhoneCall(
        {
          ...this.form.getRawValue(),
          return_date: dayjs(this.date).format('YYYY-MM-DD'),
          return_time: dayjs(this.date).format('HH:mm')
        }
      );
    }
    else {
      this.patchPhoneCall(
        this._data.phoneCall.id,
        {
          ...this.form.getRawValue()
        }
      );
    }

  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  // Imports
  // TextArea
  private _injector = inject(Injector);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      },
    );
  }

}
