import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReportInfoFormComponent} from '../report-info-form/report-info-form.component';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {ReportingInfo} from '../../../../@core/model/reporting-info';
import {Action} from '../../../../@core/Action';
import {ReportingInfoService} from '../../../../@core/service/reporting-info.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent implements OnInit {
  public reportingInfoList: Array<ReportingInfo> = new Array<ReportingInfo>();
  public isFilterCollapsed = true;
  private filterForm: FormGroup;
  private search = {
    name: undefined
  };

  constructor(
      private dialogService: NgbModal,
      private reportingInfoService: ReportingInfoService,
      private toastService: ToastService,
      private formBuilder: FormBuilder
  ) {
  }

  static loadData(other: ReportInfoComponent) {
    other.reportingInfoService.getAllWithSearch(other.search).subscribe((response: any) => {
      other.reportingInfoList = response.detail;
    }, error => {
      console.error(error);
      other.toastService.show(new Alert(AlertType.ERROR, 'Failed to load reporting info'));
    });
  }

  ngOnInit() {
    ReportInfoComponent.loadData(this);
    this.buildFilterForm();
  }

  public add(report: ReportingInfo) {
    const ref = this.dialogService.open(ReportInfoFormComponent, {size: 'lg', backdrop: 'static'});
    ref.componentInstance.model = report || new ReportingInfo();
    ref.componentInstance.action = report ? Action.UPDATE : Action.ADD;

    ModalUtils.resolve(ref.result, ReportInfoComponent.loadData, this);
  }

  public clear(): void {
    this.buildFilterForm();
    ReportInfoComponent.loadData(this);
  }

  public onSearch(): void {
    this.search.name = ObjectUtil.setUndefinedIfNull(this.filterForm.get('name').value);
    ReportInfoComponent.loadData(this);
  }

  private buildFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      name: [undefined]
    });
  }
}
