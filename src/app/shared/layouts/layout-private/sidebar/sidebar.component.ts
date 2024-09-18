import {Component, Input} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import { UserRoles } from '@models/user';
import { SidebarService } from '@services/sidebar.service';
import { SessionService } from '@store/session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() menuItem: IMenuItem[] = []

  constructor(
    protected readonly _sidebarService : SidebarService,
    private readonly _sessionService: SessionService
  ) {}

  ngOnInit(){
    this._sessionService.getUserFromBack().subscribe(res => {      
      this.loadPermissions(res.role);
    });
  }

  public loadPermissions(role): void {
      if(role != 'Admin'){
        const justAdmin = ['Segmentos', 'Logs'];
    
        this.menuItem = this.menuItem.filter((item) => {
          return !justAdmin.includes(item.label);
        });
      }
  }


  public toggleShowSidebar() {
    this._sidebarService.showSidebar.set(false);
  }

}
