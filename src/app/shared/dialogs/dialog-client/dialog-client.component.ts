import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  Injector,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import {
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
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ContactService } from '@services/contact.service';
import { UserService } from '@services/user.service';
import { User, UserRoles } from '@models/user';
import { SegmentService } from '@services/segment.service';
import { UtilsService } from '@services/utils.service';
import { Estados } from '@models/utils';
import { SessionQuery } from '@store/session.query';
import { ClientService } from '@services/client.service';
import { Segment } from '@models/segment';
import { ContractModelEnum, ContractTypeServiceEnum } from '@models/contract';

@Component({
  selector: 'app-dialog-client',
  templateUrl: './dialog-client.component.html',
  styleUrl: './dialog-client.component.scss',
})
export class DialogClientComponent {
  public loading: boolean = false;
  public isToUpdateTable : boolean = false;
  public title: string = 'Novo Cliente';
  protected _onDestroy = new Subject<void>();

  protected isNewClient: boolean = true;
  protected isToEdit: boolean = false;
  protected canEditUserId: boolean = false;
  protected client_id : number;

  protected formClient: FormGroup;
  protected formContract: FormGroup;

  protected isToGoToContract: boolean = false;
  protected tabToContract: number = 0;

  // [Selects]
  // Search de Users
  protected userSelect: User[] = [];

