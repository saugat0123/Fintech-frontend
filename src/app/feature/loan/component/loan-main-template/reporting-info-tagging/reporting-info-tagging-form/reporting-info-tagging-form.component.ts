import {Component, Input, OnInit} from '@angular/core';
import {ReportingInfo} from '../../../../../../@core/model/reporting-info';
import {ReportingInfoLevel} from '../../../../../../@core/model/reporting-info-level';

@Component({
  selector: 'app-reporting-info-tagging-form',
  templateUrl: './reporting-info-tagging-form.component.html',
  styleUrls: ['./reporting-info-tagging-form.component.scss']
})
export class ReportingInfoTaggingFormComponent implements OnInit {
  @Input() public reportingInfoLevels: Array<ReportingInfoLevel>;
  @Input() report: ReportingInfo;
  public expandAllLevels = false;
  private reportingInfoLevelTags = new Set<number>();
  public finalReportingInfoLevels: Array<ReportingInfoLevel>;


  constructor() { }

  ngOnInit() {
    this.reportingInfoLevels.forEach(v => this.reportingInfoLevelTags.add(v.id));
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

  public onSubmit(): void {
    this.finalReportingInfoLevels = Array.from(this.reportingInfoLevelTags).map(v => {
      const reportingInfoLevel = new ReportingInfoLevel();
      reportingInfoLevel.id = v;
      return reportingInfoLevel;
    });
  }

}
