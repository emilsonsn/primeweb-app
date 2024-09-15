import {Component, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {DialogUserComponent} from '@shared/dialogs/dialog-user/dialog-user.component';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs';
import {ISmallInformationCard} from '@models/cardInformation';
import {User, UserStatus} from '@models/user';
import {UserService} from '@services/user.service';
import { HeaderService } from '@services/header.service';
import { FormBuilder, FormGroup } from '@angular/forms';

// Calendar
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayjs from 'dayjs';

import ptBrLocale from '@fullcalendar/core/locales/pt-br';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  public loading: boolean = false;
  protected formFilters: FormGroup;
  protected filters;

  statusSelection = Object.values(UserStatus);

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _userService: UserService,
    private readonly _headerService: HeaderService,
    private readonly _fb: FormBuilder
  ) {
    this._headerService.setTitle('Agenda');
    this._headerService.setUpperTitle('Agenda - Primeweb');

    window.addEventListener('resize', () => {
      this.calendarComponent.getApi().updateSize();
    });
  }

  ngOnInit(): void {
    this.formFilters = this._fb.group({
      responsible: [null],
    });
  }

  openDialogCollaborator(user?) {
    this._dialog
      .open(DialogUserComponent, {
        data: { user },
        width: '80%',
        maxWidth: '850px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const id = +res.get('id');
          if (id) {
            this._patchCollaborator(res);
            return;
          }

          this._postCollaborator(res);
        }
      });
  }

  _patchCollaborator(collaborator: FormData) {
    this._initOrStopLoading();
    const id = +collaborator.get('id');
    this._userService
      .patchUser(id, collaborator)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  _postCollaborator(collaborator: User) {
    this._initOrStopLoading();

    this._userService
      .postUser(collaborator)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  onDeleteCollaborator(id) {
    const text = 'Tem certeza? Essa ação não pode ser revertida!';
    this._dialog
      .open(DialogConfirmComponent, { data: { text } })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this._deleteCollaborator(id);
        }
      });
  }

  _deleteCollaborator(id: number) {
    this._initOrStopLoading();
    this._userService
      .deleteUser(id)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Calendário
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  protected calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: (arg) => this.handleDateClick(arg),
    weekends: true,
    locale: ptBrLocale,
    headerToolbar: {
      left: 'title',
      center: 'dayGridDay,dayGridWeek,dayGridMonth',
      right: 'today prev,next',
    },
    // Propriedades para arrastar o evento
    // editable: true,
    // droppable: true
  };

  // eventsPromise: Promise<EventInput[]> = new Promise<EventInput[]>((resolve, reject) => {
  //   this._userService
  //    .getAllUsers()
  //    .subscribe((res) => {
  //       const events: EventInput[] = res.data.map((user: User) => {
  //         return {
  //           id: user.id,
  //           title: user.name,
  //           start: new Date(user.birth_date),
  //           allDay: true,
  //         };
  //       });
  //       resolve(events);
  //     });
  // });;

  protected eventsPromise: Promise<EventInput[]> = new Promise<EventInput[]>(
    (resolve, reject) => {
      const events: EventInput[] = [
        {
          id: 'teste',
          title: 'teste',
          start: new Date(),
          propriedadeTest : 'gabriel',
          type: 'closed'
        },
        {
          id: 'teste2',
          title: 'teste2',
          start: dayjs().add(5, 'day').toDate(),
          propriedadeTest : 'gabriel',
          type: 'lost'
        },
      ];
      resolve(events);
    }
  );

  handlePropriedadeTest(arg) {
    alert('Nome: ' + arg);
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  protected infoApiCalendar() {
    let calendarApi = this.calendarComponent.getApi();
    // calendarApi.;
  }

  // Utils
  public updateFilters() {
    this.filters = this.formFilters.getRawValue();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }
}
