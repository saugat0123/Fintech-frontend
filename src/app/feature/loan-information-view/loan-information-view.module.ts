import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InsuranceViewComponent} from './insurance-view/insurance-view.component';
import {CoreModule} from '../../@core/core.module';
import {FinancialViewComponent} from './financial-view/financial-view.component';
import {NbTabsetModule} from '@nebular/theme';

import { GuarantorViewComponent } from './guarantor-view/guarantor-view.component';
import {SiteVisitViewComponent} from './sitevisit-view/site-visit-view.component';


@NgModule({
  declarations: [InsuranceViewComponent, FinancialViewComponent, GuarantorViewComponent , SiteVisitViewComponent],
  exports: [
    InsuranceViewComponent,
    FinancialViewComponent,
    GuarantorViewComponent,
    SiteVisitViewComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    NbTabsetModule
  ]
})
export class LoanInformationViewModule {
}