  protected consultantCtrl: FormControl<any> = new FormControl<any>(null);
  protected consultantFilterCtrl: FormControl<any> = new FormControl<string>(
    ''
  );
  protected filteredConsultants: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);

  protected sellerCtrl: FormControl<any> = new FormControl<any>(null);
  protected sellerFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredSellers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected technicalCtrl: FormControl<any> = new FormControl<any>(null);
  protected technicalFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredTechnicals: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  // Segments
  protected segmentSelect: Segment[] = [];

  protected segmentCtrl: FormControl<any> = new FormControl<any>(null);
  protected segmentFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredSegments: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  // Contract
  protected serviceTypeEnum = Object.values(ContractTypeServiceEnum);
  protected modelEnum = Object.values(ContractModelEnum);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private readonly _dialogRef: MatDialogRef<DialogClientComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _contactService: ContactService,
    private readonly _clientService: ClientService,
    private readonly _userService: UserService,
    private readonly _dialog: MatDialog,
    private readonly _segmentService: SegmentService,
    private readonly _sessionQuery: SessionQuery,
    private readonly _utilsService: UtilsService
  ) {
    this.getUsersFromBack();
    this.getSegmentsFromBack();

    this.prepareFilterConsultantCtrl();
    this.prepareFilterSellerCtrl();
    this.prepareFilterTechnicalCtrl();
    this.prepareFilterSegmentCtrl();
  }

  ngOnInit(): void {
    this.formClient = this._fb.group({
      company: [null, [Validators.required]],
      domain: [null, [Validators.required]],
      client_responsable_name: [null, [Validators.required]],
      client_responsable_name_2: [null, [Validators.required]],
      cnpj: [null, [Validators.required]],
      cep: [null, [Validators.required]],
      street: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      observations: [''],
      segment_id: [null, [Validators.required]],
      monthly_fee: [null, [Validators.required]],
      payment_first_date: [null, [Validators.required]],
      final_date: [null, [Validators.required]],
      duedate_day: [1, [Validators.min(1), Validators.max(31)]],
      consultant_id: [''], // , [Validators.required]
      seller_id: [''], // , [Validators.required]
      technical_id: [''], // , [Validators.required]
      phones: this._fb.array([]),
      emails: this._fb.array([]),
    });

    this.formContract = this._fb.group({
      number: [null, [Validators.required]],
      contract: [null, [Validators.required]],
      date_hire: [null, [Validators.required]],
      number_words_contract: [null, [Validators.required]],
      service_type: [null, [Validators.required]],
      model: [null, [Validators.required]],
      observations: [null, [Validators.required]],
    });

    this.cityFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterCitys();
    });

    this.formClient.get('state').valueChanges.subscribe((res) => {
      this.atualizarCidades(res);
    });

    this.formClient.get('cep').valueChanges.subscribe((res) => {
      this.autocompleteCep();
    });

    this.formClient.valueChanges.subscribe((res) => {
      if (res.duedate_day < 0 || res.duedate_day > 31) {
        this.formClient.get('duedate_day').patchValue(1);
      }
    });

    if (this._data) {
      this.isNewClient = false;
      this.title = 'Editar Contato';

      if (this._data.client.phones) {
        this._data.client.phones.forEach((item) => {
          this.phones.push(this.createTelephoneFromData(item));
        });
      }

      if (this._data.client.emails) {
        this._data.client.emails.forEach((item) => {
          this.emails.push(this.createEmailFromData(item));
        });
      }

      this.formClient.patchValue({
        ...this._data.client,
      });
    } else {
      this.phones.push(this.createTelephone());
      this.emails.push(this.createEmail());
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  public postClient(client) {
    this._initOrStopLoading();

    this._clientService
      .post({
        ...client,
        payment_first_date: dayjs(client.payment_first_date).format(
          'YYYY-MM-DD'
        ),
        final_date: dayjs(client.final_date).format('YYYY-MM-DD'),
      })
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Contato cadastrado com sucesso!');
          this.isToGoToContract = true;
          this.tabToContract = 1;
          this.client_id = res.data.id;
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  public patch(id: number, client) {
    this._initOrStopLoading();

    this._clientService
      .patch(id, {
        ...client,
        payment_first_date: dayjs(client.payment_first_date).format(
          'YYYY-MM-DD'
        ),
        final_date: dayjs(client.final_date).format('YYYY-MM-DD'),
      })
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Contato atualizado com sucesso!');
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  public prepareFormData(client) {
    const clientFormData = new FormData();

    Object.keys(client).forEach((key) => {
      if (key == 'phones') {
        client.phones.forEach((telephone) => {
          clientFormData.append('phones[]', JSON.stringify(telephone));
        });
      } else if (key == 'emails') {
        client.emails.forEach((email) => {
          clientFormData.append('emails[]', JSON.stringify(email));
        });
      } else if (key == 'payment_first_date') {
        clientFormData.append(
          'payment_first_date',
          dayjs(client.payment_first_date).format('YYYY-MM-DD')
        );
      } else if (key == 'final_date') {
        clientFormData.append(
          'final_date',
          dayjs(client.final_date).format('YYYY-MM-DD')
        );
      } else if (key == 'date_hire') {
        clientFormData.append(
          'date_hire',
          dayjs(client.date_hire).format('YYYY-MM-DD')
        );
      } else clientFormData.append(key, client[key]);
    });

    return clientFormData;
  }

  public onConfirm(): void {
    if (!this.formClient.valid || this.loading) return;

    if (this.isNewClient) {
      this.postClient({
        ...this.formClient.getRawValue(),
      });
    } else {
      this.patch(this._data.client.id, {
        ...this.formClient.getRawValue(),
      });
    }
  }

  public postContract(): void {
    if (!this.formContract.valid || this.loading) return;

    this._initOrStopLoading();

    this._clientService
      .postContract(
        this._data?.client.id ?? this.client_id,
        this.prepareFormData({ ...this.formContract.getRawValue() })
      )
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Contrato adicionado!');
          this.formContract.reset();

        },
        error: (err) => {
          this._toastr.error('Erro ao adicionar contrato!');
        },
      });
  }

  public onCancel(): void {
    this._dialogRef.close(this.isToUpdateTable);
  }

  // Telephones
  public createTelephone(): FormGroup {
    return this._fb.group({
      id: [null],
      name: [null, Validators.required],
      phone: [null, Validators.required],
    });
  }

  private createTelephoneFromData(item: any): FormGroup {
    return this._fb.group({
      id: [item.id],
      name: [{ value: item.name }, Validators.required],
      phone: [{ value: item.key }, [Validators.required]],
    });
  }

  public pushTelephone(): void {
    this.phones.push(this.createTelephone());
  }

  public onDeleteTelephone(index: number): void {
    // if (!this.phones.value[index].id) {
    //   this.phones.removeAt(index);

    //   if (this.phones.length === 0) {
    //     this.phones.push(this.createTelephone());
    //   }
    //   return;
    // }

    this.deleteTelephone(index);
    this.phones.removeAt(index);

    if (this.phones.length === 0) {
      this.phones.push(this.createTelephone());
    }
  }

  private deleteTelephone(index) {
    this._clientService.deletePhone(this.phones.value[index].id).subscribe({
      next: (res) => {
        this.isToUpdateTable = true;
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
      name: [null, Validators.required],
      email: [null, Validators.required],
    });
  }

  private createEmailFromData(item: any): FormGroup {
    return this._fb.group({
      id: [item.id],
      name: [{ value: item.name }, [Validators.required]],
      email: [{ value: item.key }, [Validators.required]],
    });
  }

  public pushEmail(): void {
    this.emails.push(this.createEmail());
  }

  public onDeleteEmail(index: number): void {
    // if (!this.emails.value[index].id) {
    //   this.emails.removeAt(index);

    //   if (this.emails.length === 0) {
    //     this.emails.push(this.createEmail());
    //   }
    //   return;
    // }

    this.deleteEmail(index);
    this.emails.removeAt(index);

    if (this.emails.length === 0) {
      this.emails.push(this.createTelephone());
    }
  }

  private deleteEmail(index) {
    this._clientService.deleteEmail(this.emails.value[index].id).subscribe({
      next: (res) => {
        this.isToUpdateTable = true;
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    });
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.formContract.patchValue({
        contract: file,
      });
    }
  }

  // Getters
  public get phones(): FormArray {
    return this.formClient.get('phones') as FormArray;
  }

  public get emails(): FormArray {
    return this.formClient.get('emails') as FormArray;
  }

  // Getters do Back
  public getUsersFromBack() {
    this._userService.getUsers().subscribe((res) => {
      this.userSelect = res.data;

      this.filteredConsultants.next(
        this.userSelect
          .filter(
            (user) =>
              user.role.toLowerCase() === UserRoles.Consultant.toLowerCase()
          )
          .slice()
      );

      this.filteredSellers.next(
        this.userSelect
          .filter(
            (user) => user.role.toLowerCase() === UserRoles.Seller.toLowerCase()
          )
          .slice()
      );

      this.filteredTechnicals.next(
        this.userSelect
          .filter(
            (user) => user.role.toLowerCase() === UserRoles.Seller.toLowerCase()
          )
          .slice()

        // this.userSelect.filter(user => (user.role).toLowerCase() === (UserRoles.Technical).toLowerCase()).slice() -> CORRETO
      );
    });
  }

  public getSegmentsFromBack() {
    this._segmentService.getList().subscribe((res) => {
      this.segmentSelect = res.data;

      this.filteredSegments.next(this.segmentSelect.slice());
    });
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

  // Filters
  protected prepareFilterConsultantCtrl() {
    this.consultantFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.userSelect
              .filter(
                (user) =>
                  user.role.toLowerCase() === UserRoles.Consultant.toLowerCase()
              )
              .slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter((user) =>
              user.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredConsultants.next(filtered);
      });
  }

  protected prepareFilterSellerCtrl() {
    this.sellerFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.userSelect
              .filter(
                (user) =>
                  user.role.toLowerCase() === UserRoles.Seller.toLowerCase()
              )
              .slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter((user) =>
              user.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredSellers.next(filtered);
      });
  }

  protected prepareFilterTechnicalCtrl() {
    this.technicalFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.userSelect
              .filter(
                (user) =>
                  user.role.toLowerCase() === UserRoles.Technical.toLowerCase()
              )
              .slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter((user) =>
              user.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredTechnicals.next(filtered);
      });
  }

  protected prepareFilterSegmentCtrl() {
    this.segmentFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.segmentSelect.slice();
          } else {
            search = search.toLowerCase();
            return this.userSelect.filter((segment) =>
              segment.name.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredSegments.next(filtered);
      });
  }

  // CEP
  public states: string[] = Object.values(Estados);

  public citys: string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public autocompleteCep() {
    if (this.formClient.get('cep').value.length == 8) {
      this._utilsService
        .getAddressByCep(this.formClient.get('cep').value)
        .subscribe((res) => {
          if (res.erro) {
            this._toastr.error('CEP Inválido para busca!');
          } else {
            this.formClient.get('street').patchValue(res.logradouro);
            this.formClient.get('city').patchValue(res.localidade);
            this.formClient.get('state').patchValue(res.uf);
            this.formClient.get('neighborhood').patchValue(res.bairro);
          }
        });
    }
  }

  public atualizarCidades(uf: string): void {
    this._utilsService
      .obterCidadesPorEstado(uf)
      .pipe(map((res) => res.map((city) => city.nome)))
      .subscribe({
        next: (names) => {
          this.citys = names;
          this.filteredCitys.next(this.citys.slice());
        },
        error: (error) => {
          console.error('Erro ao obter cidades:', error);
        },
      });
  }

  protected filterCitys() {
    if (!this.citys) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCitys.next(this.citys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCitys.next(
      this.citys.filter((city) => city.toLowerCase().indexOf(search) > -1)
    );
  }
}
