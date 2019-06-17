import {NgModule} from '@angular/core';
import {FeatureRoutingModule} from './feature-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {FeatureComponent} from './feature.component';
import {DashboardComponent} from '../component/dashboard/dashboard.component';
import {PendingLoanComponent} from '../component/dashboard/pending/pending-loan/pending-loan.component';
import {PendingsLoanComponent} from '../component/dashboard/pending/pendings/pendings-loan.component';
import {NbAccordionModule, NbSelectModule} from '@nebular/theme';
import {PieChartComponent} from '../component/dashboard/pie-chart/pie-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
@NgModule({
        imports: [
            FeatureRoutingModule,
            ThemeModule,
            NbAccordionModule,
            NgxChartsModule,
            NbSelectModule
        ],
        declarations: [
            FeatureComponent,
            DashboardComponent,
            PendingLoanComponent,
            PendingsLoanComponent,
            PieChartComponent,
        ],
        providers: []
    }
)
export class FeatureModule {

}
