import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar/calendar.component';
import {NbOverlayModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';


@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
  ],
  exports: [CalendarComponent]
})
export class NepaliCalendarModule {
}
