import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ReportingInfoLevel} from '../../../../../@core/model/reporting-info-level';
import {ReportingInfo} from '../../../../../@core/model/reporting-info';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ReportingInfoService} from '../../../../../@core/service/reporting-info.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../@core/utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NbAccordionItemComponent} from '@nebular/theme';

@Component({
  selector: 'app-reporting-info-tagging',
  templateUrl: './reporting-info-tagging.component.html',
  styleUrls: ['./reporting-info-tagging.component.scss']
})
export class ReportingInfoTaggingComponent implements OnInit {
  @Input() public reportingInfoLevels: Array<ReportingInfoLevel>;
  public finalReportingInfoLevels: Array<ReportingInfoLevel>;
  public reportingInfoList: Array<ReportingInfo> = new Array<ReportingInfo>();
  public isFilterCollapsed = true;
  public filterForm: FormGroup;
  public expandAllLevels = false;
  private search = {
    name: undefined
  };
  private reportingInfoLevelTags = new Set<number>();
  @ViewChild('itemReport', {static: false})
  itemReport: NbAccordionItemComponent;

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
    this.reportingInfoLevels.forEach(v => this.reportingInfoLevelTags.add(v.id));
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

  public onSubmit(): void {
    this.finalReportingInfoLevels = Array.from(this.reportingInfoLevelTags).map(v => {
      const reportingInfoLevel = new ReportingInfoLevel();
      reportingInfoLevel.id = v;
      return reportingInfoLevel;
    });
  }

  /**
   * Updates report tagging.
   * @param $event A checkbox status.
   * @param id `ReportingInfoLevel` id.
   */
  public updateTagging($event: boolean, id: number): void {
    if ($event) {
      this.reportingInfoLevelTags.add(id);
    } else {
      // TODO Remove from parent and all children from SET
    }
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
