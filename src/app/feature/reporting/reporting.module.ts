import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportingRoutingModule} from './reporting-routing.module';
import {ReportDashboardComponent} from './component/report-dashboard/report-dashboard.component';
import {ThemeModule} from '../../@theme/theme.module';
import {NrbReportComponent} from './component/nrb-report/nrb-report.component';
import {NrbReportFormComponent} from './component/nrb-report-form/nrb-report-form.component';


@NgModule({
  declarations: [ReportDashboardComponent, NrbReportComponent, NrbReportFormComponent],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    ThemeModule
  ],
  entryComponents: [
    NrbReportFormComponent
  ]
})
export class ReportingModule {
}
