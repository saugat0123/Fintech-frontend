import {Component, OnInit} from '@angular/core';
import {LoanFormService} from '../../../feature/loan/component/loan-form/service/loan-form.service';
import {PieChart} from '../../../feature/admin/modal/pie-chart';
import {BranchService} from '../../../feature/admin/component/branch/branch.service';
import {Branch} from '../../../feature/admin/modal/branch';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
    pieChart: PieChart = new PieChart();
    branches: Branch[] = [];
    branchId: number;
    view: any[];
    showLegend = true;
    colorScheme = {
        domain: ['#F45123', '#B523F4', '#10E9AE', '#2D23F4']
    };
    showLabels = true;
    explodeSlices = false;
    doughnut = false;

    constructor(private loanFormService: LoanFormService,
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
