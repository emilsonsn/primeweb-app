import {Injectable, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentsModule} from '@shared/components/components.module';
import {DirectivesModule} from '@shared/directives/directives.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {PipesModule} from '@shared/pipes/pipes.module';
import {DialogConfirmComponent} from './dialog-confirm/dialog-confirm.component';
import {FiltersModule} from './filters/filters.module';
import {DialogUserComponent} from './dialog-user/dialog-user.component';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {MatRippleModule} from '@angular/material/core';
import {NgxMaskDirective, NgxMaskPipe} from 'ngx-mask';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {TablesModule} from '@shared/tables/tables.module';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { DialogPhoneCallComponent } from './dialog-phone-call/dialog-phone-call.component';
import { DialogOccurrenceComponent } from './dialog-occurrence/dialog-occurrence.component';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { DialogPhoneCallDetailsComponent } from './dialog-phone-call-details/dialog-phone-call-details.component';
import { DialogSegmentComponent } from './dialog-segment/dialog-segment.component';
import { DialogContactComponent } from './dialog-contact/dialog-contact.component';
import { DialogContactDetailsComponent } from './dialog-contact-details/dialog-contact-details.component';
import { MatChipsModule } from '@angular/material/chips';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { DialogOccurrenceContactComponent } from './dialog-occurrence-contact/dialog-occurrence-contact.component';
import { DialogCalendarComponent } from './dialog-calendar/dialog-calendar.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatPaginator} from "@angular/material/paginator";
import { DialogClientComponent } from './dialog-client/dialog-client.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import { DialogClientStatusComponent } from './dialog-client-status/dialog-client-status.component';
import { DialogClientKeywordComponent } from './dialog-client-keyword/dialog-client-keyword.component';

@Injectable()
export class DefaultIntl extends OwlDateTimeIntl {
  upSecondLabel = 'Adicionar um segundo';
  downSecondLabel = 'Diminuir um segundo';

  upMinuteLabel = 'Adicionar um minuto';
  downMinuteLabel = 'Diminuir um minuto';

  upHourLabel = 'Adicionar uma hora';
  downHourLabel = 'Diminuir uma hora';

  prevMonthLabel = 'Mês passado';
  nextMonthLabel = 'Próximo mês';

  prevYearLabel = 'Ano passado';
  nextYearLabel = 'Próximo ano';

  prevMultiYearLabel = 'Anteriores 21 anos';
  nextMultiYearLabel = 'Próximos 21 anos';

  switchToMonthViewLabel = 'Mudar para visualização por mês';
  switchToMultiYearViewLabel = 'Escolha um mês e um ano';

  cancelBtnLabel = 'Cancelar';
  setBtnLabel = 'Aplicar';

  rangeFromLabel = 'De';
  rangeToLabel = 'Até';

  hour12AMLabel = 'AM';
  hour12PMLabel = 'PM';
}

export const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
  timePickerInput: {hour: 'numeric', minute: 'numeric', second: 'numeric'},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

@NgModule({
  declarations: [
    DialogConfirmComponent,
    DialogUserComponent,
    DialogPhoneCallComponent,
    DialogOccurrenceComponent,
    DialogPhoneCallDetailsComponent,
    DialogSegmentComponent,
    DialogContactComponent,
    DialogContactDetailsComponent,
    DialogOccurrenceContactComponent,
    DialogCalendarComponent,
    DialogClientComponent,
    DialogClientStatusComponent,
    DialogClientKeywordComponent,
  ],
  imports: [
    CommonModule,
    FiltersModule,
    TablesModule,
    ComponentsModule,
    DirectivesModule,
    ClipboardModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatIconModule,
    MatChipsModule,
    MatPaginator,
    MatStepperModule,
    MatTabsModule,
    TextFieldModule,
    CdkTextareaAutosize,
    CurrencyMaskModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMatSelectSearchModule,
  ],
  providers: [
    {provide: OwlDateTimeIntl, useClass: DefaultIntl},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},
  ]
})
export class DialogsModule {
}
