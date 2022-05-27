import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportingRoutingModule} from './reporting-routing.module';
import {ReportDashboardComponent} from './component/report-dashboard/report-dashboard.component';
import {ThemeModule} from '../../@theme/theme.module';
import {ReportInfoComponent} from './component/report-info/report-info.component';
import {ReportInfoFormComponent} from './component/report-info-form/report-info-form.component';
import {ReportInfoLevelFormComponent} from './component/report-info-level-form/report-info-level-form.component';
import {ReportSummaryComponent} from './component/report-summary/report-summary.component';
import {ReportingInfoTaggingFormComponent} from './component/reporting-info-tagging-form/reporting-info-tagging-form.component';
import {ReportingInfoTaggingComponent} from './component/reporting-info-tagging/reporting-info-tagging.component';
import { RetialReportSummaryInfoComponent } from './component/retial-report-summary-info/retial-report-summary-info.component';

const COMPONENTS = [
  ReportDashboardComponent,
  ReportInfoComponent,
  ReportInfoFormComponent,
  ReportInfoLevelFormComponent,
  ReportingInfoTaggingComponent,
  ReportingInfoTaggingFormComponent,
  ReportSummaryComponent
];

@NgModule({
  declarations: [...COMPONENTS, RetialReportSummaryInfoComponent],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    ThemeModule
  ],
  exports: [
    ReportSummaryComponent,
    ReportingInfoTaggingComponent,
    ReportingInfoTaggingFormComponent,
    RetialReportSummaryInfoComponent
  ],
  entryComponents: [
    ReportInfoFormComponent
  ]
})
export class ReportingModule {
}
