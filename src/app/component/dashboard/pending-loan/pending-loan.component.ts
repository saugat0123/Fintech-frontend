import {Component, OnInit} from '@angular/core';
import {LoanConfig} from '../../../module/admin/modal/loan-config';
import {CommonDataService} from '../../../shared-service/baseservice/common-dataService';
import {DmsLoanFile} from '../../../module/admin/modal/dms-loan-file';
import {CommonService} from '../../../shared-service/baseservice/common-baseservice';

@Component({
    selector: 'app-pending-loan',
    templateUrl: './pending-loan.component.html',
    styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit {
    loanConfig: LoanConfig = new LoanConfig();
    dmsLoanFiles: DmsLoanFile[] = [];

    constructor(private dataService: CommonDataService,
                private commonDataService: CommonService) {
    }
    ngOnInit() {
        this.commonDataService.getByAll('v1/dmsLoanFile/getAll').subscribe(
            (response: any) => {
                console.log(response.detail);
                this.dmsLoanFiles.push(response.detail);
                this.loanConfig = response.detail.loanType;
            }
        );
    }
}
