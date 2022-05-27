import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoanInformationDetailViewComponent} from './loan-information-detail-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {ThemeModule} from '../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {ReportingModule} from '../reporting/reporting.module';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import {DetailViewBaseComponent} from './detail-view-base/detail-view-base.component';
import {CreditChecklistViewComponent} from '../loan-information-view/credit-checklist-view/credit-checklist-view.component';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {CoreModule} from '../../@core/core.module';
import {CbsGroupModule} from '../cbs-group/cbs-group.module';
import {NepaliPatroModule} from 'nepali-patro';
import {RetailPurposeAndJustificationComponent} from './retail-purpose-and-justification/retail-purpose-and-justification.component';
import {RetailSourceOfRepaymentComponent} from './retail-source-of-repayment/retail-source-of-repayment.component';
import {RetailRecommendationComponent} from './retail-recommendation/retail-recommendation.component';
import {AboveRiskAnalysisComponent} from '../loan/component/loan-summary/sme-loan-summary/above-ten-million/above-risk-analysis/above-risk-analysis.component';
import {CustomerKycViewComponent} from './customer-kyc-view/customer-kyc-view.component';
import {CustomerBusinessActivityOrBackgroundsComponent} from './customer-business-activity-or-backgrounds/customer-business-activity-or-backgrounds.component';
import {CustomerNetWorthViewComponent} from './customer-net-worth-view/customer-net-worth-view.component';


@NgModule({
  declarations: [LoanInformationDetailViewComponent, CreditChecklistViewComponent,
    DetailViewBaseComponent, RetailPurposeAndJustificationComponent,
    RetailSourceOfRepaymentComponent, RetailRecommendationComponent, CustomerKycViewComponent,
      CustomerBusinessActivityOrBackgroundsComponent, CustomerNetWorthViewComponent
  ],
  exports: [
    CreditChecklistViewComponent, AboveRiskAnalysisComponent
  ],
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
    CbsGroupModule,
    NepaliPatroModule,
  ]
})
export class LoanInformationDetailViewModule {
}
