import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '@services/user.service';
import {User, UserRoles} from '@models/user';
import dayjs from 'dayjs';
import {Utils} from '@shared/utils';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrl: './dialog-user.component.scss'
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

  protected confirm_password : string;

  public utils = Utils;

  protected userRolesEnum = Object.values(UserRoles);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { user: User },
    private readonly _dialogRef: MatDialogRef<DialogUserComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService
  ) {
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      role: [null, [Validators.required]],
      is_active : [true]
    })

    if (this._data?.user) {
      this.isNewUser = false;
      this.title = 'Editar Usuário';
      this._fillForm(this._data.user);
    }
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

      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('name', form.get('name')?.value);
      formData.append('phone', form.get('phone')?.value);
      formData.append('email', form.get('email')?.value);
      formData.append('role', form.get('role')?.value);
      formData.append('is_active', form.get('is_active')?.value ? "1" : "0");

      this._dialogRef.close(formData)
    }
  }

  // Utils
}
