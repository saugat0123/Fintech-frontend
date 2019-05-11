import {NgModule} from '@angular/core';
import {PagesRoutingModule} from './pages-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {DashboardComponent} from '../component/dashboard/dashboard.component';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule
    ],
        declarations: [
            PagesComponent,
            DashboardComponent
        ]
    }
)
export class PagesModule {

}
