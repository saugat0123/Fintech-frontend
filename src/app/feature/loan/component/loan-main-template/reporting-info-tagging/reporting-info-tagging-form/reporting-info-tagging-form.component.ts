import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ReportingInfo} from '../../../../../../@core/model/reporting-info';
import {ReportingInfoLevel} from '../../../../../../@core/model/reporting-info-level';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-reporting-info-tagging-form',
  templateUrl: './reporting-info-tagging-form.component.html',
  styleUrls: ['./reporting-info-tagging-form.component.scss']
})
export class ReportingInfoTaggingFormComponent implements OnInit, OnDestroy {

  @Input() report: ReportingInfo;
  @Input() public savedReportTagsId: Set<number>;
  @Output() public saveChanges = new EventEmitter<boolean>();
  public expandAllLevels = false;
  tagForm: FormGroup;
  private currentReportTagsId = new Set<number>();

  constructor(
      private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.onSubmit();
  }

  public onSubmit(): void {
    // removes current report ID and add currently selected ones.
    this.currentReportTagsId.forEach(v => this.savedReportTagsId.delete(v));
    this.addSelectedIds(this.tagForm.get('reportingInfoLevels') as FormArray);
    this.saveChanges.emit(true);
  }

  private buildForm(): void {
    this.tagForm = this.formBuilder.group({
      reportingInfoLevels: this.formBuilder.array([])
    });

    if (this.report.reportingInfoLevels && this.report.reportingInfoLevels.length > 0) {
      this.report.reportingInfoLevels.forEach(v => this.addFormGroup(v, this.tagForm.get('reportingInfoLevels') as FormArray));
    }
  }

  private addFormGroup(data: ReportingInfoLevel, formArray: FormArray): void {
    if (this.savedReportTagsId.has(data.id)) {
      this.currentReportTagsId.add(data.id); // matched IDs for current report
    }
    const formGroup = this.formBuilder.group({
      id: [data.id],
      label: [data.code + ' ' + data.description],
      checked: [this.savedReportTagsId.has(data.id)],
      reportingInfoLevels: this.formBuilder.array([])
    });
    if (data.reportingInfoLevels && data.reportingInfoLevels.length > 0) {
      data.reportingInfoLevels.forEach(v => this.addFormGroup(v, formGroup.get('reportingInfoLevels') as FormArray));
    }
    formArray.push(formGroup);
  }

  private addSelectedIds(formArray: FormArray): void {
    if (formArray.controls.length > 0) {
      formArray.controls.forEach(control => {
        if (control instanceof FormGroup) {
          if (control.get('checked').value) {
            this.savedReportTagsId.add(Number(control.get('id').value));
          }
          if (control.get('reportingInfoLevels')) {
            this.addSelectedIds(control.get('reportingInfoLevels') as FormArray);
          }
        }
      });
    }
  }
}
