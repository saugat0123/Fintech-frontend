import {NgModule} from '@angular/core';
import {NbAccordionModule, NbDatepickerModule, NbSelectModule} from '@nebular/theme';
import {ThemeModule} from '../@theme/theme.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import {ChartModule} from './../chart/chart.module';
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


@NgModule({
    imports: [
        FeatureRoutingModule,
        ThemeModule,
        NbAccordionModule,
        NgxChartsModule,
        NbSelectModule,
        NbDatepickerModule.forRoot(),
        ChartModule,
        NgSelectModule,
        DragDropModule,
        NepaliCalendarModule
    ],
        declarations: [
            FeatureComponent,
            DashboardComponent,
            PendingLoanComponent,
            PendingsLoanComponent,
            DataVisualizationComponent,
            ApprovalRoleHierarchyComponent
        ],
        exports: [],
        providers: []
    }
)
export class FeatureModule {

}
