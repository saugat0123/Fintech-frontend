import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Document} from '../../../modal/document';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-document',
    templateUrl: './add-document.component.html',
    styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    document: Document;

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
    ) {
    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        this.document = this.dataService.getDocument();
        if (this.document.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.commonService.saveOrEdit(this.document, 'v1/document').subscribe(result => {

                this.modalService.dismissAll(AddDocumentComponent);
                if (this.document.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED DOCUMENT';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED DOCUMENT';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.document = new Document();
                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/document']));


            }, error => {

                this.modalService.dismissAll(AddDocumentComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/document']));

            }
        );
    }

    onClose() {
        this.activeModal.dismiss(AddDocumentComponent);
    }

}

