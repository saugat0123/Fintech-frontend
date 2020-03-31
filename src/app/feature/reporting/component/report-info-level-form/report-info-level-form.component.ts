import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportingInfo} from '../../../../@core/model/reporting-info';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ReportingInfoLevel} from '../../../../@core/model/reporting-info-level';
import {Status} from '../../../../@core/Status';

@Component({
  selector: 'app-report-info-level-form',
  templateUrl: './report-info-level-form.component.html',
  styleUrls: ['./report-info-level-form.component.scss']
})
export class ReportInfoLevelFormComponent implements OnInit {

  @Input() reportingInfo: ReportingInfo;
  private reportForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder
  ) {
  }

  get reportingInfoLevels() {
    return this.reportForm.get('reportingInfoLevels') as FormArray;
  }

  ngOnInit() {
    this.buildReportForm();
  }

  public onSubmit(): void {

  }

  public addFormGroup(data: ReportingInfoLevel | null, formArray: FormArray, indexAt: number = -1): void {
    data = data ? data : new ReportingInfoLevel();
    const formGroup = this.formBuilder.group({
      id: [ObjectUtil.setUndefinedIfNull(data.id)],
      code: [ObjectUtil.setUndefinedIfNull(data.code)],
      description: [ObjectUtil.setUndefinedIfNull(data.description)],
      status: [ObjectUtil.setInputOrElseNext(data.status, Status.ACTIVE)],
      reportingInfoLevels: this.formBuilder.array([]),
    });
    if (data.reportingInfoLevels && data.reportingInfoLevels.length > 0) {
      data.reportingInfoLevels.forEach(v => this.addFormGroup(v, formGroup.get('reportingInfoLevels') as FormArray));
    }
    if (indexAt < 0) {
      formArray.push(formGroup);
    } else {
      formArray.insert(indexAt, formGroup);
    }
  }

  public removeFormGroup(i: number, reportingInfoLevels: FormArray): void {
    reportingInfoLevels.removeAt(i);
  }

  public nestFormGroup(reportingInfoLevels: AbstractControl | FormArray): void {
    this.addFormGroup(null, reportingInfoLevels as FormArray);
  }

  private buildReportForm(): void {
    this.reportForm = this.formBuilder.group({
      id: [
        ObjectUtil.setUndefinedIfNull(this.reportingInfo.id),
        Validators.required
      ],
      name: [
        ObjectUtil.setUndefinedIfNull(this.reportingInfo.name),
        Validators.required
      ],
      status: [
        ObjectUtil.setUndefinedIfNull(this.reportingInfo.status),
        Validators.required
      ],
      version: [
        ObjectUtil.setUndefinedIfNull(this.reportingInfo.version),
        Validators.required
      ],
      reportingInfoLevels: this.formBuilder.array([])
    });

    if (this.reportingInfo.reportingInfoLevels && this.reportingInfo.reportingInfoLevels.length < 1) {
      this.addFormGroup(null, this.reportingInfoLevels as FormArray);
    } else {
      this.reportingInfo.reportingInfoLevels.forEach(v => this.addFormGroup(v, this.reportingInfoLevels as FormArray));
    }
  }

}
