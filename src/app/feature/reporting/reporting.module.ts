import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportingRoutingModule} from './reporting-routing.module';
import {ReportDashboardComponent} from './component/report-dashboard/report-dashboard.component';
import {ThemeModule} from '../../@theme/theme.module';
import {ReportInfoComponent} from './component/report-info/report-info.component';
import {ReportInfoFormComponent} from './component/report-info-form/report-info-form.component';
import {ReportInfoLevelFormComponent} from './component/report-info-level-form/report-info-level-form.component';

const COMPONENTS = [
  ReportDashboardComponent,
  ReportInfoComponent,
  ReportInfoFormComponent,
  ReportInfoLevelFormComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    ThemeModule
  ],
  entryComponents: [
    ReportInfoFormComponent
  ]
})
export class ReportingModule {
}
