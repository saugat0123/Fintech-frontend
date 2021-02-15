import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroCompanyFormComponentComponent } from './form-component/micro-company-form-component/micro-company-form-component.component';
import { MicroIndividualFormComponent } from './form-component/micro-individual-form/micro-individual-form.component';
import {ThemeModule} from '../../@theme/theme.module';
import { BorrowerLoanPortofolioComponent } from './template/borrower-loan-portofolio/borrower-loan-portofolio.component';
import { MarketingActivitiesComponent } from './template/marketing-activities/marketing-activities.component';
import { BaselRiskExposureComponent } from './template/basel-risk-exposure/basel-risk-exposure.component';
import { MicroSynopsisComponent } from './form-component/micro-synopsis/micro-synopsis.component';
import { MicroSummaryComponent } from './summary/micro-summary/micro-summary.component';



@NgModule({
  declarations: [
      MicroCompanyFormComponentComponent,
      MicroIndividualFormComponent,
      BorrowerLoanPortofolioComponent,
      MarketingActivitiesComponent,
      BaselRiskExposureComponent,
      MicroSynopsisComponent,
      MicroSummaryComponent],
    exports: [
        MicroCompanyFormComponentComponent,
        MicroIndividualFormComponent,
        BaselRiskExposureComponent,
        MarketingActivitiesComponent,
        BorrowerLoanPortofolioComponent,
        MicroSynopsisComponent,
    ],
  imports: [
    CommonModule,
    ThemeModule
  ]
})
export class MicroLoanModule { }
