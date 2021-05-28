import {Component, Input, OnInit} from '@angular/core';
import {ReportingInfo} from '../../model/reporting-info';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Action} from '../../../../@core/Action';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ReportingInfoService} from '../../service/reporting-info.service';
import {ModalResponse, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Status} from '../../../../@core/Status';

@Component({
  selector: 'app-report-info-form',
  templateUrl: './report-info-form.component.html',
  styleUrls: ['./report-info-form.component.scss']
})
export class ReportInfoFormComponent implements OnInit {
  @Input() reportingInfoType;
  @Input() model: ReportingInfo;
  @Input() action: Action;

  spinner = false;
  form: FormGroup;
  submitted = false;

  constructor(
      public activeModal: NgbActiveModal,
      private formBuilder: FormBuilder,
      private reportingInfoService: ReportingInfoService,
      private toastService: ToastService
  ) {
  }

  get formControls() {
    return this.form.controls;
  }

  ngOnInit() {
    this.buildForm();
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.spinner = true;
    this.model = this.form.value as ReportingInfo;
    this.model.reportingInfoType = this.reportingInfoType;
    this.reportingInfoService.initialSave(this.model).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved report!'));
      this.model = new ReportingInfo();
      this.activeModal.close(ModalResponse.SUCCESS);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save report!'));
      this.activeModal.dismiss(error);
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      id: [ObjectUtil.setUndefinedIfNull(this.model.id)],
      reportingInfoType: [ObjectUtil.setUndefinedIfNull(this.model.reportingInfoType)],
      name: [ObjectUtil.setUndefinedIfNull(this.model.name), [Validators.required]],
      status: [this.action === Action.ADD ? Status.ACTIVE : this.model.status],
      version: [ObjectUtil.setUndefinedIfNull(this.model.version)],
    });
  }

}
