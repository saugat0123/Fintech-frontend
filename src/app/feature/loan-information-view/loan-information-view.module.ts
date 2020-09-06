import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InsuranceViewComponent} from './insurance-view/insurance-view.component';
import {CoreModule} from '../../@core/core.module';
import {FinancialViewComponent} from './financial-view/financial-view.component';
import {NbTabsetModule} from '@nebular/theme';

import {GuarantorViewComponent} from './guarantor-view/guarantor-view.component';
import {SiteVisitViewComponent} from './sitevisit-view/site-visit-view.component';
import {IndividualViewComponent} from './individual-view/individual-view.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ThemeModule} from '../../@theme/theme.module';
import {CustomerInfoSearchFormComponent} from './customer-info-search-form/customer-info-search-form.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import { SecurityViewComponent } from './security-view/security-view.component';


@NgModule({
  declarations: [
    InsuranceViewComponent,
    FinancialViewComponent,
    GuarantorViewComponent,
    SiteVisitViewComponent,
    IndividualViewComponent,
    CustomerInfoSearchFormComponent,
    SecurityViewComponent,
  ],
  exports: [
    InsuranceViewComponent,
    FinancialViewComponent,
    GuarantorViewComponent,
    SiteVisitViewComponent,
    IndividualViewComponent,
    SecurityViewComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    NbTabsetModule,
    ReactiveFormsModule,
    ThemeModule,
    NgSelectModule,
    NepaliCalendarModule,

  ]
})
export class LoanInformationViewModule {
}
