import { animate, state, style, transition, trigger } from '@angular/animations';
import {Component, Input} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import { UserRoles } from '@models/user';
import { SidebarService } from '@services/sidebar.service';
import { SessionService } from '@store/session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SidebarComponent {
  @Input() menuItem: IMenuItem[] = []
  expandedElement;

  constructor(
    protected readonly _sidebarService : SidebarService,
    private readonly _sessionService: SessionService
  ) {}

  ngOnInit(){
    this._sessionService.getUserFromBack().subscribe(res => {
      this.loadPermissions(res.role);
      this.menuItem.push({
        label: ' Relatórios',
        icon: 'fa-solid fa-chart-line',
        isDropdown: true, // Torna Relatórios um menu dropdown
        dropdownItems: [
          {
            label: ' Técnicos',
            icon: 'fa-solid fa-user-cog',
            route: '/painel/reports/technicians'
          }
        ]
      });
      console.log(this.menuItem);

    });
  }

  public loadPermissions(role): void {
      if(role != 'Admin'){
        const justAdmin = ['Segmentos', 'Logs', 'Usuários'];

        this.menuItem = this.menuItem.filter((item) => {
          return !justAdmin.includes(item.label);
        });
      }

      if(role != 'Admin' && role != 'Financial'){
        const justAdmin = ['Clientes'];

        this.menuItem = this.menuItem.filter((item) => {
          return !justAdmin.includes(item.label);
        });
      }

      if(role === 'Financial'){
        const justAdmin = ['Telefonemas', 'Contatos', 'Agenda Comercial'];

        this.menuItem = this.menuItem.filter((item) => {
          return !justAdmin.includes(item.label);
        });
      }
  }

  public toggleShowSidebar() {
    this._sidebarService.showSidebar.set(false);
  }

}
