import {NgModule} from '@angular/core';
import {FeatureRoutingModule} from './feature-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {FeatureComponent} from './feature.component';
import {DashboardComponent} from '../component/dashboard/dashboard.component';
import {PendingLoanComponent} from '../component/dashboard/pending/pending-loan/pending-loan.component';
import {PendingsLoanComponent} from '../component/dashboard/pending/pendings/pendings-loan.component';
import {NbAccordionModule, NbSelectModule} from '@nebular/theme';
import {DataVisualizationComponent} from '../component/dashboard/data-visualization/data-visualization.component';
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
            DataVisualizationComponent,
        ],
        providers: []
    }
)
export class FeatureModule {

}
