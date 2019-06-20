import {Component, Input, OnInit} from '@angular/core';
import {SubmissionDocument} from '../../../modal/submission-document';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../../../../@core/utils';

@Component({
    selector: 'app-eligibility-document-view',
    templateUrl: './eligibility-document-view.component.html',
    styleUrls: ['./eligibility-document-view.component.scss']
})
export class EligibilityDocumentViewComponent implements OnInit {
    @Input()
    model: SubmissionDocument;
    restUrl = ApiConfig.URL;

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

}
