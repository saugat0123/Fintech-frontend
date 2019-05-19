import {Component, DoCheck, OnInit} from '@angular/core';

import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Company} from '../../../modal/company';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


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
        private modalService: NgbModal,
        private toastService: ToastService
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
        console.log(this.company);
        this.commonService.saveOrEdit(this.company, 'v1/company').subscribe(result => {
                this.modalService.dismissAll(AddCompanyComponent);

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Company Information'));

                this.company = new Company();

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/company']));
            }, error => {

                console.log(error);

                this.modalService.dismissAll(AddCompanyComponent);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Company Information'));

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/company']));
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(AddCompanyComponent);
    }

}
