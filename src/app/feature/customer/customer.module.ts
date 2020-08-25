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
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import { CompanyFormComponent } from './component/company-form/company-form.component';
import { CustomerLoanInformationViewComponent } from './component/customer-loan-information-view/customer-loan-information-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';

const COMPONENTS = [
  CustomerComponent,
  CustomerProfileComponent,
  CustomerGroupLoanComponent,
  CustomerFormComponent,
  KycFormComponent,
  CustomerLoanInformationComponent
];

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [...COMPONENTS, CompanyFormComponent, CustomerLoanInformationViewComponent, ],
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
    LoanInformationTemplateModule,
    LoanInformationViewModule


  ],
  entryComponents: [
      CustomerFormComponent,
      CompanyFormComponent
  ]
})
export class CustomerModule {
}
