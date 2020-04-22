import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoanUpdateRoutingModule} from './loan-update-routing.module';
import {UpdateLoanDashboardComponent} from './component/update-loan-dashboard/update-loan-dashboard.component';
import {ThemeModule} from '../../@theme/theme.module';
import { UpdateInsuranceComponent } from './component/update-insurance/update-insurance.component';


@NgModule({
  declarations: [UpdateLoanDashboardComponent, UpdateInsuranceComponent],
  imports: [
    CommonModule,
    LoanUpdateRoutingModule,
    ThemeModule
  ]
})
export class LoanUpdateModule {
}
