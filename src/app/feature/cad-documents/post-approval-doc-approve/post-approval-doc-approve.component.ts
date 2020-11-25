import {Component, Input, OnInit} from '@angular/core';
import {ToastService} from '../../../@core/utils';
import {CustomerOfferLetter} from '../../loan/model/customer-offer-letter';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerOfferLetterService} from '../../loan/service/customer-offer-letter.service';
import {Alert, AlertType} from '../../../@theme/model/Alert';

@Component({
    selector: 'app-post-approval-doc-approve',
    templateUrl: './post-approval-doc-approve.component.html',
    styleUrls: ['./post-approval-doc-approve.component.scss']
})
export class PostApprovalDocApproveComponent implements OnInit {

    @Input() customerOfferLetter: CustomerOfferLetter;
    approveForm: FormGroup;
    cadDocumentIDs: number[] = [];
    disableButton = true;

    constructor(private toastService: ToastService,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private service: CustomerOfferLetterService) {
    }

    ngOnInit() {
        this.buildForm();
    }

    onClose() {
        this.modalService.dismissAll();
    }

    buildForm() {
        this.approveForm = this.formBuilder.group(
            {
                cadDocumentIDs: [undefined],
            });
    }

    updateCadDocumentIDsList(id: number, checked: boolean) {
        if (this.cadDocumentIDs.includes(id) && !checked) {
            const index = this.cadDocumentIDs.findIndex((d) => d === id);
            this.cadDocumentIDs.splice(index, 1);
        } else if (!this.cadDocumentIDs.includes(id) && checked) {
            this.cadDocumentIDs.push(id);
        }
        if (this.cadDocumentIDs.length < 1) {
            this.disableButton = true;
        } else {
            this.disableButton = false;
        }
    }

    onSubmit() {
        this.disableButton = true;
        if (this.cadDocumentIDs.length < 1) {
            return;
        }
        this.onClose();
        this.service.postOfferLetterPartialDocument(this.cadDocumentIDs).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, res.detail));

        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

}
