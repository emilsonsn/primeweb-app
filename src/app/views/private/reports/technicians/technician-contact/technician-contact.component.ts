import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@services/user.service';
import { UserRoles, User } from '@models/user';
import { Subject } from 'rxjs';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-technician-contact',
  templateUrl: './technician-contact.component.html',
  styleUrls: ['./technician-contact.component.scss']
})
export class TechnicianContactComponent implements OnInit {
  public loading: boolean = false;
  public contacts: User[] = [];
  public info: any = {         // <-- Declaração da propriedade info
    totalPalavras: 0,
    paginas: [0, 0, 0],
    cadastrado: null,
    contratacao: null,
    finalizado: null,
    tecnico: '',
    consultor: '',
    vendedor: ''
  };
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _toastrService: ToastrService,
    private _headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.getContactsFromBack();
    this._headerService.setTitle('Contatos');
  }

  public getContactsFromBack(): void {
    this.loading = true;
    this._userService.getUsers().subscribe((res) => {
      this.contacts = res.data.filter(user => user.role === UserRoles.Technical);
      this.updateInfoPanel();  // Atualiza o painel após carregar os dados
      this.loading = false;
    });
  }

  private updateInfoPanel(): void {
    this.info = {
      totalPalavras: this.contacts.length * 10,
      paginas: [this.contacts.length > 0 ? 1 : 0, 0, 0],
      cadastrado: new Date('2020-07-06'),
      contratacao: new Date('2020-07-01'),
      finalizado: new Date('2020-09-21'),
      tecnico: this.contacts.length > 0 ? this.contacts[0].name : 'Renato Di Giacomo',
      consultor: 'Roberto',
      vendedor: 'Wesley Araujo'
    };
  }

  public viewContact(contact: User): void {
    console.log("Visualizando contato:", contact);
  }

  public deleteContact(contact: User): void {
    const dialogConfig: MatDialogConfig = {
      width: '550px',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog
      .open(DialogConfirmComponent, {
        data: { text: `Tem certeza que deseja excluir este contato?` },
        ...dialogConfig,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this._userService.deleteUser(contact.id).subscribe(() => {
            this._toastrService.success('Contato removido com sucesso!');
            this.getContactsFromBack(); // Atualiza a lista e o painel de informações
          });
        }
      });
  }

  public addContact(): void {
    console.log('Adicionar novo contato');
  }
}
