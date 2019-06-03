import {NgModule} from '@angular/core';
import {FeatureRoutingModule} from './feature-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {FeatureComponent} from './feature.component';
import {DashboardComponent} from '../component/dashboard/dashboard.component';
import {PendingLoanComponent} from '../component/dashboard/pending/pending-loan/pending-loan.component';
import {PendingsLoanComponent} from '../component/dashboard/pending/pendings/pendings-loan.component';
import {NbAccordionModule} from '@nebular/theme';

@NgModule({
        imports: [
            FeatureRoutingModule,
            ThemeModule,
            NbAccordionModule,
        ],
        declarations: [
            FeatureComponent,
            DashboardComponent,
            PendingLoanComponent,
            PendingsLoanComponent,
        ],
        providers: []
    }
)
export class FeatureModule {

}
