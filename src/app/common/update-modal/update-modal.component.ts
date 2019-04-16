import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../shared-service/baseservice/common-dataService';
import {CommonPageService} from '../../shared-service/baseservice/common-pagination-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrls: ['./update-modal.component.css']
})
export class UpdateModalComponent implements OnInit, DoCheck {
    data: any = {};
    currentApi: any;
    globalMsg: any;
    currentUrl: any;

    constructor(private commonService: CommonService,
                private router: Router,
                private commonPageService: CommonPageService,
                private dataService: CommonDataService,
                private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.data = {
            id: null,
            status: 'INACTIVE'
        };
    }

    ngDoCheck(): void {
        if (this.dataService.getData() == null) {
        } else {
            this.data = this.dataService.getData();
        }

        this.currentApi = this.commonPageService.getCurrentApi();
        this.currentUrl = this.router.url;
    }

    reloadPage() {
        this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
            if (e) {
                this.router.navigate([this.currentUrl]);

            }
            this.modalService.dismissAll(UpdateModalComponent);
            this.dataService.clearData();
        });
    }

    updateStatus(data: any) {

        this.commonService.saveOrEdit(this.data, this.currentApi).subscribe(result => {
            this.modalService.dismissAll(UpdateModalComponent);
            this.dataService.clearData();
                this.globalMsg = 'SUCCESSFULLY UPDATED STATUS';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
                    if (e) {
                        this.router.navigate([this.currentUrl]);

                    }
                });


            }, error => {
            this.modalService.dismissAll(UpdateModalComponent);
                this.dataService.clearData();
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

            }
        );

    }

}
