import {Component, OnInit} from '@angular/core';
import {LoanFormService} from '../../../feature/loan/component/loan-form/service/loan-form.service';
import {PieChart} from '../../../feature/admin/modal/pie-chart';
import {BranchService} from '../../../feature/admin/component/branch/branch.service';
import {Branch} from '../../../feature/admin/modal/branch';
import {UserService} from '../../../@core/service/user.service';
import {User} from '../../../feature/admin/modal/user';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './data-visualization.component.html',
    styleUrls: ['./data-visualization.css']
})
export class DataVisualizationComponent implements OnInit {
    pieChart: PieChart = new PieChart();
    branches: Branch[] = [];
    branchId: number;
    view: any[];
    colorScheme = {
        domain: ['#F45123', '#B523F4', '#10E9AE', '#2D23F4']
    };
    user: User = new User();

    constructor(private loanFormService: LoanFormService,
                private userService: UserService,
                private branchService: BranchService) {
    }

    ngOnInit() {
        this.branchService.getAll().subscribe(
            (response: any) => {
                this.branches = response.detail;
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
                }
            );
        } else {
            this.branchId = event.target.value;
            this.loanFormService.getLoanAmountByBranch(this.branchId).subscribe(
                (response: any) => {
                    this.pieChart = response.detail;
                }
            );
        }
    }
}
