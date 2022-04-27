import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {ReportingInfoService} from '../../../../../reporting/service/reporting-info.service';
import {ReportingInfo} from '../../../../../reporting/model/reporting-info';
import {ReportingInfoLevel} from '../../../../../reporting/model/reporting-info-level';

@Component({
  selector: 'app-mis-nrb-reporting',
  templateUrl: './mis-nrb-reporting.component.html',
  styleUrls: ['./mis-nrb-reporting.component.scss']
})
export class MisNrbReportingComponent implements OnInit {
  // @Input() loanDataHolder: LoanDataHolder;
  // tempData = [];
  // tempData1 = [];
  @Input() public reportingInfoLevels: Array<ReportingInfoLevel>;
  @Input() public reportingInfoLevelLog: string;
  @Input() public approved: boolean;
  public reportingInfoSummary: Array<ReportingInfo> = new Array<ReportingInfo>();
  private savedReportTagsId: Set<number> = new Set<number>();
  public layout: 'vertical' | 'horizontal' = 'horizontal';
  constructor(
      private reportingInfoService: ReportingInfoService,
  ) { }

  ngOnInit() {
    // if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
    //   if (!ObjectUtil.isEmpty(this.loanDataHolder.reportingInfoLevels)) {
    //     this.tempData = this.loanDataHolder.reportingInfoLevels;
    //   }
    //   if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder)) {
    //     this.tempData1 = this.loanDataHolder.loanHolder.reportingInfoLevels;
    //   }
    // }
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
