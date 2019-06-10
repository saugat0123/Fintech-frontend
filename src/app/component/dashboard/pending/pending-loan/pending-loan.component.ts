import {Component, DoCheck, OnInit} from '@angular/core';
import {LoanConfig} from '../../../../feature/admin/modal/loan-config';
import {DmsLoanFile} from '../../../../feature/admin/modal/dms-loan-file';
import {Router} from '@angular/router';
import {User} from '../../../../feature/admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {DmsLoanService} from '../../../../feature/loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {LoanDataHolder} from '../../../../feature/loan/model/loanData';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';


@Component({
    selector: 'app-pending-loan',
    templateUrl: './pending-loan.component.html',
    styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit, DoCheck {
    dmsLoanFiles: Array<DmsLoanFile> = new Array<DmsLoanFile>();
    loanType: LoanConfig = new LoanConfig();
    loanDataHolders: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    user: User = new User();
    customerId: number;
    pendingCount: number;
    status = {
        documentStatus: 'PENDING'
    };


    constructor(private userService: UserService,
                private router: Router,
                private dmsLoanService: DmsLoanService,
                private loanFormService: LoanFormService
    ) {
    }

    ngOnInit() {

        this.loanFormService.getCustomerLoanCount().subscribe(
            (response: any) => {
                this.pendingCount = response.detail.pending;
            });

        this.loanFormService.getLoanByStatus(this.status).subscribe(
            (response: any) => {

                this.loanDataHolders = response.detail;
            }
        );

        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );

    }

    onClick(id, customerId) {

        this.router.navigate(['/home/loan/summary'], {queryParams: {loanConfigId: id, customerId: customerId}});
    }

    ngDoCheck(): void {
        if (this.dmsLoanFiles.length > 5) {
            this.dmsLoanFiles.pop();
        }
    }
}
