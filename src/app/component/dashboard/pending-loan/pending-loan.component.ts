import {Component, OnInit} from '@angular/core';
import {LoanConfig} from '../../../feature/admin/modal/loan-config';
import {DmsLoanFile} from '../../../feature/admin/modal/dms-loan-file';
import {CommonService} from '../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {User} from '../../../feature/admin/modal/user';
import {UserService} from '../../../@core/service/user.service';

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


    constructor(private userService: UserService,
                private commonDataService: CommonService,
                private router: Router) {
    }

    ngOnInit() {
        this.commonDataService.getByDocumentStatus('v1/dmsLoanFile/getLoan', 'PENDING').subscribe(
            (response: any) => {
                this.dmsLoanFiles = response.detail;
                this.dmsLoanFiles.forEach((dmsLoanFile => {
                    this.count++;
                }));

            });
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
        console.log(this.user);
    }

    onClick(id) {
        this.router.navigate(['/home/loan/summary', id]);
    }
}
