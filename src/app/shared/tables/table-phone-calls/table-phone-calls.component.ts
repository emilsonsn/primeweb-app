import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { Request } from '@models/request';
import { RequestService } from '@services/request.service';
import { SessionQuery } from '@store/session.query';
import { PhoneCall, PhoneCallStatus } from '@models/phone-call';
import { TestService } from '@services/test.service';
import { PhoneCallService } from '@services/phone-call.service';

@Component({
  selector: 'app-table-phone-calls',
  templateUrl: './table-phone-calls.component.html',
  styleUrl: './table-phone-calls.component.scss'
})
export class TablePhoneCallsComponent {

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
  public onViewPhoneCall = new EventEmitter<PhoneCall>();

  @Output()
  public onEditPhoneCall = new EventEmitter<PhoneCall>();

  @Output()
  public onDeletePhoneCall = new EventEmitter<PhoneCall>();

  @Output()
  public onNewOccurrence = new EventEmitter<PhoneCall>();

  public columns = [
    {
      slug: "company",
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
      slug: "phone",
      order: false,
      title: "Telefone",
      classes: "",
    },
    {
      slug: "user_id",
      order: false,
      title: "Responsável",
      classes: "",
    },
    {
      slug: "created_at",
      order: false,
      title: "Data de Criação",
      classes: "",
    },
    {
      slug: "return_date",
      order: false,
      title: "Data Retorno",
      classes: "",
    },
    {
      slug: "status",
      order: false,
      title: "Status",
      classes: "",
    },
    {
      slug: "actions",
      order: false,
      title: "Menu",
      classes: "justify-content-end me-5 pe-4",
    },
  ];

  public phoneCalls : PhoneCall[] = [];

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  isFinancial: boolean = false;

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _phoneCallService : PhoneCallService,
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

    this._phoneCallService
      .getList(this.pageControl, this.filters)
      .pipe(finalize(() => {
        this._initOrStopLoading()
      }))
      .subscribe((res) => {
        this.phoneCalls = res.data;

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

}
