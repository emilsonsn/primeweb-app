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

@Component({
  selector: 'app-table-clients-keyword',
  templateUrl: './table-clients-keyword.component.html',
  styleUrl: './table-clients-keyword.component.scss',
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
export class TableClientsKeywordComponent {
  private subscription: Subscription;

  @Input()
  showActions: boolean = true;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  client_id : number;

  public columns = [
    {
      slug: 'number',
      order: false,
      title: 'Número',
      classes: '',
    },
    {
      slug: 'model',
      order: false,
      title: 'Modelo',
      classes: '',
    },
    {
      slug: 'service_type',
      order: false,
      title: 'Tipo de Serviço',
      classes: '',
    },
    {
      slug: 'date_hire',
      order: false,
      title: 'Data Contratada',
      classes: '',
    },
    {
      slug: 'actions',
      order: false,
      title: 'Menu',
      classes: 'justify-content-end me-5 pe-4',
    },
  ];

  public keywords = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: 'id',
    order: Order.ASC,
  };

  protected expanded: any;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _clientService : ClientService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _testService: TestService
  ) {}

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

    if (!this.showActions) {
      this.columns.pop();
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

    if(this.client_id) {
      this._initOrStopLoading();

      this._clientService
        .getKeywordList(this.pageControl, {...this.filters, client_id : this.client_id})
        .pipe(
          finalize(() => {
            this._initOrStopLoading();
          })
        )
        .subscribe((res) => {
          this.keywords = res.data;

          this.pageControl.page = res.current_page - 1;
          this.pageControl.itemCount = res.total;
          this.pageControl.pageCount = res.last_page;
        });
    }

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

  // Methods
  public deleteContract(contract) {
    this._clientService.deleteContract(contract.id)
      .subscribe({
        next: () => {
          this._toastr.success('Contrato excluído com sucesso!');
          this.search();
        },
        error: (error) => {
          this._toastr.error('Não foi possível excluir o contrato.');
        },
      })
  }

  public openContract(contract) {
    window.open(contract.path, '_blank');
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
