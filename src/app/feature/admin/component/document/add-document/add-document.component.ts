import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {Document} from '../../../modal/document';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-add-document',
    templateUrl: './add-document.component.html'
})
export class AddDocumentComponent implements OnInit, DoCheck {

    @Input()
    model: Document;

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;

    constructor(
        private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.commonService.saveOrEdit(this.model, 'v1/document').subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Document!'));

                this.model = new Document();

                this.activeModal.close(ModalResponse.SUCCESS);

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

