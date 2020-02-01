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
import { JamaniBasnekoComponent } from './laon/component/loan-main-nepali-template/jamani-basneko/jamani-basneko.component';


@NgModule({
    imports: [
        FeatureRoutingModule,
        ThemeModule,
        NbAccordionModule,
        NgxChartsModule,
        NbSelectModule,
        NbDatepickerModule.forRoot(),
        ChartModule,
        NgSelectModule
    ],
        declarations: [
            FeatureComponent,
            DashboardComponent,
            PendingLoanComponent,
            PendingsLoanComponent,
            DataVisualizationComponent,
            JamaniBasnekoComponent
        ],
        exports: [],
        providers: []
    }
)
export class FeatureModule {

}
