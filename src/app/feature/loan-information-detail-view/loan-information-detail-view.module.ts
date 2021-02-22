import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanInformationDetailViewComponent } from './loan-information-detail-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {ThemeModule} from '../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {ReportingModule} from '../reporting/reporting.module';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import { DetailViewBaseComponent } from './detail-view-base/detail-view-base.component';
import {MicroLoanModule} from '../micro-loan/micro-loan.module';



@NgModule({
  declarations: [LoanInformationDetailViewComponent, DetailViewBaseComponent],
  imports: [
    CommonModule,
    LoanInformationViewModule,
    ThemeModule,
    NgxPrintModule,
    ReportingModule,
    LoanInformationTemplateModule,
    LoanSummaryModule,
    MicroLoanModule,

  ]
})
export class LoanInformationDetailViewModule { }
