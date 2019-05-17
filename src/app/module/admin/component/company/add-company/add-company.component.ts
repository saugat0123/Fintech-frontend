import {Component, DoCheck, OnInit} from '@angular/core';

import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Company} from '../../../modal/company';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-company',
    templateUrl: './add-company.component.html',
    styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    company: Company = new Company();

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
        this.company = this.dataService.getCompany();
        if (this.company.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.company, 'v1/company').subscribe(result => {
            this.modalService.dismissAll(AddCompanyComponent);
                if (this.company.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED COMPANY';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED COMPANY';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.company = new Company();
                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/company']));


            }, error => {

            this.modalService.dismissAll(AddCompanyComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/company']));

            }
        );
    }
    onClose() {
        this.activeModal.dismiss(AddCompanyComponent);
    }

}
