import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContactOriginEnum } from '@models/contact';
import { Service } from '@models/service';
import { HeaderService } from '@services/header.service';
import { ServiceService } from '@services/service.service';
import { UserService } from '@services/user.service';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  public loading: boolean = false;

  public formFilters: FormGroup;
  public filters;

  protected userSelection;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _userService: UserService,
    private readonly _fb: FormBuilder,
    private readonly _headerService: HeaderService
  ) {
    this._headerService.setTitle('Logs');
    this._headerService.setUpperTitle('Logs - Primeweb')
  }

  ngOnInit() {
    this.getUsers();

    this.formFilters = this._fb.group({
      user_id : [''],
      date : ['']
    })
  }

  // Getters
  public getUsers() {
    this._userService.getUsers()
      .subscribe(res => {
        this.userSelection = res.data;
      })
  }


  // Utils
  public updateFilters() {
    this.filters = {
      ...this.formFilters.getRawValue(),
      date : this.formFilters.get('date').value ? dayjs(this.formFilters.get('date').value).format("YYYY-MM-DD") : ''
    };
  }

  public clearDate() {
    this.formFilters.get('date').patchValue('');
    this.updateFilters();
  }

  public clearUser() {
    this.formFilters.get('user_id').patchValue('');
    this.updateFilters();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      user_id: '',
      date: ''
    })
    this.updateFilters();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

}
