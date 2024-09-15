import {ChangeDetectionStrategy, Component, computed, Signal, signal} from '@angular/core';
import {ISmallInformationCard} from "@models/cardInformation";
import {Chart, registerables} from "chart.js";
import {DashboardService} from "@services/dashboard.service";
import {ApiResponse} from "@models/application";
import {OrderData} from "@models/dashboard";
import {formatCurrency} from "@angular/common";
import { HeaderService } from '@services/header.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('showPhones', [
      state('collapsed,void', style({overflow: 'hidden' })),
      state('expanded', style({overflow: 'scroll'})),
    ]),
    trigger('phoneExpand', [
      state('collapsed,void', style({height: '0', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('400ms 0ms cubic-bezier(0.2, 0.0, 0.5, 1)')),
    ]),

    trigger('showContacts', [
      state('collapsed,void', style({overflow: 'hidden' })),
      state('expanded', style({overflow: 'scroll'})),
    ]),
    trigger('contactExpand', [
      state('collapsed,void', style({height: '0', minHeight: '0' })),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('400ms 0ms cubic-bezier(0.2, 0.0, 0.5, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  protected filtersToPhoneCall : any;
  protected filtersToContact : any

  constructor (
    private readonly _dashboardService: DashboardService,
    private readonly _headerService: HeaderService
  ) {
    this._headerService.setTitle('Home');
    this._headerService.setUpperTitle('Home - Primeweb');
  }

  itemsShopping: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-cart-plus',
      background: '#FC9108',
      title: "AGENDAMENTOS MÊS",
      category: 'Compras',
      value: 1,
      description: 'Desde o último mês',
    },
    {
      icon: 'fa-solid fa-truck-fast',
      background: '#4CA750',
      title: "CONTATOS",
      category: 'Compras',
      value: 2,
      description: 'Desde o último mês',
    },
    {
      icon: 'fa-solid fa-shop',
      background: '#E9423E',
      title: "CONTATOS FECHADOS",
      category: 'Compras',
      value: 1,
      description: 'Desde o último mês',
    },
    {
      icon: 'fa-solid fa-money-check-dollar',
      background: '#0AB2C7',
      value: 360,
      title: "TOTAL CONTATOS FECHADOS",
      category: 'Compras',
    },
  ]);

  ngOnInit() { }

  // Show Tables
  public showContactTable = signal(false);
  public showPhoneTable = signal(false);

  public toggleContactTable() {
    this.showContactTable.set(!this.showContactTable());
  }

  public togglePhoneTable() {
    this.showPhoneTable.set(!this.showPhoneTable());
  }

}
