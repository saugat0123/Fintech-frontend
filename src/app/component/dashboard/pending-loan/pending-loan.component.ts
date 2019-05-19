import {Component, OnInit} from '@angular/core';
import {LoanConfig} from '../../../module/admin/modal/loan-config';
import {CommonDataService} from '../../../shared-service/baseservice/common-dataService';
import {DmsLoanFile} from '../../../module/admin/modal/dms-loan-file';
import {CommonService} from '../../../shared-service/baseservice/common-baseservice';
import {User} from '../../../module/admin/modal/user';
import {Router} from '@angular/router';

@Component({
    selector: 'app-pending-loan',
    templateUrl: './pending-loan.component.html',
    styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit {
    // loanTypes: LoanConfig[] = [];
    dmsLoanFiles: Array<DmsLoanFile>;
    loanType: LoanConfig = new LoanConfig();
    user: User = new User();
    count = 0;

    constructor(private dataService: CommonDataService,
                private commonDataService: CommonService,
                private router: Router) {
    }

    ngOnInit() {
        this.commonDataService.getByStage('v1/dmsLoanFile/getLoan', 'UNDER_REVIEW').subscribe(
            (response: any) => {
                console.log(response.detail);
                this.dmsLoanFiles = response.detail;
                this.dmsLoanFiles.forEach((dmsLoanFile => {
                    this.count++;
                }));
            });
        this.user = this.dataService.getUser();
        console.log(this.user);
    }

    onClick(id) {
        console.log('asd');
        this.router.navigate(['/home/loan/summary', id]);
    }
}
