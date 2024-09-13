import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPrivateComponent } from './layout-private/layout-private.component';
import { SidebarComponent } from './layout-private/sidebar/sidebar.component';
import { HeaderComponent } from './layout-private/header/header.component';
import { FooterComponent } from './layout-private/footer/footer.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    LayoutPrivateComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatDivider,
    MatMenuModule,
    MatButtonModule,
    MatRippleModule,
    RouterLinkActive
  ]
})
export class LayoutsModule { }
