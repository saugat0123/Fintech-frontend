import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoanSummaryComponent} from './loan-summary.component';
import {SitevistSummaryComponentComponent} from './sitevist-summary-component/sitevist-summary-component.component';
import {FinancialSummaryComponent} from './financial-summary/financial-summary.component';
import {SecuritySummaryComponent} from './security-summary/security-summary.component';
import {InsuranceSummaryComponent} from './insurance-summary/insurance-summary.component';
import {GuarantorSummaryComponent} from './guarantor-summary/guarantor-summary.component';
import {CustomerGroupSummaryComponent} from './customer-group-summary/customer-group-summary.component';
import {ThemeModule} from '../../../../@theme/theme.module';
import {LoanSummaryRoutingModule} from './loan-summary-routing.module';
import {ProposalSummaryComponent} from './proposal-summary/proposal-summary.component';
import {ReportingModule} from '../../../reporting/reporting.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../../@core/core.module';


const COMPONENTS = [
  SitevistSummaryComponentComponent,
  FinancialSummaryComponent,
  SecuritySummaryComponent,
  ProposalSummaryComponent,
  LoanSummaryComponent,
  InsuranceSummaryComponent,
  GuarantorSummaryComponent,
  CustomerGroupSummaryComponent,
  LoanSummaryComponent,
];
const ENTRY_COMPONENTS = [];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ThemeModule,
    LoanSummaryRoutingModule,
    ReportingModule,
    NgxPrintModule,
    CoreModule
  ],
  exports: [
    LoanSummaryComponent
  ],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class LoanSummaryModule { }
