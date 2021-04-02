import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {Comments} from '../../admin/modal/comments';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() commentsDataResponse: Comments;
  @Input() fromProfile;
  @Output() commentsDataEmitter = new EventEmitter();
  commentsDataObject = new Comments();
  commentsAccordionFormGroup: FormGroup;
  commentsForEdit;
  submitted = false;
  constructor(private formBuilder: FormBuilder,
              private el: ElementRef) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.commentsDataResponse)) {
      this.commentsForEdit = JSON.parse(this.commentsDataResponse.data);
      this.commentsAccordionFormGroup.patchValue(this.commentsForEdit);
    }
  }
  buildForm() {
  this.commentsAccordionFormGroup = this. formBuilder.group({
    previousComments:[undefined],
    auditorComments: [undefined],
  });
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        'form .ng-invalid'
    );
    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
    firstInvalidControl.focus();
  }
  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }
  submitForm() {
    console.log('Form value', this.commentsDataObject);
    this.submitted = true;
    if (this.commentsAccordionFormGroup.invalid) {
      this.scrollToFirstInvalidControl();
      return;
    }
    if (!ObjectUtil.isEmpty(this.commentsDataResponse)) {
      this.commentsDataObject = this.commentsDataResponse;
    }
    this.commentsDataObject.data = JSON.stringify(this.commentsAccordionFormGroup.value);
    this.commentsDataEmitter.emit(this.commentsDataObject);
  }



}
