import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Document} from '../../../modal/document';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../../../../@core/utils';


@Component({
    selector: 'app-add-document',
    templateUrl: './add-document.component.html'
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

                if (this.document.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED DOCUMENT';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED DOCUMENT';
                }

                this.document = new Document();

                this.activeModal.dismiss(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);

                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

}

