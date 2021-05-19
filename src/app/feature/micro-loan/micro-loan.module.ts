import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MicroCompanyFormComponentComponent} from './form-component/micro-company-form-component/micro-company-form-component.component';
import {MicroIndividualFormComponent} from './form-component/micro-individual-form/micro-individual-form.component';
import {ThemeModule} from '../../@theme/theme.module';
import {BorrowerLoanPortfolioComponent} from './template/borrower-loan-portofolio/borrower-loan-portofolio.component';
import {MarketingActivitiesComponent} from './template/marketing-activities/marketing-activities.component';
import {BaselRiskExposureComponent} from './template/basel-risk-exposure/basel-risk-exposure.component';
import {MicroSynopsisComponent} from './form-component/micro-synopsis/micro-synopsis.component';
import {MicroSummaryComponent} from './summary/micro-summary/micro-summary.component';
import {NgxPrintModule} from 'ngx-print';
import {MicroLoanDetailViewBaseComponent} from './detail-view/micro-loan-detail-view-base/micro-loan-detail-view-base.component';
import {MicroIndividualViewComponent} from './detail-view/micro-loan-detail-view-base/micro-individual-view/micro-individual-view.component';
import {CoreModule} from '../../@core/core.module';
import {MicroCompanyInfoViewComponent} from './detail-view/micro-loan-detail-view-base/micro-company-info-view/micro-company-info-view.component';
import {MicroProposalViewComponent} from './detail-view/micro-loan-detail-view-base/micro-proposal-view/micro-proposal-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import {ReportingModule} from '../reporting/reporting.module';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import {MicroBaselRiskExposureViewComponent} from './detail-view/micro-loan-detail-view-base/micro-basel-risk-exposure-view/micro-basel-risk-exposure-view.component';
import {MicroSynopsisCreditworthinessViewComponent} from './detail-view/micro-loan-detail-view-base/micro-synopsis-creditworthiness-view/micro-synopsis-creditworthiness.component';
import {BorrowerPortfolioViewComponent} from './detail-view/micro-loan-detail-view-base/borrower-portfolio-summary-view/borrower-portfolio-view.component';
import {BorrowerFinancialComponent} from './template/borrower-financial/borrower-financial.component';
import {MarketingActivitiesViewComponent} from './detail-view/micro-loan-detail-view-base/marketing-activities-view/marketing-activities-view.component';
import {MicroCrgParamsComponent} from './template/micro-crg-params/micro-crg-params.component';
import {NgSelectModule} from '@ng-select/ng-select';

import {MicroChecklistComponent} from './detail-view/micro-loan-detail-view-base/micro-checklist/micro-checklist.component';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';


@NgModule({
  declarations: [
      MicroCompanyFormComponentComponent,
      MicroIndividualFormComponent,
      BorrowerLoanPortfolioComponent,
      MarketingActivitiesComponent,
      BaselRiskExposureComponent,
      MicroSynopsisComponent,
      MicroSummaryComponent,
      MicroLoanDetailViewBaseComponent,
      MicroIndividualViewComponent,
      MicroCompanyInfoViewComponent,
      MicroBaselRiskExposureViewComponent,
      MicroSynopsisCreditworthinessViewComponent,
      BorrowerPortfolioViewComponent,
      MicroProposalViewComponent,
      BorrowerFinancialComponent,
      MarketingActivitiesViewComponent,
      MicroChecklistComponent,
      MicroCrgParamsComponent],
    exports: [
        MicroCompanyFormComponentComponent,
        MicroIndividualFormComponent,
        BaselRiskExposureComponent,
        MarketingActivitiesComponent,
        BorrowerLoanPortfolioComponent,
        MicroSynopsisComponent,
        MicroLoanDetailViewBaseComponent,
        BorrowerFinancialComponent,
        MicroCrgParamsComponent,
    ],
    imports: [
        CommonModule,
        ThemeModule,
        NgxPrintModule,
        CoreModule,
        LoanInformationViewModule,
        LoanSummaryModule,
        ReportingModule,
        LoanInformationTemplateModule,
        NgSelectModule,
        NepaliCalendarModule,
    ]
})
export class MicroLoanModule { }
