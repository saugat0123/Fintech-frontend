import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ReportingInfoLevel} from '../../model/reporting-info-level';
import {ReportingInfo} from '../../model/reporting-info';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ReportingInfoService} from '../../service/reporting-info.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ReportingInfoTaggingFormComponent} from '../reporting-info-tagging-form/reporting-info-tagging-form.component';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-reporting-info-tagging',
  templateUrl: './reporting-info-tagging.component.html',
  styleUrls: ['./reporting-info-tagging.component.scss']
})
export class ReportingInfoTaggingComponent implements OnInit {
  @Input() public reportingInfoLevels: Array<ReportingInfoLevel>;
  @Output() public reportingInfoLevelsEmitter = new EventEmitter();
  @Input() type;
  spinner = false;
  public reportingInfoList: Array<ReportingInfo> = new Array<ReportingInfo>();
  public isFilterCollapsed = true;
  public filterForm: FormGroup;
  private search = {
    name: undefined,
    type: undefined,
  };
  public savedReportTagsId = new Set<number>();
  public finalReportingInfoLevels: Array<ReportingInfoLevel>;
  @ViewChild('reportingInfoTaggingFormComponent', {static: false})
  public taggingComponent: ReportingInfoTaggingFormComponent;

  constructor(
      private reportingInfoService: ReportingInfoService,
      private toastService: ToastService,
      private formBuilder: FormBuilder,
      private overlay: NgxSpinnerService
  ) {
  }

  static loadData(other: ReportingInfoTaggingComponent) {
    other.getReportingInfo();
  }

  ngOnInit() {
    if (this.reportingInfoLevels) {
      this.reportingInfoLevels.forEach(v => this.savedReportTagsId.add(v.id));
    }
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
    this.spinner = true;
    this.search.type = this.type;
    this.reportingInfoService.getAllWithSearch(this.search).subscribe((response: any) => {
      this.reportingInfoList = response.detail;
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load reporting info'));
    });
  }

  private buildFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      name: [undefined],
    });
  }

  public saveChanges($event: boolean) {
    if ($event) {
      this.savedReportTagsId = this.taggingComponent.savedReportTagsId;
    }
  }

  public onSubmit(): void {
    if (this.taggingComponent) {
      this.taggingComponent.onSubmit();
    }
    this.finalReportingInfoLevels = Array.from(this.savedReportTagsId).map(v => {
      const reportingInfoLevel = new ReportingInfoLevel();
      reportingInfoLevel.id = v;
      return reportingInfoLevel;
    });
    this.reportingInfoLevelsEmitter.emit(this.finalReportingInfoLevels);
  }
}
