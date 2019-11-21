import { Component, OnInit } from '@angular/core';
import { LoanFormService } from '../../../feature/loan/component/loan-form/service/loan-form.service';
import { PieChart } from '../../../feature/admin/modal/pie-chart';
import { BranchService } from '../../../feature/admin/component/branch/branch.service';
import { Branch } from '../../../feature/admin/modal/branch';
import { User } from '../../../feature/admin/modal/user';
import { RoleAccess } from '../../../feature/admin/modal/role-access';
import { StatisticsService } from '../../../chart/shared/service/statistics.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BarChart } from '../../../chart/bar-chart/bar-chart.model';
import { BarChartService } from '../../../chart/bar-chart/bar-chart.service';

@Component({
    selector: 'app-charts',
    templateUrl: './data-visualization.component.html',
    styleUrls: ['./data-visualization.css']
})
export class DataVisualizationComponent implements OnInit {
    roleVsUsersPieChart: Array<PieChart>;
    branchVsUserPieChart: Array<PieChart>;
    pieChart: Array<PieChart> = new Array<PieChart>();
    barChartData: Array<BarChart> = new Array<BarChart>();
    branches: Branch[] = [];
    branchId = 0;
    startDate = '';
    endDate = '';
    selectedBranch = 'All Branches';
    view: any[];
    colorScheme = {
        domain: ['#F45123', '#B523F4', '#10E9AE', '#2D23F4']
    };
    user: User = new User();
    roleAccess: string;
    accessSpecific: boolean;
    accessAll: boolean;
    filterForm: FormGroup;
    workingWidth: number;
    pendingProposedAmount = 0;
    approvedProposedAmount = 0;
    rejectedProposedAmount = 0;
    closureProposedAmount = 0;

    constructor(
        private fb: FormBuilder,
        private loanFormService: LoanFormService,
        private barChartService: BarChartService,
        private statisticsService: StatisticsService,
        private branchService: BranchService
    ) { }

    ngOnInit() {
        this.findActiveRole();
        this.initalizeCurrentUserBranch();
        this.getGeneralPieChartData();
        this.getAllData();
        this.getSeperateProposedAmount();
        this.getBarChartData();
        this.buildFilterForm();
        this.getWidth();
    }

    filter(): void {
        this.branchId = Number(this.filterForm.get('branch').value);
        this.startDate = this.filterForm.get('startDate').value;
        this.endDate = this.filterForm.get('endDate').value;
        if (this.startDate !== '') {
            this.startDate = this.formateDate(this.startDate);
        }
        if (this.endDate !== '') {
            this.endDate = this.formateDate(this.endDate);
        }
        this.updateSelectedBranch();
        if (this.branchId === 0) {
            this.getAllData();
        } else {
            this.getAdvancedPieChartDataByBranchId();
        }
        this.getSeperateProposedAmount();
        this.getBarChartData();
    }

    buildFilterForm(): void {
        this.branchId = 0;
        this.filterForm = this.fb.group({
            branch: [this.branchId, Validators.compose([Validators.required])],
            startDate: [''],
            endDate: ['']
        });
    }

    reset(): void {
        this.buildFilterForm();
        this.filter();
    }

    getWidth(): void {
        this.workingWidth = document.getElementsByClassName('sb-bar-chart-container').item(0).clientWidth;
    }

    private updateSelectedBranch() {
        this.branches.forEach(branch => {
            if (branch.id === this.branchId) {
                this.selectedBranch = branch.name;
            }
        });
    }

    private getAdvancedPieChartDataByBranchId() {
        this.loanFormService.getLoanAmountByBranch(this.branchId, this.startDate, this.endDate)
        .subscribe((response: any) => this.pieChart = response.detail, (error) => console.log(error));
    }


    private getSeperateProposedAmount() {
        this.pendingProposedAmount = 0;
        this.approvedProposedAmount = 0;
        this.rejectedProposedAmount = 0;
        this.closureProposedAmount = 0;
        let responseArray = [];
        const proposedAmountArray = [];
        let counter = 1;
        let responseCounter = 0;
        let lenghtOfResponse;
        this.barChartService.getBarData(this.branchId, this.startDate, this.endDate)
            .subscribe((response: any) => {
                    {
                        responseArray = response.detail;
                        lenghtOfResponse = responseArray.length - 1;
                        do {
                            proposedAmountArray[responseCounter] = responseArray[lenghtOfResponse];
                            for (const key in proposedAmountArray[responseCounter]) {
                                const value = proposedAmountArray[responseCounter][key];
                                if (typeof value === 'object') {
                                    proposedAmountArray[counter] = [value];
                                    // tslint:disable-next-line:forin
                                    for (const secondKey in proposedAmountArray[counter][0]) {
                                        const secondValue = proposedAmountArray[counter][0][secondKey];
                                        this.getSpecificProposedAmount(secondValue);
                                    }
                                }
                            }
                            counter += 2;
                            responseCounter += 2;
                            lenghtOfResponse = lenghtOfResponse - 1;
                        }
                        while (lenghtOfResponse > -1);
                    }
                }
            );
    }
    private getSpecificProposedAmount (value) {
        if (value.name === 'Pending') {
            this.pendingProposedAmount = this.pendingProposedAmount + value.value;
        } else if (value.name === 'Approved') {
            this.approvedProposedAmount = this.approvedProposedAmount + value.value;
        } else if (value.name === 'Rejected') {
            this.rejectedProposedAmount = this.rejectedProposedAmount + value.value;
        } else {
            this.closureProposedAmount = this.closureProposedAmount + value.value;
        }
    }
    private findActiveRole() {
        this.roleAccess = localStorage.getItem('roleAccess');
        if (this.roleAccess === RoleAccess.SPECIFIC) {
            this.accessSpecific = true;
        } else if (this.roleAccess === RoleAccess.ALL) {
            this.accessAll = true;
        }
    }

    private initalizeCurrentUserBranch() {
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
            this.branches = response.detail;
            if (this.roleAccess === RoleAccess.OWN) {
                this.branches.forEach((branch, index) => this.selectedBranch = branch.name);
            }
        });
    }

    private getAllData(): void {
        this.loanFormService.getProposedAmount(this.startDate, this.endDate).subscribe((response: any) => {
            this.pieChart = response.detail;
            this.selectedBranch = 'All branches';
        }, (error) => console.log(error));
    }

    private getBarChartData(): void {
        this.barChartService.getBarData(this.branchId, this.startDate, this.endDate)
            .subscribe((response: any) => this.barChartData = response.detail);
    }

    private formateDate(date: string) {
        const pipe = new DatePipe('en-US');
        date = pipe.transform(new Date(date), 'MM/dd/yyyy');
        return date;
    }

    private getGeneralPieChartData(): void {
        this.getStatisticsForUsersPerBranch();
        this.getStatisticsForUsersPerRole();
    }

    private getStatisticsForUsersPerRole() {
        this.statisticsService.getStatisticsForUsersPerRole()
            .subscribe((response: any) => this.roleVsUsersPieChart = response.detail, (error) => console.log(error));
    }

    private getStatisticsForUsersPerBranch() {
        this.statisticsService.getStatisticsForUsersPerBranch()
            .subscribe((response: any) => this.branchVsUserPieChart = response.detail, (error) => console.log(error));
    }

}
