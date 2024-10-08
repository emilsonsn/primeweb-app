import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Order, PageControl } from '@models/application';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { Request } from '@models/request';
import { RequestService } from '@services/request.service';
import { SessionQuery } from '@store/session.query';
import { PhoneCall } from '@models/phone-call';
import { TestService } from '@services/test.service';
import { Segment } from '@models/segment';
import { Log } from '@models/log';
import { LogService } from '@services/log.service';

@Component({
  selector: 'app-table-logs',
  templateUrl: './table-logs.component.html',
  styleUrl: './table-logs.component.scss'
})
export class TableLogsComponent {

  private subscription: Subscription;

  @Input()
  filters;

  @Input()
  searchTerm?: string = '';

  @Input()
  loading: boolean = false;

  @Output()
  public onEditSegment = new EventEmitter<Segment>();

  @Output()
  public onDeleteSegment = new EventEmitter<Segment>();

  public columns = [
    {
      slug: "id",
      order: false,
      title: "ID",
      classes: "",
    },
    {
      slug: "user",
      order: false,
      title: "Usuário",
      classes: "",
    },
    {
      slug: "action",
      order: false,
      title: "Ação",
      classes: "",
    },
    {
      slug: "ip",
      order: false,
      title: "IP",
      classes: "",
    },
    {
      slug: "created_at",
      order: false,
      title: "Criado em",
      classes: "",
    }
  ];

  public logs : Log[] = [];

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
    private readonly _sessionQuery : SessionQuery,
    private readonly _logService : LogService
  ) {}

  ngOnInit(): void {
    // this.subscription = this._sidebarService.accountIdAlterado$.subscribe(
    //   () => { this._onSearch() }
    // );

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

    this._logService
      .getList(this.pageControl, this.filters)
      .pipe(finalize(() => {
        this._initOrStopLoading()
      }))
      .subscribe((res) => {
        this.logs = res.data;

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
