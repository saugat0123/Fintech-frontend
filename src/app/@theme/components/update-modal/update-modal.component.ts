import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonPageService} from '../../../@core/service/baseservice/common-pagination-service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../model/Alert';

@Component({
    selector: 'app-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrls: ['./update-modal.component.css']
})
export class UpdateModalComponent implements OnInit, DoCheck {

    @Input()
    data: any = {};

    @Input()
    service: any;

    currentApi: any;
    globalMsg: any;
    currentUrl: any;

    constructor(
        private router: Router,
        private commonPageService: CommonPageService,
        private modalService: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        this.currentApi = this.commonPageService.getCurrentApi();
        this.currentUrl = this.router.url;
    }

    updateStatus() {
        this.service.save(this.data).subscribe(() => {
            this.globalMsg = 'SUCCESSFULLY UPDATED STATUS';
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED STATUS'));
            this.modalService.close();
            }, error => {
            this.modalService.dismiss();
                this.globalMsg = error.error.message;
            }
        );
    }

    closeModal() {
        this.modalService.dismiss();
    }
}
