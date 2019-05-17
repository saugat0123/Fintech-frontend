import {NgModule} from '@angular/core';
import {ModuleRoutingModule} from './module-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {ModuleComponent} from './module.component';
import {DashboardComponent} from '../component/dashboard/dashboard.component';

@NgModule({
    imports: [
        ModuleRoutingModule,
        ThemeModule
    ],
        declarations: [
            ModuleComponent,
            DashboardComponent
        ]
    }
)
export class ModuleModule {

}
