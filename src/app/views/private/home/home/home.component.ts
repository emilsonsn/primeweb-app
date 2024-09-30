import {ChangeDetectionStrategy, Component, computed, Signal, signal} from '@angular/core';
import {ISmallInformationCard} from "@models/cardInformation";
import {Chart, registerables} from "chart.js";
import {DashboardService} from "@services/dashboard.service";
import {ApiResponse} from "@models/application";
import {OrderData} from "@models/dashboard";
import {formatCurrency} from "@angular/common";
import { HeaderService } from '@services/header.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PhoneCallService } from '@services/phone-call.service';
import { finalize } from 'rxjs';
import dayjs from 'dayjs';
import { ContactService } from '@services/contact.service';

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
})
export class HomeComponent {

  protected filtersToPhoneCall : any;
  protected filtersToContact : any

  protected phoneCallsCount = {
    daily : 0,
    // previousWeek : 0,
    nextWeek : 0
  };

  protected contactCount = {
    daily : 0,
    // previousWeek : 0,
    nextWeek : 0
  };

  constructor (
    private readonly _dashboardService: DashboardService,
    private readonly _headerService: HeaderService,
    private readonly _phoneCallService : PhoneCallService,
    private readonly _contactService : ContactService
  ) {
    this._headerService.setTitle('Home');
    this._headerService.setUpperTitle('Home - Primeweb');
  }

  itemsShopping: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-calendar-days',
      background: '#FC9108',
      title: "0",
      category: 'AGENDAMENTOS MÊS',
      description: 'Criadas esse mês',
      icon_description: 'fa-regular fa-calendar',
    },
    {
      icon: 'fa-solid fa-address-book',
      background: '#4CA750',
      title: "0",
      category: 'CONTATOS DO MÊS',
      description: 'Total de contatos',
      icon_description: 'fa-regular fa-calendar',
    },
    {
      icon: 'fa-solid fa-users',
      background: '#E9423E',
      title: "0",
      category: 'Telefonemas',
      description: 'Total de telefonemas',
      icon_description: 'fa-regular fa-calendar',
    },
    {
      icon: 'fa-solid fa-users',
      background: '#0AB2C7',
      title: "0",
      category: 'CONTATOS',
      description: 'Total de contatos',
      icon_description: 'fa-solid fa-users-between-lines',
    },
  ]);

  ngOnInit() {
    this.getContactData();
    this.getPhoneCallData();
    this.getCards();

    this.filtersToContact = {
      date_from: dayjs().format('YYYY-MM-DD'),
      date_to : dayjs().format('YYYY-MM-DD')
    };

    this.filtersToPhoneCall = {
      date_from: dayjs().format('YYYY-MM-DD'),
      date_to : dayjs().format('YYYY-MM-DD')
    };
  }

  public getCards() {
    this._dashboardService.getCards()
      .subscribe(cards => {
        console.log(cards);
  
        this.itemsShopping()[0].title = cards.data.occurrencesMonth.toString(); // Agendamentos Mês
        this.itemsShopping()[1].title = cards.data.contactMonth.toString();     // Contatos do Mês
        this.itemsShopping()[2].title = cards.data.phoneCalls.toString();       // Telefonemas
        this.itemsShopping()[3].title = cards.data.contacts.toString();         // Contatos Totais
      });
  }
  

  public getContactData() {
    this._contactService.getList(null, {
      date_from: dayjs().format('YYYY-MM-DD'),
      date_to : dayjs().format('YYYY-MM-DD')
    }).pipe(finalize(() => {}))
    .subscribe({
      next: (res) => {
        this.contactCount.daily = res.data.length;
      },
      error: (err) => { }
    })

  this._contactService.getList(null, {
      date_from: dayjs().format('YYYY-MM-DD'),
      date_to : dayjs().add(7, 'day').format('YYYY-MM-DD')
    }).pipe(finalize(() => {}))
    .subscribe({
      next: (res) => {
        this.contactCount.nextWeek = res.data.length;
      },
      error: (err) => { }
    })
  }

  public getPhoneCallData() {
    this._phoneCallService.getList(null, {
        date_from: dayjs().format('YYYY-MM-DD'),
        date_to : dayjs().format('YYYY-MM-DD')
      }).pipe(finalize(() => {}))
      .subscribe({
        next: (res) => {
          this.phoneCallsCount.daily = res.data.length;
        },
        error: (err) => { }
      })

    this._phoneCallService.getList(null, {
        date_from: dayjs().format('YYYY-MM-DD'),
        date_to : dayjs().add(7, 'day').format('YYYY-MM-DD')
      }).pipe(finalize(() => {}))
      .subscribe({
        next: (res) => {
          this.phoneCallsCount.nextWeek = res.data.length;
        },
        error: (err) => { }
      })
  }

  public filterContact(value) {
    if(value == 'week') {
      this.filtersToContact = {
        date_from: dayjs().format('YYYY-MM-DD'),
        date_to : dayjs().add(7, 'day').format('YYYY-MM-DD')
      };
    }
    else {
      this.filtersToContact = {
        date_from: dayjs().format('YYYY-MM-DD'),
        date_to : dayjs().format('YYYY-MM-DD')
      };
    }
  }

  public filterPhoneCall(value) {
    if(value == 'week') {
      this.filtersToPhoneCall = {
        date_from: dayjs().format('YYYY-MM-DD'),
        date_to : dayjs().add(7, 'day').format('YYYY-MM-DD')
      };
    }
    else {
      this.filtersToPhoneCall = {
        date_from: dayjs().format('YYYY-MM-DD'),
        date_to : dayjs().format('YYYY-MM-DD')
      };
    }
  }

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
