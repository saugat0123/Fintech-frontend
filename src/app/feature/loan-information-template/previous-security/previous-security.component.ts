import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PreviousSecurity} from '../../admin/modal/previousSecurity';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Comments} from '../../admin/modal/comments';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-previous-security',
    templateUrl: './previous-security.component.html',
    styleUrls: ['./previous-security.component.scss']
})
export class PreviousSecurityComponent implements OnInit {
    @Input() securityDataResponse: PreviousSecurity;
    @Input() securityData: any;
    @Input() fromProfile;
    @Output() securityDataEmitter = new EventEmitter();
    @Input() commentData;
    ckeConfig;
    submitted = false;
    previousSecurityFormGroup: FormGroup;
    securityDataObject = new Comments();
    checked = false;

    constructor(private formBuilder: FormBuilder,
                private overlay: NgxSpinnerService) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.securityData)) {
            const securityForEdit = JSON.parse(this.securityData);
            this.setFormData(securityForEdit.data);
        }
        if (!ObjectUtil.isEmpty(this.commentData)) {
            const commentsForEdit = JSON.parse(this.commentData);
            const comment = JSON.parse(commentsForEdit.data);
        }
    }

    buildForm() {
        this.previousSecurityFormGroup = this.formBuilder.group({
            previousComments: [undefined],
            auditorComments: [undefined],
            securityDetails: [undefined],
        });

    }

    public setFormData(formData): void {
        if (!ObjectUtil.isEmpty(formData)) {
            const parseData = JSON.parse(formData);
            if (!ObjectUtil.isEmpty(parseData.securityDetails)) {
                this.checked = true;
            }
            this.previousSecurityFormGroup.patchValue(parseData);
        }
    }

    submitForm() {
        this.overlay.show();
        this.submitted = true;
        if (!ObjectUtil.isEmpty(this.securityDataResponse)) {
            this.securityDataObject = this.securityDataResponse;
        }
        this.securityDataObject.data = JSON.stringify(this.previousSecurityFormGroup.value);
        this.securityDataEmitter.emit(this.securityDataObject);
    }
}
