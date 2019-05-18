import {NgModule} from '@angular/core';
import {FeatureRoutingModule} from './feature-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {FeatureComponent} from './feature.component';
import {DashboardComponent} from '../component/dashboard/dashboard.component';

@NgModule({
        imports: [
            FeatureRoutingModule,
            ThemeModule
        ],
        declarations: [
            FeatureComponent,
            DashboardComponent
        ],
        providers: []
    }
)
export class FeatureModule {

}
