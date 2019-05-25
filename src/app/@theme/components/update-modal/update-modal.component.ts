import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../@core/service/baseservice/common-pagination-service';

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

        this.commonService.saveOrEdit(this.data, this.currentApi).subscribe(result => {
                this.modalService.dismissAll(UpdateModalComponent);

                this.globalMsg = 'SUCCESSFULLY UPDATED STATUS';

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
