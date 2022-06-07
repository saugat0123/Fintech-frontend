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
import { VideoKycComponent } from './video-kyc/video-kyc.component';
import { NewtWorthComponent } from './newt-worth/newt-worth.component';
import {MemoDetailsComponent} from '../component/dashboard/memo-details/memo-details.component';
import {GuarantorAdderComponent} from './loan/component/loan-main-template/guarantor-adder/guarantor-adder.component';
import {GuarantorDetailComponent} from './loan/component/loan-main-template/guarantor-adder/guarantor-detail/guarantor-detail.component';


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
          MemoDetailsComponent,
        CadDataComponent,
        DataVisualizationComponent,
        ApprovalRoleHierarchyComponent,
        MouseScrollDisableDirective,
        CommonAddressComponent,
        CustomerWisePendingComponent,
        ErrorPageComponent,
          GuarantorAdderComponent,
          GuarantorDetailComponent

      ],
    // tslint:disable-next-line:max-line-length
    exports: [MouseScrollDisableDirective, CommonAddressComponent, CustomerWisePendingComponent, GuarantorAdderComponent,
        GuarantorDetailComponent],
      providers: [SafePipe]
    }
)
export class FeatureModule {

}
