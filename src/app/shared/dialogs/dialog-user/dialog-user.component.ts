import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '@services/user.service';
import { User, UserRoles } from '@models/user';
import dayjs from 'dayjs';
import { Utils } from '@shared/utils';
import { Estados } from '@models/utils';
import { UtilsService } from '@services/utils.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrl: './dialog-user.component.scss',
})
export class DialogUserComponent {
  public isNewUser: boolean = true;
  public title: string = 'Novo Usuário';
  public form: FormGroup;
  public loading: boolean = false;
  public profileImageFile: File | null = null;
  profileImage: string | ArrayBuffer = null;
  isDragOver: boolean = false;
  public userPositionEnum;
  public userSectorsEnum;

  protected confirm_password: string;

  public utils = Utils;

  protected userRolesEnum = Object.values(UserRoles);

  public states: string[] = Object.values(Estados);
  view: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { user: User, view?: boolean;},
    private readonly _dialogRef: MatDialogRef<DialogUserComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _utilsService: UtilsService,
    private readonly _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      role: [null, [Validators.required]],
      is_active: [true],
      cep: [null],
      street: [null],
      number: [null],
      neighborhood: [null],
      city: [null],
      state: [null],
    });

    if (this._data?.user) {
      this.isNewUser = false;
      this.title = 'Editar Usuário';
      this._fillForm(this._data.user);
    }

    if (this._data?.view) {
      this.isNewUser = false;
      this.title = 'Visualizar Usuário';      
      this._fillForm(this._data.user);
      // this.form.disable();
      this.view = true;
    }

    this.form.get('cep').valueChanges.subscribe((res) => {
      this.autocompleteCep();
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.profileImage = null;
  }

  private _fillForm(user: User): void {
    this.form.patchValue(user);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      this._dialogRef.close(this.prepareFormData(form));
    }
  }

  public prepareFormData(client) {
    const userFormData = new FormData();

    Object.keys(client.controls).forEach((key) => {
      if (key === 'is_active') {
        userFormData.append(
          'is_active',
          this.form.get('is_active')?.value ? '1' : '0'
        );
      } else {
        userFormData.append(key, this.form.get(key)?.value);
      }
    });

    return userFormData;
  }

  // Utils

  // CEP
  public autocompleteCep() {
    if (this.form.get('cep').value.length == 8) {
      this._utilsService
        .getAddressByCep(this.form.get('cep').value)
        .subscribe((res) => {
          if (res.erro) {
            this._toastr.error('CEP Inválido para busca!');
          } else {
            this.form.get('street').patchValue(res.logradouro);
            this.form.get('city').patchValue(res.localidade);
            this.form.get('state').patchValue(res.uf);
            this.form.get('neighborhood').patchValue(res.bairro);
          }
        });
    }
  }
}
