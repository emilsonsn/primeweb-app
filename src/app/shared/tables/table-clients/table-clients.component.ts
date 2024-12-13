import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Order, PageControl } from '@models/application';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { SessionQuery } from '@store/session.query';
import { TestService } from '@services/test.service';
import { Contact } from '@models/contact';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ContactService } from '@services/contact.service';
import { ClientService } from '@services/client.service';
import { SessionService } from '@store/session.service';

@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrl: './table-clients.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableClientsComponent {
  private subscription: Subscription;

  @Input()
  showActions: boolean = true;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onKeyWord = new EventEmitter<any>();

  @Output()
  public onEditStatus = new EventEmitter<any>();

  @Output()
  public onEditClient = new EventEmitter<any>();

  @Output()
  public onViewClient = new EventEmitter<any>();

  @Output()
  public onDeleteClient = new EventEmitter<any>();

  public is_admin: boolean = false;

  public columns = [
    {
      slug: 'enterprise',
      order: false,
      title: 'Empresa',
      classes: '',
    },
    {
      slug: 'domain',
      order: false,
      title: 'Domínio',
      classes: '',
    },
    {
      slug: 'segment',
      order: false,
      title: 'Segmento',
      classes: '',
    },
    {
      slug: 'technical',
      order: false,
      title: 'Técnico',
      classes: '',
    },
    {
      slug: 'status',
      order: false,
      title: 'Status',
      classes: 'justify-content-center',
    },
    {
      slug: 'actions',
      order: false,
      title: 'Menu',
      classes: 'justify-content-end me-5 pe-4',
    },
  ];

  public clients = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'id',
    order: Order.DESC,
  };

  isFinancial: boolean = false;

  protected expanded: any;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _clientService : ClientService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _testService: TestService,
    private readonly _sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );
    this._sessionService.getUserFromBack().subscribe(res => {
      this.loadPermissions(res.role);
    });

    if (!this.showActions) {
      this.columns.pop();
    }
  }

  public loadPermissions(role): void {
      if(role === 'Admin'){
        this.is_admin = true;
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { filters, searchTerm, loading } = changes;

    if (
      searchTerm?.previousValue &&
      searchTerm?.currentValue !== searchTerm?.previousValue
    ) {
      this._onSearch();
    } else if (!loading?.currentValue) {
      this._onSearch();
    } else if (filters?.previousValue && filters?.currentValue) {
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

    this._clientService
      .getList(this.pageControl, this.filters)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe((res) => {
        this.clients = res.data;

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
  public toggleExpanded(element) {
    if (this.expanded === element) {
      this.expanded = null;
    } else {
      this.expanded = element;
    }
  }
}
