import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanInformationDetailViewComponent } from './loan-information-detail-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {ThemeModule} from '../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {ReportingModule} from '../reporting/reporting.module';



@NgModule({
  declarations: [LoanInformationDetailViewComponent],
  imports: [
    CommonModule,
    LoanInformationViewModule,
    ThemeModule,
    NgxPrintModule,
    ReportingModule,

  ]
})
export class LoanInformationDetailViewModule { }
