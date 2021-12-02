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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.reviewData)) {
      this.reviewDateData = this.reviewData;
      this.dataForEdit = JSON.parse(this.reviewData.data);
      this.checked = this.dataForEdit.checked;
    }
    this.buildForm(this.dataForEdit);
    console.log('dataForEdit', this.dataForEdit);
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

  submitForm() {
    this.reviewDateData.data = JSON.stringify(this.reviewDate.value);
    this.reviewDateDataEmitter.emit(this.reviewDateData);
  }

}
