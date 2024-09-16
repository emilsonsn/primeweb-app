import {Component, ElementRef, Renderer2} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {Subscription} from "rxjs";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {ApiResponse} from "@models/application";
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss'
})
export class LayoutPrivateComponent {

  public permitedMenuItem: IMenuItem[] = [];

  public menuItem: IMenuItem[] = [
    {
      label: 'Home',
      icon: 'fa-regular fa-house',
      route: '/painel/home',
      active: true
    },
    {
      label: 'Telefonemas',
      icon: 'fa-sharp fa-solid fa-phone-volume',
      route: '/painel/phone-calls'
    },
    {
      label: 'Segmentos',
      icon: 'fa-duotone fa-solid fa-boxes-stacked',
      route: '/painel/segments'
    },
    {
      label: 'Contatos',
      icon: 'fa-solid fa-message',
      route: '/painel/contacts'
    },
    {
      label: 'Agenda',
      icon: 'fa-regular fa-calendar-day',
      route: '/painel/schedule'
    },
    {
      label: 'Logs',
      icon: 'fa-duotone fa-solid fa-signal-stream',
      route: '/painel/logs'
    }
  ]

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private readonly _sidebarService: SidebarService,
    private readonly _userService: UserService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery : SessionQuery
  ) { }


  ngOnInit(): void {

    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    this._sessionQuery.user$.subscribe(user => {
      if(user) {
        this.user = user;

        // if(user?.company_position.position == 'Requester')
        //   this.permitedMenuItem = this.menuItem.filter(item =>
        //     item.label == 'Pedidos' ||
        //     item.label == 'Solicitações' ||
        //     item.label == 'Fornecedores'
        //   );
        // else
        //   this.permitedMenuItem = this.menuItem;
      }
    })

  }


  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

}
