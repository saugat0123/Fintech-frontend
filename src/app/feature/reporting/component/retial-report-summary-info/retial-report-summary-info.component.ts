import {Component, Input, OnInit} from '@angular/core';
import {ReportingInfoService} from '../../service/reporting-info.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ReportingInfo} from '../../model/reporting-info';
import {ReportingInfoLevel} from '../../model/reporting-info-level';
import {logoHackernews} from 'ionicons/icons';

@Component({
  selector: 'app-retial-report-summary-info',
  templateUrl: './retial-report-summary-info.component.html',
  styleUrls: ['./retial-report-summary-info.component.scss']
})
export class RetialReportSummaryInfoComponent implements OnInit {
  @Input() public reportingInfoLevels: Array<ReportingInfoLevel>;
  @Input() public reportingInfoLevelLog: string;
  @Input() public approved: boolean;
  public reportingInfoSummary: Array<ReportingInfo> = new Array<ReportingInfo>();
  private savedReportTagsId: Set<number> = new Set<number>();
  public layout: 'vertical' | 'horizontal' = 'horizontal';

  constructor(
      private reportingInfoService: ReportingInfoService,
  ) {
  }

  ngOnInit() {
    if (this.approved) {
      // @ts-ignore
      if (!ObjectUtil.isEmpty(JSON.parse(this.reportingInfoLevelLog))) {
        this.reportingInfoLevels = JSON.parse(this.reportingInfoLevelLog);
      }

    }
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
