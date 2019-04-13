import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {Nepse} from '../../../modal/nepse';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

declare var $;

@Component({
    selector: 'app-add-nepse',
    templateUrl: './add-nepse.component.html',
    styleUrls: ['./add-nepse.component.css']
})
export class AddNepseComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    nepse: Nepse = new Nepse();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal:NgbActiveModal,
        private modalService:NgbModal

    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        this.nepse = this.dataService.getNepse();
        if (this.nepse.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.nepse, 'v1/nepseCompany').subscribe(result => {
            this.modalService.dismissAll(AddNepseComponent);
                if (this.nepse.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED NEPSE COMPANY';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED NEPSE COMPANY';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.nepse = new Nepse();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/nepse']));
                this.dataService.alertmsg();


            }, error => {

            this.modalService.dismissAll(AddNepseComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/nepse']));
                this.dataService.alertmsg();

            }
        );
    }

    open() {
        this.dataService.setNepse(new Nepse());
        $('.add-bulk-upload').modal('show');
    }

}
