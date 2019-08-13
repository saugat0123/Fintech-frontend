import {Component, OnInit} from '@angular/core';
import {LoanConfig} from '../../../../feature/admin/modal/loan-config';
import {DmsLoanFile} from '../../../../feature/admin/modal/dms-loan-file';
import {Router} from '@angular/router';
import {User} from '../../../../feature/admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {DmsLoanService} from '../../../../feature/loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {LoanDataHolder} from '../../../../feature/loan/model/loanData';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';
import {RoleType} from '../../../../feature/admin/modal/roleType';


@Component({
    selector: 'app-pending-loan',
    templateUrl: './pending-loan.component.html',
    styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit {
    dmsLoanFiles: Array<DmsLoanFile> = new Array<DmsLoanFile>();
    loanType: LoanConfig = new LoanConfig();
    loanDataHolders: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    user: User = new User();
    customerId: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    closedCount: number;
    status = {
        documentStatus: 'PENDING'
    };
    roleType: RoleType;
    roleTypes = RoleType;

    constructor(private userService: UserService,
                private router: Router,
                private dmsLoanService: DmsLoanService,
                private loanFormService: LoanFormService
    ) {
    }

    ngOnInit() {
        this.roleType = RoleType.value(localStorage.getItem('roleType'));
        this.loanFormService.getStatus().subscribe(
            (response: any) => {
                this.pendingCount = response.detail.pending;
                this.approvedCount = response.detail.Approved;
                this.rejectedCount = response.detail.Rejected;
                this.closedCount = response.detail.Closed;

            }
        );
        /*this.loanFormService.getLoanByStatus(this.status).subscribe(
            (response: any) => {
                this.loanDataHolders = response.detail;
            }
        );*/

        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );

    }
}
