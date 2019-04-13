import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {Branch} from '../../../modal/branch';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

declare var $;

@Component({
    selector: 'app-add-model',
    templateUrl: './add-model.component.html',
    styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    branch: Branch = new Branch();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        this.branch = this.dataService.getBranch();
        if (this.branch.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }
    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.branch, 'v1/branch').subscribe(result => {
            this.modalService.dismissAll(AddModelComponent);
                if (this.branch.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED BRANCH';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED BRANCH';
                }
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.branch = new Branch();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/branch']));
                this.dataService.alertmsg();
            }, error => {
            this.modalService.dismissAll(AddModelComponent);
                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/branch']));
                this.dataService.alertmsg();
            }
        );
    }
}
