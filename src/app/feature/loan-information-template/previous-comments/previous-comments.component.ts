import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Comments} from './model/comments';

@Component({
  selector: 'app-previous-comments',
  templateUrl: './previous-comments.component.html',
  styleUrls: ['./previous-comments.component.scss']
})
export class PreviousCommentsComponent implements OnInit {
  form: FormGroup;
  @Output() previousCommentEmitter = new EventEmitter();
  @Input() commentsDataResponse: Comments;
  @Input() data;
  commentsDataObject = new Comments();
  submitted = false;
  customerInfo: CustomerInfoData;
  constructor(private formBuilder: FormBuilder,
              private el: ElementRef) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.data)) {
      const formData = JSON.parse(this.data);
      this.form.patchValue(formData);
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      previousComments: [undefined],
      auditorComments: [undefined],
    });
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        'form .ng-invalid'
    );
  }
    onSubmit() {
      this.submitted = true;
      if (this.form.invalid) {
        this.scrollToFirstInvalidControl();
        return;
      }
      if (!ObjectUtil.isEmpty(this.commentsDataResponse)) {
        this.commentsDataObject = this.commentsDataResponse;
      }
      this.commentsDataObject.data = JSON.stringify(this.form.value);
      this.previousCommentEmitter.emit(this.commentsDataObject.data);
    }
}

