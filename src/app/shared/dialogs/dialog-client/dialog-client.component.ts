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
import { finalize, map, ReplaySubject } from 'rxjs';
import { Contact, ContactOriginEnum } from '@models/contact';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ContactService } from '@services/contact.service';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import { SegmentService } from '@services/segment.service';
import { Segment } from '@models/segment';
import { UtilsService } from '@services/utils.service';
import { Estados } from '@models/utils';
import { SessionQuery } from '@store/session.query';
import { ClientService } from '@services/client.service';

@Component({
  selector: 'app-dialog-client',
  templateUrl: './dialog-client.component.html',
  styleUrl: './dialog-client.component.scss',
})
export class DialogClientComponent {
  public loading: boolean = false;
  public title: string = 'Novo Cliente';
  protected isNewClient: boolean = true;
  protected isToEdit: boolean = false;
  protected canEditUserId: boolean = false;

  protected form: FormGroup;

  // Getters
  protected originSelect = Object.values(ContactOriginEnum);

  // Search de Users
  protected userSelect: User[] = [];
  protected userCtrl: FormControl<any> = new FormControl<any>(null);
  protected userFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // Search de Segment
  protected segmentSelect: Segment[] = [];
  protected segmentCtrl: FormControl<any> = new FormControl<any>(null);
  protected segmentFilterCtrl: FormControl<any> = new FormControl<string>('');
  protected filteredsegments: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  // Return Time e Return_Time
  protected date;

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
  ) {}

  ngOnInit(): void {
    this.getUsersFromBack();
    this.getSegmentsFromBack();

    this.form = this._fb.group({
      user_id: [null],
      company: [null],
      domain: [null],
      responsible: [null],
      responsible_2: [null],
      origin: [null],
      return_date: [null],
      return_time: [null],
      cnpj: [null],
      cep: [null],
      street: [null],
      number: [null],
      neighborhood: [null],
      city: [null],
      state: [null],
      observations: [''],
      segments: [null],
      phones: this._fb.array([]),
      emails: this._fb.array([]),
      contract_number: [''],
      contract_file: [''],
      date: [''],
      contract_words: [''],
      mensality: [''],
      first_parcel_date: [''],
      end_contract: [''],
      day_vencimento: [''],
      consultor: [''],
      vendedor: [''],
      tecnico: [''],
      layout: [''],
      service: [''],
      contract_observations: [''],
    });

    this.isToHabilitateFieldUserId();

    this.cityFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterCitys();
    });

    this.form.get('state').valueChanges.subscribe((res) => {
      this.atualizarCidades(res);
    });

    this.form.get('cep').valueChanges.subscribe((res) => {
      this.autocompleteCep();
    });

    this.form.valueChanges.subscribe((res) => {
      console.log(res);
    });

    if (this._data) {
      this.isNewClient = false;
      this.title = 'Editar Contato';

      if (this._data.contact.phones) {
        this._data.contact.phones.forEach((item) => {
          this.phones.push(this.createTelephoneFromData(item));
        });
      }

      if (this._data.contact.emails) {
        this._data.contact.emails.forEach((item) => {
          this.emails.push(this.createEmailFromData(item));
        });
      }

      if (this._data.contact.segments) {
        const newSegments = this._data.contact.segments.map(
          (segmentContact) => ({
            id: segmentContact.segment.id,
            name: segmentContact.segment.name,
          })
        );

        this.segments.set(newSegments);
      }

      this.form.patchValue({
        ...this._data.contact,
      });

      const returnDate =
        this.form.get('return_date').value +
        `T${this.form.get('return_time').value}`;
      this.date = new Date(returnDate);
    } else {
      this.phones.push(this.createTelephone());
      this.emails.push(this.createEmail());
    }

    // Filter de Users
    this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterCitys();
    });
  }

  public post(contact: Contact) {
    this._initOrStopLoading();

    this._clientService
      .post(this.prepareFormData(contact))
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success('Contato cadastrado com sucesso!');
          this._dialogRef.close(true);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  public patch(id: number, contact: Contact) {
    this._initOrStopLoading();

    this._clientService
      .patch(id, { ...contact })
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

  public prepareFormData(contact: Contact) {
    const contactFormData = new FormData();

    Object.keys(contact).forEach((key) => {
      if (key == 'phones') {
        contact.phones.forEach((telephone) => {
          contactFormData.append('phones[]', JSON.stringify(telephone));
        });
      } else if (key == 'segments') {
        contact.segments.forEach((segment) => {
          contactFormData.append('segments[]', JSON.stringify(segment));
        });
      } else if (key == 'emails') {
        contact.emails.forEach((email) => {
          contactFormData.append('emails[]', JSON.stringify(email));
        });
      }
      else contactFormData.append(key, contact[key]);
    });

    return contactFormData;
  }

  public onConfirm(): void {
    if (!this.form.valid || this.loading) return;

    if (this.isNewClient) {
      this.post({
        ...this.form.getRawValue(),
        segments: this.segments(),
        return_date: dayjs(this.date).format('YYYY-MM-DD'),
        return_time: dayjs(this.date).format('HH:mm'),
      });
    } else {
      this.patch(this._data.contact.id, {
        ...this.form.getRawValue(),
        segments: this.segments(),
        return_date: dayjs(this.date).format('YYYY-MM-DD'),
        return_time: dayjs(this.date).format('HH:mm'),
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
      phone: [null, Validators.required],
    });
  }

  private createTelephoneFromData(item: any): FormGroup {
    return this._fb.group({
      id: [item.id],
      phone: [{ value: item.key }, [Validators.required]],
    });
  }

  public pushTelephone(): void {
    this.phones.push(this.createTelephone());
  }

  public onDeleteTelephone(index: number): void {
    if (!this.phones.value[index].id) {
      this.phones.removeAt(index);

      if (this.phones.length === 0) {
        this.phones.push(this.createTelephone());
      }
      return;
    }

    // this.deleteTelephone(index);

    if (this.phones.length === 0) {
      this.phones.push(this.createTelephone());
    }
  }

  /*
    private deleteTelephone(index) {
      this._clientService.deleteItem(this.phones.value[index].id).subscribe({
        next: () => {
          this._toastr.success('Item deletado com sucesso');
          this.phones.removeAt(index);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
    }
  */

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

    // this.deleteEmail(index);

    if (this.emails.length === 0) {
      this.emails.push(this.createTelephone());
    }
  }

  // private deleteEmail(index) {
  //   this._clientService.deleteItem(this.phones.value[index].id).subscribe({
  //     next: () => {
  //       this._toastr.success('Item deletado com sucesso');
  //       this.emails.removeAt(index);
  //     },
  //     error: (err) => {
  //       this._toastr.error(err.error.error);
  //     },
  //   });
  // }

  // Segments
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentSegment = model({ id: 0, name: '' });
  segments = signal<{ id: number; name: string }[]>([]);
  allSegments = [];
  readonly filteredSegments = signal(this.allSegments);

  readonly announcer = inject(LiveAnnouncer);

  filterSegments(): void {
    const currentSegmentValue = this.currentSegment().name;

    if (typeof currentSegmentValue === 'string') {
      const loweredSegmentValue = currentSegmentValue.toLowerCase();

      this.filteredSegments.set(
        loweredSegmentValue
          ? this.allSegments.filter((segment) =>
              segment.name.toLowerCase().includes(loweredSegmentValue)
            )
          : this.allSegments.slice()
      );
    } else {
      this.filteredSegments.set(this.allSegments.slice());
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.segments.update((segments) => [
        ...segments,
        { id: Date.now(), name: value },
      ]);
    }

    this.currentSegment.set({ id: 0, name: '' });
    event.input.value = '';
  }

  remove(segment: { id: number; name: string }): void {
    this.segments.update((segments) => {
      const index = segments.findIndex((s) => s.id === segment.id);
      if (index < 0) {
        return segments;
      }

      segments.splice(index, 1);
      this.announcer.announce(`Removed ${segment.name}`);
      return [...segments];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedSegment = event.option.value as { id: number; name: string };

    if (!this.segments().find((segment) => segment.id === selectedSegment.id)) {
      this.segments.update((segments) => [...segments, selectedSegment]);
    }

    this.currentSegment.set({ id: 0, name: '' });
  }

  trackBySegmentId(index: number, segment: { id: number; name: string }) {
    return segment.id;
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public clearDate() {
    this.form.get('date').patchValue('');
  }

  public isToHabilitateFieldUserId() {
    this._sessionQuery.user$.subscribe((user) => {
      if (user?.role != 'Seller') this.canEditUserId = true;
    });
  }

  public onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({
        contract_file: file
      });
    }
  }

  // Getters
  public get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  public get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  public get getSegments() {
    return this.form.get('segments') as FormArray;
  }

  // Getters do Back
  public getUsersFromBack() {
    this._userService.getUsers().subscribe((res) => {
      this.userSelect = res.data;
      this.filteredUsers.next(this.userSelect.slice());
    });
  }

  public getSegmentsFromBack() {
    this._segmentService.getList().subscribe((res) => {
      for (let segment of res.data) {
        this.allSegments.push({
          id: segment.id,
          name: segment.name,
        });
      }
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

  // CEP
  public states: string[] = Object.values(Estados);

  public citys: string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public autocompleteCep() {
    if (this.form.get('cep').value.length == 8) {
      this._utilsService
        .getAddressByCep(this.form.get('cep').value)
        .subscribe((res) => {
          if (res.erro) {
            this._toastr.error('CEP Inválido para busca!');
          } else {
            this.form.get('street').patchValue(res.logradouro);
            this.form.get('city').patchValue(res.localidade);
            this.form.get('state').patchValue(res.uf);
            this.form.get('neighborhood').patchValue(res.bairro);
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
