import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Inject,
  Injector,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ApiResponse, PaymentForm } from '@models/application';
import { Construction } from '@models/construction';
import { Supplier, SupplierType } from '@models/supplier';
import {
  Banco,
  OrderResponsible,
  RequestOrder,
  RequestOrderStatus,
  RequestOrderType,
} from '@models/requestOrder';
import { User } from '@models/user';
import { ConstructionService } from '@services/construction.service';
import { OrderService } from '@services/order.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { dateValidator } from '@shared/validators/date';
import { RequestService } from '@services/request.service';
import { RequestStatus } from '@models/request';
import { SessionQuery } from '@store/session.query';
import { Contact, ContactOrigin } from '@models/contact';
import { TestService } from '@services/test.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-dialog-contact',
  templateUrl: './dialog-contact.component.html',
  styleUrl: './dialog-contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContactComponent {
  public loading: boolean = false;
  public title: string = 'Novo Contato';
  protected isNewOrder: boolean = true;
  protected isToEdit: boolean = false;

  protected form: FormGroup;

  // Getters
  protected requestTypeSelection = Object.values(RequestOrderType);
  protected requestStatusSelection = Object.values(RequestOrderStatus);
  protected requestOrderPaymentSelection = Object.values(PaymentForm);
  protected requestResponsibleSelection = Object.values(OrderResponsible);

  protected originSelect = Object.values(ContactOrigin);

  protected constructions: Construction[] = [];
  protected users: User[] = [];
  protected suppliers: Supplier[] = [];
  protected typeSuppliers: SupplierType[] = [];

  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
  ];

  public bancos = signal<Banco[]>([]);
  public categories = signal<any[]>([]);

  public isAdmin = false;
  public hasGranatum = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogContactComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _orderService: OrderService,
    private readonly _solicitationService: RequestService,
    private readonly _constructionService: ConstructionService,
    private readonly _userService: UserService,
    private readonly _supplierService: SupplierService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _dialog: MatDialog,
    private readonly _testService: TestService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      enterprise: [null, Validators.required],
      domain: [null, Validators.required],
      segment: ['test', Validators.required],
      responsible: ['test', Validators.required],
      return_date: [null, Validators.required],
      origin: ['test', Validators.required],
      cnpj: [null, Validators.required],
      consultant: [null, Validators.required],
      description: [''],
      telephones: this._fb.array([]),
      emails: this._fb.array([]),
    });

    this.form.valueChanges.subscribe((res) => {
      console.log(res);
    });

    if (this._data) {
      this.isNewOrder = false;
      this.title = 'Editar Pedido';

      if (this._data.order.telephones) {
        this._data.order.telephones.forEach((item) => {
          this.telephones.push(this.createTelephoneFromData(item));
        });
      }

      if (this._data.order.emails) {
        this._data.order.emails.forEach((item) => {
          this.emails.push(this.createEmailFromData(item));
        });
      }

      if (!this._data.edit) {
        this.isToEdit = true;
        this.form.disable();

        (this.telephones as FormArray).controls.forEach(
          (item: AbstractControl) => {
            item.disable();
          }
        );

        (this.emails as FormArray).controls.forEach((item: AbstractControl) => {
          item.disable();
        });
      }

      this.form.patchValue(this._data.order);
    } else {
      this.telephones.push(this.createTelephone());
      this.emails.push(this.createEmail());
    }
  }

  public postOrder(order: Contact) {
    if (!this.prepareFormData(order)) {
      this.loading = false;
      return;
    }

    this._testService
      .test(this.prepareFormData(order))
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Pedido enviado com sucesso!');
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  public patchOrder(id: number, order: Contact) {
    if (!this.prepareFormData(order)) {
      this.loading = false;
      return;
    }

    this._orderService
      .patchOrder(id, this.prepareFormData(order))
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Pedido atualizado com sucesso!');
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  public prepareFormData(order: Contact) {
    console.log(order);
    if (!order.phones.length) {
      this._toastr.error('Item é um campo obrigatório');
      return;
    }

    if (!order.emails.length) {
      this._toastr.error('Item é um campo obrigatório');
      return;
    }

    const orderFormData = new FormData();

    Object.keys(order).forEach((key) => {
      if (key == 'date') {
        orderFormData.append(
          'date',
          dayjs(order.return_date).format('YYYY-MM-DD')
        );
      } else if (key == 'telephones') {
        order.phones.forEach((telephone) => {
          orderFormData.append('telephones[]', JSON.stringify(telephone));
        });
      } else if (key == 'emails') {
        order.emails.forEach((email) => {
          orderFormData.append('emails[]', JSON.stringify(email));
        });
      } else orderFormData.append(key, order[key]);
    });

    return orderFormData;
  }

  public onConfirm(): void {
    console.log({
      ...this.form.getRawValue(),
      segments: this.segments(),
    });

    if (!this.form.valid || this.loading) return;

    this._initOrStopLoading();

    if (this.isNewOrder) {
      this.postOrder({
        ...this.form.getRawValue(),
      });
    } else {
      this.patchOrder(this._data.order.id, {
        ...this.form.getRawValue(),
      });
    }
  }

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  // Telephones
  public createTelephone(): FormGroup {
    return this._fb.group({
      id: [null],
      number: [null, Validators.required],
    });
  }

  private createTelephoneFromData(item: any): FormGroup {
    return this._fb.group({
      id: [item.id],
      number: [{ value: item.key }, [Validators.required]],
    });
  }

  public pushTelephone(): void {
    this.telephones.push(this.createTelephone());
  }

  public onDeleteTelephone(index: number): void {
    if (!this.telephones.value[index].id) {
      this.telephones.removeAt(index);

      if (this.telephones.length === 0) {
        this.telephones.push(this.createTelephone());
      }
      return;
    }

    this.deleteTelephone(index);

    if (this.telephones.length === 0) {
      this.telephones.push(this.createTelephone());
    }
  }

  private deleteTelephone(index) {
    this._orderService.deleteItem(this.telephones.value[index].id).subscribe({
      next: () => {
        this._toastr.success('Item deletado com sucesso');
        this.telephones.removeAt(index);
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
  }

  // Email
  public createEmail(): FormGroup {
    return this._fb.group({
      id: [null],
      email: [null, Validators.required],
    });
  }

  private createEmailFromData(item: any): FormGroup {
    return this._fb.group({
      id: [item.id],
      email: [{ value: item.key }, [Validators.required]],
    });
  }

  public pushEmail(): void {
    this.emails.push(this.createEmail());
  }

  public onDeleteEmail(index: number): void {
    if (!this.emails.value[index].id) {
      this.emails.removeAt(index);

      if (this.emails.length === 0) {
        this.emails.push(this.createEmail());
      }
      return;
    }

    this.deleteEmail(index);

    if (this.emails.length === 0) {
      this.emails.push(this.createTelephone());
    }
  }

  private deleteEmail(index) {
    this._orderService.deleteItem(this.telephones.value[index].id).subscribe({
      next: () => {
        this._toastr.success('Item deletado com sucesso');
        this.emails.removeAt(index);
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
  }

  // Segments
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentSegment = model({ ID: 0, Name: '' });
  readonly segments = signal<{ ID: number; Name: string }[]>([]);
  readonly allSegments: { ID: number; Name: string }[] = [
    { ID: 1, Name: 'Apple' },
    { ID: 2, Name: 'Lemon' },
    { ID: 3, Name: 'Lime' },
    { ID: 4, Name: 'Orange' },
    { ID: 5, Name: 'Strawberry' },
  ];
  readonly filteredSegments = signal(this.allSegments);

  readonly announcer = inject(LiveAnnouncer);

  filterSegments(): void {
    const currentSegmentValue = this.currentSegment().Name;

    // Verifica se 'Name' é uma string antes de chamar toLowerCase
    if (typeof currentSegmentValue === 'string') {
      const loweredSegmentValue = currentSegmentValue.toLowerCase();

      this.filteredSegments.set(
        loweredSegmentValue
          ? this.allSegments.filter((segment) =>
              segment.Name.toLowerCase().includes(loweredSegmentValue)
            )
          : this.allSegments.slice()
      );
    } else {
      // Caso 'Name' não seja uma string, apenas resetamos o filtro
      this.filteredSegments.set(this.allSegments.slice());
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.segments.update((segments) => [
        ...segments,
        { ID: Date.now(), Name: value },
      ]);
    }

    this.currentSegment.set({ ID: 0, Name: '' });
    event.input.value = '';
  }

  remove(segment: { ID: number; Name: string }): void {
    this.segments.update((segments) => {
      const index = segments.findIndex((s) => s.ID === segment.ID);
      if (index < 0) {
        return segments;
      }

      segments.splice(index, 1);
      this.announcer.announce(`Removed ${segment.Name}`);
      return [...segments];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedSegment = event.option.value as { ID: number; Name: string };

    if (!this.segments().find((segment) => segment.ID === selectedSegment.ID)) {
      this.segments.update((segments) => [...segments, selectedSegment]);
    }

    this.currentSegment.set({ ID: 0, Name: '' });
  }

  trackBySegmentId(index: number, segment: { ID: number; Name: string }) {
    return segment.ID;
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  // Getters

  public get telephones(): FormArray {
    return this.form.get('telephones') as FormArray;
  }

  public get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  public get getSegments() {
    return this.form.get('segments') as FormArray;
  }

  // Imports
  // TextArea
  private _injector = inject(Injector);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      }
    );
  }
}
