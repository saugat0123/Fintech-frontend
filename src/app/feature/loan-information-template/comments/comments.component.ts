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
  @Output() commentsDataEmitter = new EventEmitter();
  @Input() commentData: any;
  commentsDataObject = new Comments();
  commentsAccordionFormGroup: FormGroup;
  submitted = false;
  comments;
  auditor;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.commentData)) {
      const commentsForEdit = JSON.parse(this.commentData);
      this.setFormData(commentsForEdit.data);
    }

  }
  buildForm() {
  this.commentsAccordionFormGroup = this. formBuilder.group({
    previousComments: [undefined],
    auditorComments: [undefined],
  });
  }

  public setFormData(formData): void {
    if (!ObjectUtil.isEmpty(formData)) {
      const parseData = JSON.parse(formData);
      this.commentsAccordionFormGroup.patchValue(parseData);
    }
  }

  submitForm() {
    this.submitted = true;
    if (!ObjectUtil.isEmpty(this.commentsDataResponse)) {
      this.commentsDataObject = this.commentsDataResponse;
    }
    this.commentsDataObject.data = JSON.stringify(this.commentsAccordionFormGroup.value);
    this.commentsDataEmitter.emit(this.commentsDataObject);
  }



}
