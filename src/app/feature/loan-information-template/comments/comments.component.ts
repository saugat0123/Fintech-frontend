import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comments} from '../../admin/modal/comments';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
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
    @Input() view;
    commentsDataObject = new Comments();
    commentsAccordionFormGroup: FormGroup;
    submitted = false;
    comments;
    auditor;
    data;
    config = Editor.CK_CONFIG;
    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.commentData)) {
            const commentsForEdit = JSON.parse(this.commentData);
            this.setFormData(commentsForEdit.data);
            this.data = JSON.parse(commentsForEdit.data);
        }

    }

    buildForm() {
        this.commentsAccordionFormGroup = this.formBuilder.group({
            // previousComments: [undefined],
            // auditorComments: [undefined],
            nrbFiscalYear: [undefined],
            nrbCommentDetails: [undefined],
            nrbCorrectiveAction: [undefined],
            nrbFiscalYearTwo: [undefined],
            nrbCommentDetailsTwo: [undefined],
            nrbCorrectiveActionTwo: [undefined],
            externalFiscalYear: [undefined],
            externalCommentDetails: [undefined],
            externalCorrectiveAction: [undefined],
            externalFiscalYearTwo: [undefined],
            externalCommentDetailsTwo: [undefined],
            externalCorrectiveActionTwo: [undefined],
            internalFiscalYear: [undefined],
            internalCommentDetails: [undefined],
            internalCorrectiveAction: [undefined],
            internalFiscalYearTwo: [undefined],
            internalCommentDetailsTwo: [undefined],
            internalCorrectiveActionTwo: [undefined],
            securityDetails: [undefined],
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
