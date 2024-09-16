import {Component, EventEmitter, HostListener, Input, OnInit, Output, signal} from '@angular/core';
import {Router} from '@angular/router';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {User} from "@models/user";
import {AuthService} from "@services/auth.service";
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() user!: User;

  @Input() menuItem: IMenuItem[] = [];

  @Output() toggleSidebar = new EventEmitter<void>();

  public activeLabel: string = '';

  protected readonly console = console;

  public isMenuOpened = signal(false);

  public notifications = [
    {
      title: 'Nova Notificação'
    },
    {
      title: 'Teste Notificação'
    }
  ];

  constructor(
    protected router: Router,
    private readonly _sidebarService: SidebarService,
    private readonly _authService: AuthService,
    private readonly _sessionService : SessionService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _headerService: HeaderService
  ) { }

  ngOnInit() {
    this._sessionService.getUserFromBack().subscribe(res => {
      this.user = res;
    });

    this._headerService.getTitle().subscribe(title => {
      this.activeLabel = title;
    });
  }

  public logout() {
    this._authService.logout();
  }

  // Utils
  public get isMobile() {
    return this._sidebarService.mobile();
  }

  public get isSidebarOpen() {
    return this._sidebarService.showSidebar();
  }

  public onToggleSidebar() {
    event.stopPropagation();
    this._sidebarService.showSidebar.set(true);
  }

  public toggleDropdown() {
    this.isMenuOpened.set(!this.isMenuOpened());
  }

  public toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Erro ao tentar sair do modo de tela cheia: ${err.message}`);
      });
    }
  }

  public navigateTousers() {
    this.router.navigate(['/painel/users']);
  }

  public navigateToProfile() {
    this.router.navigate(['/painel/profile']);
  }

}
