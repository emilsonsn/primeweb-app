import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { SessionQuery } from '@store/session.query';
import { TestService } from '@services/test.service';
import { Contact } from '@models/contact';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ContactService } from '@services/contact.service';

@Component({
  selector: 'app-table-contacts',
  templateUrl: './table-contacts.component.html',
  styleUrl: './table-contacts.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'}),),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class TableContactsComponent {
  private subscription: Subscription;

  @Input()
  showActions : boolean = true;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onViewContact = new EventEmitter<Contact>();

  @Output()
  public onEditContact = new EventEmitter<Contact>();

  @Output()
  public onDeleteContact = new EventEmitter<Contact>();

  @Output()
  public onNewOccurrenceContact = new EventEmitter<Contact>();

  public columns = [
    {
      slug: "enterprise",
      order: false,
      title: "Empresa",
      classes: "",
    },
    {
      slug: "domain",
      order: false,
      title: "Domínio",
      classes: "",
    },
    {
      slug: "name",
      order: false,
      title: "Nome",
      classes: "",
    },
    {
      slug: "segment",
      order: false,
      title: "Segmento",
      classes: "",
    },
    {
      slug: "responsible",
      order: false,
      title: "Responsável",
      classes: "",
    },
    {
      slug: "status",
      order: false,
      title: "Status",
      classes: "justify-content-center",
    },
    {
      slug: "actions",
      order: false,
      title: "Ações",
      classes: "justify-content-end me-5 pe-4",
    },
  ];

  public contacts : Contact[] = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  isFinancial: boolean = false;

  protected  expandedContact: Contact | null;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _contactService : ContactService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _testService : TestService
  ) {}

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

    if(!this.showActions) {
      this.columns.pop();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if ( searchTerm?.previousValue && searchTerm?.currentValue !== searchTerm?.previousValue ) {
      this._onSearch();
    }
    else if (!loading?.currentValue) {
      this._onSearch();
    }
    else if(filters?.previousValue && filters?.currentValue) {
			this._onSearch();
		}

  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  get getLoading() {
    return !!this.loading;
  }

  private _onSearch() {
    this.pageControl.search_term = this.searchTerm;
    this.pageControl.page = 1;
    this.search();
  }

  public search(): void {
    this._initOrStopLoading();

    this._contactService
      .getList(this.pageControl, this.filters)
      .pipe(finalize(() => {
        this._initOrStopLoading()
      }))
      .subscribe((res) => {
        this.contacts = res.data;

        this.pageControl.page = res.current_page - 1;
        this.pageControl.itemCount = res.total;
        this.pageControl.pageCount = res.last_page;
      });
  }

  public onClickOrderBy(slug: string, order: boolean) {
    if (!order) {
      return;
    }

    if (this.pageControl.orderField === slug) {
      this.pageControl.order =
        this.pageControl.order === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.pageControl.order = Order.ASC;
      this.pageControl.orderField = slug;
    }
    this.pageControl.page = 1;
    this.search();
  }

  public pageEvent($event) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.search();
  }

  // Utils
  public toggleContactExpanded(contact) {
    if (this.expandedContact === contact) {
      this.expandedContact = null;
    } else {
      this.expandedContact = contact;
    }
  }

}
