import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../../@core/service/baseservice/common-baseservice';
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

    currentApi: any;
    globalMsg: any;
    currentUrl: any;

    constructor(private commonService: CommonService,
                private router: Router,
                private commonPageService: CommonPageService,
                private modalService: NgbModal,
                private toastService: ToastService
    ) {
    }

    ngOnInit() {


    }

    ngDoCheck(): void {
        this.currentApi = this.commonPageService.getCurrentApi();
        this.currentUrl = this.router.url;
    }

    reloadPage() {
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
            if (e) {
                this.router.navigate([this.currentUrl]);
            }
            this.modalService.dismissAll(UpdateModalComponent);
        });
    }

    updateStatus(data: any) {
        console.log(this.data.api);
        this.commonService.saveOrEdit(this.data.data, this.data.api).subscribe(result => {
                this.modalService.dismissAll(UpdateModalComponent);

                this.globalMsg = 'SUCCESSFULLY UPDATED STATUS';
                this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED STATUS'));
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
                    if (e) {
                        this.router.navigate([this.currentUrl]);

                    }
                });


            }, error => {
                this.modalService.dismissAll(UpdateModalComponent);

                this.globalMsg = error.error.message;

            }
        );

    }

}
