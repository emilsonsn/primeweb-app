import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@services/user.service';
import { UserRoles, User } from '@models/user';
import { Subject } from 'rxjs';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent {
  public selectedTab: number = 0; // Aba inicial será "Posicionamento"
  public loading: boolean = false;
  public technicians: User[] = [];
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _toastrService: ToastrService,
    private _headerService: HeaderService
  ) {}

  ngOnInit() {
    this.getTechniciansFromBack();
    this.updateTitle(this.selectedTab); // Atualiza o título ao carregar a página
  }

  public updateTitle(index: number): void {
    const titles = ['Posicionamento', 'Contatos'];
    this._headerService.setTitle(titles[index] || 'Técnicos');
  }

  public openViewTechnicianDialog(technician: User) {
    console.log("Visualizando técnico:", technician);
  }

  public openDeleteTechnicianDialog(technician: User) {
    const dialogConfig: MatDialogConfig = {
      width: '550px',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: { text: `Tem certeza que deseja excluir este técnico?` },
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this._userService.deleteUser(technician.id).subscribe(() => {
            this._toastrService.success('Técnico removido com sucesso!');
            this.getTechniciansFromBack();
          });
        }
      });
  }

  public getTechniciansFromBack() {
    this.loading = true;
    this._userService.getUsers().subscribe((res) => {
      this.technicians = res.data.filter(user => user.role === UserRoles.Technical);
      this.loading = false;
    });
  }
}
