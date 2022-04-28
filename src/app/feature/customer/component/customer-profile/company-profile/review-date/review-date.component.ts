import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CompanyInfoService} from '../../../../../admin/service/company-info.service';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-review-date',
  templateUrl: './review-date.component.html',
  styleUrls: ['./review-date.component.scss']
})
export class ReviewDateComponent implements OnInit {
  @Input() formValue;
  @Input() companyInfo;
  form: FormGroup;
  submitted = false;
  spinner = false;
  submitData;
  @Output() reviewDataEmitter = new EventEmitter();

  constructor(
      private formBuilder: FormBuilder,
      private overlay: NgxSpinnerService
  ) { }

  get formControls() {
    return this.form.controls;
  }
  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.form.patchValue(JSON.parse(this.companyInfo));
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      lastReviewDate: [undefined],
      currentExtendedDate: [undefined],
      scheduledReviewDate: [undefined],
      nextReviewDate: [undefined]
    });
  }
  onSubmit() {
    this.overlay.show();
    this.submitted = true;
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.submitData = this.companyInfo;
    }
    this.submitData = JSON.stringify(this.form.value);
    this.overlay.hide();
    this.reviewDataEmitter.emit(this.submitData);
  }
}
