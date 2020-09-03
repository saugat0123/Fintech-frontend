import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './component/customer-list/customer.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {ThemeModule} from '../../@theme/theme.module';
import {CustomerProfileComponent} from './component/customer-profile/individual-profile/customer-profile.component';
import {CustomerGroupLoanComponent} from './component/customer-loan-list-view-template/customer-group-loan.component';
import {CustomerFormComponent} from './component/customer-form/individual-form/customer-form.component';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {NbDatepickerModule, NbDialogModule} from '@nebular/theme';
import {CustomerLoanInformationComponent} from './component/customer-loan-information/customer-loan-information.component';
import {LoanInformationTemplateModule} from '../loan-information-template/loan-information-template.module';
import { CompanyFormComponent } from './component/customer-form/company-form/company-form.component';
import { CompanyProfileComponent } from './component/customer-profile/company-profile/company-profile.component';
import { CompanyProfileAdditionalInformationComponent } from './component/customer-profile/company-profile/company-profile-additional-information/company-profile-additional-information.component';
import { CustomerDocComponent } from './component/customer-doc-management/customer-doc.component';
import { KycFormComponent } from './component/customer-profile/individual-profile/kyc-form/kyc-form.component';
import { CustomerLoanInformationViewComponent } from './component/customer-loan-information-view/customer-loan-information-view.component';
import { LoanInformationViewModule } from '../loan-information-view/loan-information-view.module';
import { GroupTaggingComponent } from './component/customer-profile/group-tagging/group-tagging.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { CompanyDetailEditComponent } from './component/customer-profile/company-profile/company-profile-detail-edit/company-detail-edit.component';

const COMPONENTS = [
  CustomerComponent,
  CustomerProfileComponent,
  CustomerGroupLoanComponent,
  CustomerFormComponent,
  KycFormComponent,
  CompanyProfileComponent,
  CompanyProfileAdditionalInformationComponent,
  CompanyFormComponent,
  CustomerLoanInformationComponent,
  CustomerDocComponent,
  CustomerLoanInformationViewComponent,
  CompanyFormComponent,
  CustomerDocComponent,
  CustomerLoanInformationViewComponent,
  GroupTaggingComponent,
  CompanyDetailEditComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  // tslint:disable-next-line:max-line-length
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
    LoanInformationViewModule,
    InfiniteScrollModule


  ],
  entryComponents: [
      CustomerFormComponent,
      CompanyFormComponent,
      KycFormComponent,
      CompanyDetailEditComponent
  ]
})
export class CustomerModule {
}
