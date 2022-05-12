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
  default_table: any;
  constructor(private formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) { }

  ngOnInit() {
    this.default_table = '<table class="table table-sm table-condensed table-bordered table-responsive-md text-center table-sm sb-small"' +
        'style="width:100%; border:1; cellpadding: 1; cellspacing:1;">\n' +
        '<tbody>\n' +
        '<tr>\n' +
        '<td style="width:20px">SN.</td>\n' +
        '<td>Comments</td>\n' +
        '<td>Status</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '<td style="width:20px">&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '<td>&nbsp;</td>\n' +
        '</tr>\n' +
        '</tbody>\n' +
        '</table>\n' +
        '\n' +
        '<p>&nbsp;</p>';
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.commentData)) {
      const commentsForEdit = JSON.parse(this.commentData);
      this.setFormData(commentsForEdit.data);
      if (ObjectUtil.isEmpty(commentsForEdit.data)) {
        this.commentsAccordionFormGroup.get('previousCommentsDetailView').patchValue(this.default_table);
        this.commentsAccordionFormGroup.get('auditorCommentsDetailView').patchValue(this.default_table);
        this.commentsAccordionFormGroup.get('nrbCommentsDetailView').patchValue(this.default_table);
      }
    }
  }

  buildForm() {
  this.commentsAccordionFormGroup = this. formBuilder.group({
    previousComments: [undefined],
    auditorComments: [undefined],
    securityDetails: [undefined],
    nrbComments: [undefined],
    previousCommentsDetailView: [this.default_table],
    auditorCommentsDetailView: [this.default_table],
    nrbCommentsDetailView: [this.default_table],
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
    this.commentsDataObject.data = JSON.stringify(this.commentsAccordionFormGroup.value);
    this.commentsDataEmitter.emit(this.commentsDataObject);
  }



}
