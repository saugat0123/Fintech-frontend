import {Component, OnInit} from '@angular/core';
import {LoanFormService} from '../../../feature/loan/component/loan-form/service/loan-form.service';
import {PieChart} from '../../../feature/admin/modal/pie-chart';
import {BranchService} from '../../../feature/admin/component/branch/branch.service';
import {Branch} from '../../../feature/admin/modal/branch';
import {UserService} from '../../../@core/service/user.service';
import {User} from '../../../feature/admin/modal/user';
import {RoleAccess} from '../../../feature/admin/modal/role-access';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './data-visualization.component.html',
    styleUrls: ['./data-visualization.css']
})
export class DataVisualizationComponent implements OnInit {
    pieChart: PieChart = new PieChart();
    branches: Branch[] = [];
    branchId = 0;
    selectedBranch = 'All Branches';
    view: any[];
    colorScheme = {
        domain: ['#F45123', '#B523F4', '#10E9AE', '#2D23F4']
    };
    user: User = new User();
    roleAccess: string;
    accessSpecific: boolean;
    accessAll: boolean;

    constructor(private loanFormService: LoanFormService,
                private userService: UserService,
                private branchService: BranchService) {
    }

    ngOnInit() {
        this.roleAccess = localStorage.getItem('roleAccess');
        if (this.roleAccess === RoleAccess.SPECIFIC) {
            this.accessSpecific = true;
        } else if (this.roleAccess === RoleAccess.ALL) {
            this.accessAll = true;
        }
        this.branchService.getBranchAccessByCurrentUser().subscribe(
            (response: any) => {
                this.branches = response.detail;
                if (this.roleAccess === RoleAccess.OWN) {
                    this.branches.forEach((branch, index) => {
                        this.selectedBranch = branch.name;
                    });
                }
            }
        );
        this.loanFormService.getProposedAmount().subscribe(
            (response: any) => {
                this.pieChart = response.detail;
            }
        );
    }

    onChange(event) {
        if (event.target.value === 'All Branches') {
            this.loanFormService.getProposedAmount().subscribe(
                (response: any) => {
                    this.pieChart = response.detail;
                    this.selectedBranch = event.target.value;
                    this.branchId = 0;
                }
            );
        } else {
            this.branchId = Number(event.target.value);
            this.loanFormService.getLoanAmountByBranch(this.branchId).subscribe(
                (response: any) => {
                    this.pieChart = response.detail;
                }
            );

            this.branches.forEach( branch => {
                if (branch.id === this.branchId) {
                    this.selectedBranch = branch.name;
                }
            });
        }
    }
}
