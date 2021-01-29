import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportingInfo} from '../../model/reporting-info';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ReportingInfoLevel} from '../../model/reporting-info-level';
import {Status} from '../../../../@core/Status';
import {ReportingInfoService} from '../../service/reporting-info.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
  selector: 'app-report-info-level-form',
  templateUrl: './report-info-level-form.component.html',
  styleUrls: ['./report-info-level-form.component.scss']
})
export class ReportInfoLevelFormComponent implements OnInit {

  @Input() reportingInfo: ReportingInfo;
  public reportForm: FormGroup;
  @Output() updateReport = new EventEmitter<boolean>(true);

  constructor(
      private formBuilder: FormBuilder,
      private reportingInfoService: ReportingInfoService,
      private toastService: ToastService,
  ) {
  }

  get reportingInfoLevels() {
    return this.reportForm.get('reportingInfoLevels') as FormArray;
  }

  ngOnInit() {
    this.buildReportForm();
  }

  public onSubmit(): void {
    const reportingInfo = this.reportForm.value as ReportingInfo;
    this.reportingInfoService.save(reportingInfo).subscribe(() => {
      if (this.reportingInfo.id == null) {
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved reporting info'));
        this.updateReport.emit(true);
      } else {
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Edited reporting info'));
        this.updateReport.emit(true);
      }
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save reporting info'));
    });
  }

  public addFormGroup(data: ReportingInfoLevel | null, formArray: FormArray, indexAt: number = -1): void {
    data = data ? data : new ReportingInfoLevel();
    const formGroup = this.formBuilder.group({
      id: [ObjectUtil.setUndefinedIfNull(data.id)],
      version: [ObjectUtil.setUndefinedIfNull(data.version)],
      code: [
        ObjectUtil.setUndefinedIfNull(data.code),
        Validators.required
      ],
      description: [
        ObjectUtil.setUndefinedIfNull(data.description),
        Validators.required
      ],
      status: [
        ObjectUtil.setInputOrElseNext(data.status, Status.ACTIVE),
        Validators.required
      ],
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

  public countPrefix(prefix: string): number {
    return (prefix.match(/reportingInfoLevels/g) || []).length;
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
