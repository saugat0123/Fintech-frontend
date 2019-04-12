import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {LoanTemplate} from '../../../modal/template';
import {LoanConfig} from '../../../modal/loan-config';

declare var $;

@Component({
    selector: 'app-add-loan',
    templateUrl: './add-loan.component.html',
    styleUrls: ['./add-loan.component.css']
})
export class AddLoanComponent implements OnInit, DoCheck {

    loanConfig = new LoanConfig();
    task: string;
    globalMsg: string;
    templateList: Array<LoanTemplate>;

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService
    ) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/loanTemplate/getAll').subscribe((response: any) => {
            this.templateList = response.detail;
        });
    }

    ngDoCheck(): void {
        if (this.dataService.getData() == null) {
            this.task = 'Add';
        } else {
            this.loanConfig = this.dataService.getData();
            this.task = 'Add';
        }
    }

    onSubmit() {
        this.commonService.saveOrEdit(this.loanConfig, 'v1/config').subscribe(result => {
                $('.add-loan-config').modal('hide');
                if (this.loanConfig.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED LOAN CONFIGURATION';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED LOAN CONFIGURATION';
                }
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.loanConfig = new LoanConfig();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/config']));
                this.dataService.alertmsg();
            }, error => {

                $('.add-loan-config').modal('hide');

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/config']));
                this.dataService.alertmsg();
            }
        );
    }
}
