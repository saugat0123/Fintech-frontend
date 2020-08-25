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
import {CustomerLoanInformationComponent} from './component/customer-loan-information/customer-loan-information.component';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import { KycEditComponent } from './component/individual-customer-form/kyc-edit/kyc-edit.component';
import { CompanyFormComponent } from './component/company-form/company-form.component';
import {KycFormComponent} from './component/customer-profile/kyc-form/kyc-form.component';

const COMPONENTS = [
  CustomerComponent,
  CustomerProfileComponent,
  CustomerGroupLoanComponent,
  CustomerFormComponent,
  CustomerLoanInformationComponent,
  KycEditComponent,
  KycFormComponent
];

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [...COMPONENTS, CompanyFormComponent, KycFormComponent, ],
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
    LoanInformationTemplateModule


  ],
  entryComponents: [
      CustomerFormComponent,
      CompanyFormComponent,
      KycFormComponent,
      KycEditComponent
  ]
})
export class CustomerModule {
}
