import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ReviewDate} from '../../loan/model/reviewDate';

@Component({
  selector: 'app-review-date',
  templateUrl: './review-date.component.html',
  styleUrls: ['./review-date.component.scss']
})
export class ReviewDateComponent implements OnInit {

  @Input() fromProfile: boolean;
  calendarType = 'AD';
  @Output() reviewDateDataEmitter = new EventEmitter();
  reviewDate: FormGroup;
  spinner = false;
  checked = false;
  reviewDateData: ReviewDate = new ReviewDate();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.reviewDate = this.formBuilder.group({
      lastReviewDate: [undefined],
      nextReviewDate: [undefined],
      checked: [undefined],
    });
  }

  checkChecked(event) {
    if (event) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }

  submitForm() {
    this.reviewDateData.data = JSON.stringify(this.reviewDate.value);
    this.reviewDateDataEmitter.emit(this.reviewDateData);
  }

}
