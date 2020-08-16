import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './component/customer-list/customer.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {ThemeModule} from '../../@theme/theme.module';
import {CustomerProfileComponent} from './component/customer-profile/customer-profile.component';
import {CustomerGroupLoanComponent} from './component/customer-group-loan/customer-group-loan.component';
import {CustomerFormComponent} from './component/individual-customer-form/customer-form.component';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbDatepickerModule, NbDialogModule} from '@nebular/theme';
import {KycFormComponent} from './component/individual-customer-form/kyc-form/kyc-form.component';
import {CustomerLoanInformationComponent} from './component/customer-loan-information/customer-loan-information.component';


@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [CustomerComponent, CustomerProfileComponent, CustomerGroupLoanComponent, CustomerFormComponent, KycFormComponent, CustomerLoanInformationComponent],
  exports: [
    CustomerGroupLoanComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ThemeModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    NbDatepickerModule,
    NepaliCalendarModule,
    NbDialogModule.forRoot(),


  ],
  entryComponents: [CustomerFormComponent]
})
export class CustomerModule {
}
