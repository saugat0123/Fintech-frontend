import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../@core/service/baseservice/common-baseservice';
import {DmsLoanFile} from '../../../feature/admin/modal/dms-loan-file';
import {User} from '../../../feature/admin/modal/user';
import {UserService} from '../../../@core/service/user.service';
import {LoanConfig} from '../../../feature/admin/modal/loan-config';

@Component({
    selector: 'app-pendings',
    templateUrl: './pendings.component.html',
    styleUrls: ['./pendings.component.css']
})
export class PendingsComponent implements OnInit {
    dmsLoanFiles: Array<DmsLoanFile>;
    user: User = new User();
    loanTypes: LoanConfig[] = [];
    constructor(private commonDataService: CommonService,
                private userService: UserService) {
    }

    ngOnInit() {
        this.commonDataService.getByStage('v1/dmsLoanFile/getLoan', 'UNDER_REVIEW').subscribe(
            (response: any) => {
                console.log(response.detail);
                this.dmsLoanFiles = response.detail;
                this.dmsLoanFiles.forEach((dmsLoanFile => {
                    this.loanTypes.push(dmsLoanFile.loanType);
                }));
                console.log(this.loanTypes);
            });
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
    }
    onType(event){
      console.log(event.target.value);

    }

}
