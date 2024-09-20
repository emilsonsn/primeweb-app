import {NgModule} from '@angular/core';
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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { DialogPhoneCallDetailsComponent } from './dialog-phone-call-details/dialog-phone-call-details.component';
import { DialogSegmentComponent } from './dialog-segment/dialog-segment.component';
import { DialogContactComponent } from './dialog-contact/dialog-contact.component';
import { DialogContactDetailsComponent } from './dialog-contact-details/dialog-contact-details.component';
import { MatChipsModule } from '@angular/material/chips';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { DialogOccurrenceContactComponent } from './dialog-occurrence-contact/dialog-occurrence-contact.component';
import { DialogCalendarComponent } from './dialog-calendar/dialog-calendar.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

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
    DialogCalendarComponent
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
    TextFieldModule,
    CdkTextareaAutosize,
    CurrencyMaskModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMatSelectSearchModule
  ]
})
export class DialogsModule {
}
