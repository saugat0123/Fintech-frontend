import {Component, Input, OnInit} from '@angular/core';
import {ToastService} from '../../../@core/utils';
import {CustomerOfferLetter} from '../../loan/model/customer-offer-letter';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-post-approval-doc-approve',
    templateUrl: './post-approval-doc-approve.component.html',
    styleUrls: ['./post-approval-doc-approve.component.scss']
})
export class PostApprovalDocApproveComponent implements OnInit {

    @Input() customerOfferLetter: CustomerOfferLetter;
    approveForm: FormGroup;
    cadDocumentIDs: number[] = [];
    disableButton = false;
    constructor(private toastService: ToastService,
                private modalService: NgbModal,
                private formBuilder: FormBuilder) {
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
    }

    onSubmit() {
        this.disableButton = true;
        if (this.cadDocumentIDs.length < 1) {
            return;
        }
        console.log(this.cadDocumentIDs);
    }

}
