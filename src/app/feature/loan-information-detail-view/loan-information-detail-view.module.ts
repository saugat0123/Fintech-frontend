import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanInformationDetailViewComponent } from './loan-information-detail-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {ThemeModule} from '../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {ReportingModule} from '../reporting/reporting.module';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import {CreditChecklistViewComponent} from '../loan-information-view/credit-checklist-view/credit-checklist-view.component';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {CoreModule} from '../../@core/core.module';



@NgModule({
    declarations: [LoanInformationDetailViewComponent, CreditChecklistViewComponent],
  imports: [
    CommonModule,
    LoanInformationViewModule,
    ThemeModule,
    NgxPrintModule,
    ReportingModule,
    LoanInformationTemplateModule,
    LoanSummaryModule,
    NepaliCalendarModule,
    CoreModule,

  ]
})
export class LoanInformationDetailViewModule { }
