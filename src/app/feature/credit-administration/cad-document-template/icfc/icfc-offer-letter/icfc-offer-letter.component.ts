import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {IcfcOfferLetterConst} from '../icfc-offer-letter-const';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-icfc-offer-letter',
    templateUrl: './icfc-offer-letter.component.html',
    styleUrls: ['./icfc-offer-letter.component.scss']
})
export class IcfcOfferLetterComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    offerLetterConst = IcfcOfferLetterConst;
    onActionChangeSpinner = false;

    constructor(
        private dialogRef: NbDialogRef<IcfcOfferLetterComponent>,
        private modalService: NgbModal,) {
    }

    ngOnInit() {

    }

    onClose() {
        this.dialogRef.close();
    }

    closeDialog() {
        this.modalService.dismissAll();
    }

    changeAction(template) {
        this.modalService.open(template);
    }

    onCloseCreateCustomer() {
        this.closeDialog();
    }
}
