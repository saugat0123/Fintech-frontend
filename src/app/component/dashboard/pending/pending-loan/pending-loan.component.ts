import {Component, DoCheck, OnInit} from '@angular/core';
import {LoanConfig} from '../../../../feature/admin/modal/loan-config';
import {DmsLoanFile} from '../../../../feature/admin/modal/dms-loan-file';
import {Router} from '@angular/router';
import {User} from '../../../../feature/admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {DmsLoanService} from '../../../../feature/loan/component/loan-main-template/dms-loan-file/dms-loan-service';


@Component({
    selector: 'app-pending-loan',
    templateUrl: './pending-loan.component.html',
    styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit, DoCheck {
    dmsLoanFiles: Array<DmsLoanFile> = new Array<DmsLoanFile>();
    loanType: LoanConfig = new LoanConfig();
    user: User = new User();
    count = 0;


    constructor(private userService: UserService,
                private router: Router,
                private dmsLoanService: DmsLoanService
    ) {
    }

    ngOnInit() {
        this.dmsLoanService.getDocumentByStatus('PENDING').subscribe(
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

    }

    onClick(id) {
        this.router.navigate(['/home/loan/summary', id]);
    }

    ngDoCheck(): void {
        if (this.dmsLoanFiles.length > 5) {
            this.dmsLoanFiles.pop();
        }
    }
}
