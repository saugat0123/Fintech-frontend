import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../shared-service/baseservice/common-dataService';
import {CommonPageService} from '../../shared-service/baseservice/common-pagination-service';

declare var $;

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
                private dataService: CommonDataService) {
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
        });
    }

    updateStatus(data: any) {

        this.commonService.saveOrEdit(this.data, this.currentApi).subscribe(result => {

                this.globalMsg = 'SUCCESSFULLY UPDATED STATUS';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.dataService.alertmsg();

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(e => {
                    if (e) {
                        this.router.navigate([this.currentUrl]);

                    }
                });


            }, error => {
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');
                this.dataService.alertmsg();

            }
        );

    }

}
