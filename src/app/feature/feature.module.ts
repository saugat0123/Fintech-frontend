import {NgModule} from '@angular/core';
import {NbAccordionModule, NbDatepickerModule, NbSelectModule} from '@nebular/theme';
import {ThemeModule} from '../@theme/theme.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FeatureRoutingModule} from './feature-routing.module';
import {FeatureComponent} from './feature.component';
import {DashboardComponent} from '../component/dashboard/dashboard.component';
import {PendingLoanComponent} from '../component/dashboard/pending/pending-loan/pending-loan.component';
import {PendingsLoanComponent} from '../component/dashboard/pending/pendings/pendings-loan.component';
import {DataVisualizationComponent} from '../component/dashboard/data-visualization/data-visualization.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ApprovalRoleHierarchyComponent} from './loan/approval/approval-role-hierarchy.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NepaliCalendarModule} from './nepali-calendar/nepali-calendar.module';
import {MouseScrollDisableDirective} from '../@core/directive/mouse-scroll-disable.directive';
import {CommonAddressComponent} from './common-address/common-address.component';
import {CadDataComponent} from '../component/dashboard/cad-data/cad-data.component';
import {CustomerWisePendingComponent} from '../component/dashboard/customer-wise-pending/customer-wise-pending.component';
import {SafePipe} from './memo/pipe/safe.pipe';
import {ErrorPageComponent} from './error-page/error-page.component';
import {CreditRiskGradingGammaComponent} from './loan-information-template/credit-risk-grading-gamma/credit-risk-grading-gamma.component';
import {MultipleBankingComponent} from './loan-information-template/multiple-banking/multiple-banking.component';
import {InstitutionalCrgGammaComponent} from './loan-information-template/institutional-crg-gamma/institutional-crg-gamma.component';
import {GuarantorAdderComponent} from './loan/component/loan-main-template/guarantor-adder/guarantor-adder.component';
import {LoanModule} from './loan/loan.module';
import {GuarantorDetailComponent} from './loan/component/loan-main-template/guarantor-adder/guarantor-detail/guarantor-detail.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import {UserActivityComponent} from './admin/component/user/user-activity/user-activity.component';
import { CrgComponent } from './crg/crg.component';


@NgModule({
        imports: [
            FeatureRoutingModule,
            ThemeModule,
            NbAccordionModule,
            NgxChartsModule,
            NbSelectModule,
            NbDatepickerModule.forRoot(),
            NgSelectModule,
            DragDropModule,
            NepaliCalendarModule
        ],
        declarations: [
            FeatureComponent,
            DashboardComponent,
            PendingLoanComponent,
            PendingsLoanComponent,
            CadDataComponent,
            DataVisualizationComponent,
            ApprovalRoleHierarchyComponent,
            MouseScrollDisableDirective,
            CommonAddressComponent,
            CustomerWisePendingComponent,
            ErrorPageComponent,
            CreditRiskGradingGammaComponent,
            MultipleBankingComponent,
            InstitutionalCrgGammaComponent,
            GuarantorAdderComponent,
            GuarantorDetailComponent,
            ContactDetailsComponent,
            UserActivityComponent,
            CrgComponent
        ],
    exports: [MouseScrollDisableDirective, CommonAddressComponent, CustomerWisePendingComponent,
        CreditRiskGradingGammaComponent, MultipleBankingComponent,
        InstitutionalCrgGammaComponent, GuarantorAdderComponent, GuarantorDetailComponent, ContactDetailsComponent, CrgComponent
    ],
        providers: [SafePipe],
    entryComponents: [CreditRiskGradingGammaComponent]
    }
)
export class FeatureModule {

}
