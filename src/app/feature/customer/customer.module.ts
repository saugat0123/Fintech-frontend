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
import {CompanyFormComponent} from './component/customer-form/company-form/company-form.component';
import {CompanyProfileComponent} from './component/customer-profile/company-profile/company-profile.component';
import {CompanyProfileAdditionalInformationComponent} from './component/customer-profile/company-profile/company-profile-additional-information/company-profile-additional-information.component';
import {CustomerDocComponent} from './component/customer-doc-management/customer-doc.component';
import {CustomerLoanInformationViewComponent} from './component/customer-loan-information-view/customer-loan-information-view.component';
import {LoanInformationViewModule} from '../loan-information-view/loan-information-view.module';
import {GroupTaggingComponent} from './component/customer-profile/group-tagging/group-tagging.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
// tslint:disable-next-line:max-line-length
import {EditManagementTeamComponent} from './component/customer-profile/company-profile/edit-management-team/edit-management-team.component';
import {EditSwotComponent} from './component/customer-profile/company-profile/edit-swot/edit-swot.component';
import {EditPartnerInfoComponent} from './component/customer-profile/company-profile/edit-partner-info/edit-partner-info.component';
import {CustomerLoanApplyComponent} from './component/customer-loan-apply/customer-loan-apply.component';
import {CustomerLoanEditComponent} from './component/customer-loan-edit/customer-loan-edit.component';
import {ReportingModule} from '../reporting/reporting.module';
import {CustomerListGroupComponent} from './component/customer-group-associate-loan-list/customer-list-group.component';
import {CoreModule} from '../../@core/core.module';
import {ActivityListComponent} from './component/activity-list/activity-list.component';
import {CustomerActivityModule} from '../customer-activity/customer-activity.module';
import {BankingRelationComponent} from './component/customer-form/banking-relation/banking-relation.component';
import {CompanyOtherDetailComponent} from './component/customer-form/company-form/company-other-detail/company-other-detail.component';
import {MarketScenarioComponent} from './component/customer-form/company-form/market-scenario/market-scenario.component';
import {LoanSummaryModule} from '../loan/component/loan-summary/loan-summary.module';
import {TranslateModule} from '@ngx-translate/core';
import {FeatureModule} from '../feature.module';
import {CbsGroupModule} from '../cbs-group/cbs-group.module';
import {MicroLoanModule} from '../micro-loan/micro-loan.module';
import {CustomerGroupComponent} from './component/customer-profile/individual-profile/customer-group/customer-group.component';
import {JointFormComponent} from './component/customer-form/joint-form/joint-form.component';
import {ChangeLoanComponent} from './component/change-loan/change-loan.component';
import {LoanInformationDetailViewModule} from '../loan-information-detail-view/loan-information-detail-view.module';

const COMPONENTS = [
  CustomerComponent,
  CustomerProfileComponent,
  CustomerGroupLoanComponent,
  CustomerFormComponent,
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
  CustomerLoanApplyComponent,
  EditSwotComponent,
  EditPartnerInfoComponent,
  EditManagementTeamComponent,
  CustomerLoanEditComponent,
  CustomerListGroupComponent,
  BankingRelationComponent,
  JointFormComponent
];

@NgModule({
    declarations: [...COMPONENTS, ActivityListComponent, CompanyOtherDetailComponent, MarketScenarioComponent, CustomerGroupComponent, ChangeLoanComponent],
    exports: [
        CustomerGroupLoanComponent,
        CompanyFormComponent,
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
        InfiniteScrollModule,
        ReportingModule,
        CoreModule,
        CustomerActivityModule,
        LoanSummaryModule,
        TranslateModule,
        FeatureModule,
        CbsGroupModule,
        MicroLoanModule,
        LoanInformationDetailViewModule
    ],
  entryComponents: [
    CustomerFormComponent,
    CompanyFormComponent,
    EditManagementTeamComponent,
    EditPartnerInfoComponent,
    EditSwotComponent,
    CustomerLoanApplyComponent,
    JointFormComponent,
    ChangeLoanComponent
  ]
})
export class CustomerModule {
}
