import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comments} from '../../admin/modal/comments';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';
import {Editor} from '../../../@core/utils/constants/editor';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() commentsDataResponse: Comments;
  @Output() commentsDataEmitter = new EventEmitter();
  @Input() fromProfile;
  @Input() commentData: any;
  commentsDataObject = new Comments();
  commentsAccordionFormGroup: FormGroup;
  submitted = false;
  comments;
  auditor;
  ckeConfig = Editor.CK_CONFIG;
  tempReviewDate;
  constructor(private formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.commentData)) {
      const commentsForEdit = JSON.parse(this.commentData);
      this.setFormData(commentsForEdit.data);
      if (!ObjectUtil.isEmpty(commentsForEdit.reviewDate)) {
        this.tempReviewDate = commentsForEdit.reviewDate;
      }
    }
  }

  buildForm() {
  this.commentsAccordionFormGroup = this. formBuilder.group({
    previousComments: [undefined],
    auditorComments: [undefined],
    securityDetails: [undefined],
    nrbComments: [undefined],
    previousStatus: [undefined],
    auditorStatus: [undefined],
    nrbStatus: [undefined],
  });
  }

  public setFormData(formData): void {
    if (!ObjectUtil.isEmpty(formData)) {
      const parseData = JSON.parse(formData);
      this.commentsAccordionFormGroup.patchValue(parseData);
    }
  }

  submitForm() {
    this.overlay.show();
    this.submitted = true;
    if (!ObjectUtil.isEmpty(this.commentsDataResponse)) {
      this.commentsDataObject = this.commentsDataResponse;
    }
    this.commentsDataObject.reviewDate = this.tempReviewDate;
    this.commentsDataObject.data = JSON.stringify(this.commentsAccordionFormGroup.value);
    this.commentsDataEmitter.emit(this.commentsDataObject);
  }



}
