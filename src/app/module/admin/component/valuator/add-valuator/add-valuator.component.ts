import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Valuator} from '../../../modal/valuator';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

declare var $;

@Component({
    selector: 'app-add-valuator',
    templateUrl: './add-valuator.component.html',
    styleUrls: ['./add-valuator.component.css']
})
export class AddValuatorComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    valuator: Valuator = new Valuator();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private modalService:NgbModal,
        private activeModal:NgbActiveModal
    ) {
    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        this.valuator = this.dataService.getValuator();
        if (this.valuator.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.valuator, 'v1/valuator').subscribe(result => {
            this.modalService.dismissAll(AddValuatorComponent);
                if (this.valuator.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED VALUATOR';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED VALUATOR';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.valuator = new Valuator();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/valuator']));
                this.dataService.alertmsg();


            }, error => {

            this.modalService.dismissAll(AddValuatorComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/valuator']));
                this.dataService.alertmsg();

            }
        );
    }

}
