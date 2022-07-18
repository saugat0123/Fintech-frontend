import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ReviewDate} from '../../loan/model/reviewDate';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-review-date',
  templateUrl: './review-date.component.html',
  styleUrls: ['./review-date.component.scss']
})
export class ReviewDateComponent implements OnInit {

  @Input() fromProfile: boolean;
  @Input() reviewData: ReviewDate;
  calendarType = 'AD';
  @Output() reviewDateDataEmitter = new EventEmitter();
  reviewDate: FormGroup;
  spinner = false;
  checked = false;
  reviewDateData: ReviewDate = new ReviewDate();
  dataForEdit;
  nextReviewChecked = false;
  lastReviewChecked = false;
  tempFirstDate;
  tempSecondDate;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.reviewData)) {
      this.reviewDateData = this.reviewData;
      this.dataForEdit = JSON.parse(this.reviewData.data);
      this.checked = this.dataForEdit.checked;
      this.nextReviewChecked = this.dataForEdit.nextReviewDateChecked;
      this.lastReviewChecked = this.dataForEdit.lastReviewDateChecked;
    }
    this.buildForm(this.dataForEdit);
    this.reviewDate.get('lastReviewDate')
        .patchValue(this.dataForEdit ? this.dataForEdit.lastReviewDate :  '');
    this.reviewDate.get('nextReviewDate')
        .patchValue(this.dataForEdit ? this.dataForEdit.nextReviewDate : '');
  }

  buildForm(data) {
    this.reviewDate = this.formBuilder.group({
      lastReviewDate: [ObjectUtil.isEmpty(data) ? undefined :
          ObjectUtil.isEmpty(data.lastReviewDate) ? undefined :
              new Date(data.lastReviewDate)],
      nextReviewDate: [ObjectUtil.isEmpty(data) ? undefined :
          ObjectUtil.isEmpty(data.nextReviewDate) ? undefined :
              new Date(data.nextReviewDate)],
      checked: [ObjectUtil.isEmpty(data) ? undefined :
          ObjectUtil.setUndefinedIfNull(data.checked)],
      nextReviewDateChecked: [ObjectUtil.isEmpty(data) ? undefined :
          ObjectUtil.setUndefinedIfNull(data.nextReviewDateChecked)],
      lastReviewDateChecked: [ObjectUtil.isEmpty(data) ? undefined :
          ObjectUtil.setUndefinedIfNull(data.lastReviewDateChecked)],
    });
  }

  checkChecked(event) {
    if (event) {
      this.checked = true;
      this.reviewDate.get('lastReviewDate').setValue(null);
      this.reviewDate.get('nextReviewDate').setValue(null);
    } else {
      this.checked = false;
    }
  }

  checkControlChanged(event, control) {
    if (event) {
      if (control === 'lastReviewDateChecked') {
        this.tempFirstDate = this.reviewDate.get('lastReviewDate').value;
        this.lastReviewChecked = true;
        this.reviewDate.get('lastReviewDate').setValue(null);
      } else if (control === 'nextReviewDateChecked') {
        this.tempSecondDate = this.reviewDate.get('nextReviewDate').value;
        this.nextReviewChecked = true;
        this.reviewDate.get('nextReviewDate').setValue(null);
      } else {
        this.lastReviewChecked = false;
        this.nextReviewChecked = false;
      }
    } else {
      if (control === 'lastReviewDateChecked') {
        this.lastReviewChecked = false;
        this.reviewDate.get('lastReviewDate').setValue(this.tempFirstDate);
      }
      if (control === 'nextReviewDateChecked') {
        this.nextReviewChecked = false;
        this.reviewDate.get('nextReviewDate').setValue(this.tempSecondDate);
      }
    }
  }

  submitForm() {
    this.reviewDateData.data = JSON.stringify(this.reviewDate.value);
    this.reviewDateDataEmitter.emit(this.reviewDateData);
  }
}
