import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerInfoData} from '../../../../../loan/model/customerInfoData';


@Component({
  selector: 'app-review-date',
  templateUrl: './review-date.component.html',
  styleUrls: ['./review-date.component.scss']
})
export class ReviewDateComponent implements OnInit {
  @Input() formValue: CustomerInfoData;
  @Input() customerInfo: any;
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
    if (!ObjectUtil.isEmpty(this.formValue.customerJsonData)) {
      this.form.patchValue(JSON.parse(this.formValue.customerJsonData));
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
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.submitData = this.customerInfo;
    }
    this.submitData = JSON.stringify(this.form.value);
    this.overlay.hide();
    this.reviewDataEmitter.emit(this.submitData);
  }
}
