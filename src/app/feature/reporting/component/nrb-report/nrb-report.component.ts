import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NrbReportFormComponent} from '../nrb-report-form/nrb-report-form.component';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {ReportingInfo} from '../../../../@core/model/reporting-info';
import {Action} from '../../../../@core/Action';
import {ReportingInfoService} from '../../../../@core/service/reporting-info.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
  selector: 'app-nrb-report',
  templateUrl: './nrb-report.component.html',
  styleUrls: ['./nrb-report.component.scss']
})
export class NrbReportComponent implements OnInit {
  reportingInfoList: Array<ReportingInfo> = new Array<ReportingInfo>();

  constructor(
      private dialogService: NgbModal,
      private reportingInfoService: ReportingInfoService,
      private toastService: ToastService
  ) {
  }

  static loadData(other: NrbReportComponent) {
    other.reportingInfoService.getAll().subscribe((response: any) => {
      other.reportingInfoList = response.detail;
    }, error => {
      console.error(error);
      other.toastService.show(new Alert(AlertType.ERROR, 'Failed to load reporting info'));
    });
  }

  ngOnInit() {
    NrbReportComponent.loadData(this);
  }

  public add(report: ReportingInfo) {
    const ref = this.dialogService.open(NrbReportFormComponent, {size: 'lg', backdrop: 'static'});
    ref.componentInstance.model = report || new ReportingInfo();
    ref.componentInstance.action = report ? Action.UPDATE : Action.ADD;

    ModalUtils.resolve(ref.result, NrbReportComponent.loadData, this);
  }
}
