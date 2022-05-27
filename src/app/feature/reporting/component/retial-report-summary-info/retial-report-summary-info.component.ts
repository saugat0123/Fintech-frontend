import { Component, OnInit } from '@angular/core';
import {ReportingInfoService} from '../../service/reporting-info.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-retial-report-summary-info',
  templateUrl: './retial-report-summary-info.component.html',
  styleUrls: ['./retial-report-summary-info.component.scss']
})
export class RetialReportSummaryInfoComponent implements OnInit {

  reportingInfoLevel: Array<any> = new Array<any>();
  constructor(private reportingInfoService: ReportingInfoService) {

  }

  ngOnInit() {
this.getReportingInfo();
  }





  getReportingInfo(): void {
    this.reportingInfoService.getAllWithSearch({}).toPromise().then((response: any) => {
      console.log(response, 'RESPONSE');
      if(!ObjectUtil.isEmpty(response.detail)){
        response.detail.forEach(d => {
          this.reportingInfoLevel.push(d);
        });
      }
    })
  }
}
