import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../feature/admin/component/branch/branch.service';
import { RoleAccess } from '../../feature/admin/modal/role-access';
import { Branch } from '../../feature/admin/modal/branch';
import { BarChartService } from './bar-chart.service';
import { BarChart } from './bar-chart.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  data: Array<BarChart>;
  view: any[] = [1000, 450];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition = 'below';
  legendTitle = 'Status';
  showXAxisLabel = true;
  showDataLabel = true;
  animations = true;
  xAxisLabel = 'Loan Types';
  showYAxisLabel = true;
  yAxisLabel = 'Loan Amount';

  roleAccess: string;
  accessSpecific: boolean;
  accessAll: boolean;
  branches: Branch[] = [];
  selectedBranch = null;

  colorScheme = {
    domain: ['#C7B42C', '#5AA454', '#A10A28', '#AAAAAA']
  };

  constructor(private branchService: BranchService, private barChartService: BarChartService) {
  }

  ngOnInit(): void {
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
  }

  onChange(event) {
    if (event.target.value === 'Select Branch') {
      this.selectedBranch = null;
    } else {
      const branchId = Number(event.target.value);
      this.branches.forEach(branch => {
        if (branch.id === branchId) {
          this.selectedBranch = branch.name;
        }
      });
      this.barChartService.getBarData(branchId).subscribe((response: any) => {
        this.data = response.detail;
      });
    }
  }
}
