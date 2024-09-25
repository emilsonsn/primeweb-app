import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogConfirmComponent } from '@shared/dialogs/dialog-confirm/dialog-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { User, UserStatus } from '@models/user';
import { HeaderService } from '@services/header.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OccurrenceService } from '@services/occurrence.service';

// Calendar
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayjs from 'dayjs';

import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { DialogCalendarComponent } from '@shared/dialogs/dialog-calendar/dialog-calendar.component';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  public loading: boolean = false;
  protected formFilters: FormGroup;

  protected statusSelection = Object.values(UserStatus);
  protected usersSelection : User[];

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _occurrenceService: OccurrenceService,
    private readonly _headerService: HeaderService,
    private readonly _fb: FormBuilder,
    private readonly _userService : UserService
  ) {
    this._headerService.setTitle('Agenda');
    this._headerService.setUpperTitle('Agenda - Primeweb');

    window.addEventListener('resize', () => {
      this.calendarComponent.getApi().updateSize();
    });
  }

  ngOnInit(): void {
    this.formFilters = this._fb.group({
      user_id: [''],
    });

    this.getUsers();
    this.loadOccurrences();
  }

  public loadOccurrences(filters?: any): void {

    let statusSchedule = 'PresentationVisit,SchedulingVisit,ReschedulingVisit';

    this.eventsPromise = new Promise<EventInput[]>((resolve, reject) => {
      this._initOrStopLoading();

      this._occurrenceService
        .getList({
          ...filters,
          status: statusSchedule
        })
        .pipe(
          finalize(() => {
            this._initOrStopLoading();
          })
        )
        .subscribe({
          next: (res) => {
            const events: EventInput[] = res.data.map((occurrence: any) => {
              return {
                id: occurrence.id,
                title: occurrence.time,
                start: dayjs(occurrence.date).format('YYYY-MM-DD'),
                end: dayjs(occurrence.date).format('YYYY-MM-DD'),
                allDay: true,
                extendedProps: {
                  occurrence,
                },
              };
            });

            resolve(events);
          },
          error: (error) => {
            this._toastr.error('Erro ao carregar as ocorrências', 'Erro');
            reject(error);
          },
        });
    });
  }

  public openOccurrenceDialog(occurrence) {
    const dialogConfig: MatDialogConfig = {
      width: '80%',
      maxWidth: '850px',
      maxHeight: '90%',
      hasBackdrop: true,
      closeOnNavigation: true,
    };

    this._dialog.open(DialogCalendarComponent, {
      data: occurrence,
      ...dialogConfig,
    })
    .afterClosed().subscribe(res => {
      if(res) {
        this.loadOccurrences();
      }
    });
  }

  // Calendário
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  protected eventsPromise: Promise<EventInput[]>;

  protected calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
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

  protected infoApiCalendar() {
    let calendarApi = this.calendarComponent.getApi();
    // calendarApi.;
  }

  // Getters
  public getUsers () {
    this._userService.getUsers()
    .subscribe({
      next: (res) => {
        this.usersSelection = res.data;
      }
    });
  }

  // Utils
  public updateFilters() {
    this.loadOccurrences(this.formFilters.getRawValue());
  }

  public clearResponsible() {
    this.formFilters.get('user_id').patchValue('');
    this.updateFilters();
  }

  public clearFormFilters() {
    this.formFilters.patchValue({
      user_id: '',
    });
    this.updateFilters();
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }
}
