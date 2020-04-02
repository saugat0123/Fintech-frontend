import {Component, Input, OnInit} from '@angular/core';
import {ReportingInfoLevel} from '../../../../../@core/model/reporting-info-level';
import {ReportingInfo} from '../../../../../@core/model/reporting-info';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ReportingInfoService} from '../../../../../@core/service/reporting-info.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../@core/utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-reporting-info-tagging',
  templateUrl: './reporting-info-tagging.component.html',
  styleUrls: ['./reporting-info-tagging.component.scss']
})
export class ReportingInfoTaggingComponent implements OnInit {
  @Input() public reportingInfoLevels: Array<ReportingInfoLevel>;
  public reportingInfoList: Array<ReportingInfo> = new Array<ReportingInfo>();
  public isFilterCollapsed = true;
  public filterForm: FormGroup;
  private search = {
    name: undefined
  };

  constructor(
      private reportingInfoService: ReportingInfoService,
      private toastService: ToastService,
      private formBuilder: FormBuilder
  ) {
  }

  static loadData(other: ReportingInfoTaggingComponent) {
    other.getReportingInfo();
  }

  ngOnInit() {
    this.getReportingInfo();
    this.buildFilterForm();
  }

  public onSearch(): void {
    this.search.name = ObjectUtil.setUndefinedIfNull(this.filterForm.get('name').value);
    ReportingInfoTaggingComponent.loadData(this);
  }

  public clear(): void {
    this.isFilterCollapsed = true;
    this.buildFilterForm();
    ReportingInfoTaggingComponent.loadData(this);
  }

  private getReportingInfo(): void {
    this.reportingInfoService.getAllWithSearch(this.search).subscribe((response: any) => {
      this.reportingInfoList = response.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load reporting info'));
    });
  }

  private buildFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      name: [undefined]
    });
  }
}
