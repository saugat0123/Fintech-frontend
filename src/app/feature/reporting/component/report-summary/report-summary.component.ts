import {Component, Input, OnInit} from '@angular/core';
import {ReportingInfoService} from '../../../../@core/service/reporting-info.service';
import {ReportingInfo} from '../../model/reporting-info';
import {ReportingInfoLevel} from '../../model/reporting-info-level';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent implements OnInit {
  @Input() public reportingInfoLevels: Array<ReportingInfoLevel>;
  public reportingInfoSummary: Array<ReportingInfo> = new Array<ReportingInfo>();
  private savedReportTagsId: Set<number> = new Set<number>();

  constructor(
      private reportingInfoService: ReportingInfoService,
  ) {
  }

  ngOnInit() {
    this.reportingInfoService.getAllWithSearch({}).toPromise().then((response: any) => {
      const reportingInfoList: Array<ReportingInfo> = response.detail;
      this.reportingInfoLevels.forEach(v => this.savedReportTagsId.add(v.id));
      reportingInfoList.forEach(v => {
        const summaryReportingInfo = new ReportingInfo();
        summaryReportingInfo.reportingInfoLevels = new Array<ReportingInfoLevel>();
        this.checkReportingInfoLevels(v.name, v.reportingInfoLevels, summaryReportingInfo);
        if (summaryReportingInfo.reportingInfoLevels.length > 0) {
          this.reportingInfoSummary.push(summaryReportingInfo);
        }
      });
    });
  }

  private checkReportingInfoLevels(reportName: string, reportingInfoLevels: Array<ReportingInfoLevel>,
                                   summaryReportingInfo: ReportingInfo) {
    if (reportingInfoLevels && reportingInfoLevels.length > 0) {
      reportingInfoLevels.forEach(v => {
        if (this.savedReportTagsId.has(v.id)) {
          summaryReportingInfo.name = reportName;
          summaryReportingInfo.reportingInfoLevels.push(v);
        }
        this.checkReportingInfoLevels(reportName, v.reportingInfoLevels, summaryReportingInfo);
      });
    }
  }

}
