import {Component, OnInit} from '@angular/core';
import {LoanFormService} from '../../../feature/loan/component/loan-form/service/loan-form.service';
import {PieChart} from '../../../feature/admin/modal/pie-chart';
import {BranchService} from '../../../feature/admin/component/branch/branch.service';
import {Branch} from '../../../feature/admin/modal/branch';
import {User} from '../../../feature/admin/modal/user';
import {RoleAccess} from '../../../feature/admin/modal/role-access';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BarChart} from '../../../chart/bar-chart/bar-chart.model';
import {BarChartService} from '../../../chart/bar-chart/bar-chart.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CatalogueSearch, CatalogueService} from '../../../feature/admin/component/catalogue/catalogue.service';
import {DocStatus} from '../../../feature/loan/model/docStatus';
import {Router} from '@angular/router';

@Component({
  selector: 'app-charts',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.css']
})
export class DataVisualizationComponent implements OnInit {

  pieChart: Array<PieChart> = new Array<PieChart>();
  barChartData: Array<BarChart> = new Array<BarChart>();
  branches: Branch[] = [];
  branchId = 0;
  userBranchId;
  startDate = '';
  endDate = '';
  selectedBranch = 'All Branches';
  view: any[];
  colorScheme = {
    domain: ['#F45123', '#B523F4', '#10E9AE', '#2D23F4', '#ADD8E6', '#808000']
  };
  user: User = new User();
  roleAccess: string;
  accessSpecific: boolean;
  accessAll: boolean;
  filterForm: FormGroup;
  workingWidth: number;
  discussionProposedAmount = 0;
  documentationProposedAmount = 0;
  valuationProposedAmount = 0;
  reviewProposedAmount = 0;
  pendingProposedAmount = 0;
  approvedProposedAmount = 0;
  rejectedProposedAmount = 0;
  closureProposedAmount = 0;

  discussionFileCount = 0;
  documentationFileCount = 0;
  valuationFileCount = 0;
  reviewFileCount = 0;
  pendingFileCount = 0;
  approvedFileCount = 0;
  rejectedFileCount = 0;
  closureFileCount = 0;

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private loanFormService: LoanFormService,
      private barChartService: BarChartService,
      private branchService: BranchService,
      private catalogueService: CatalogueService
  ) {
  }

  ngOnInit() {
    this.findActiveRole();
    this.initalizeCurrentUserBranch();
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
    this.getBarChartData();
    this.getSeperateProposedAmount();
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
    this.loanFormService.getLoanAmountByBranch(this.branchId, this.startDate, this.endDate )
    .subscribe((response: any) => {
          this.pieChart = response.detail;
          this.pieChart.forEach(p => {
            if (p.value == null) {
              p.value = 0;
            }
          });
        }
        , (error) => console.log(error));
  }

  private getSeperateProposedAmount() {
    this.discussionProposedAmount = 0;
    this.documentationProposedAmount = 0;
    this.valuationProposedAmount = 0;
    this.reviewProposedAmount = 0;
    this.pendingProposedAmount = 0;
    this.approvedProposedAmount = 0;
    this.rejectedProposedAmount = 0;
    this.closureProposedAmount = 0;
    let responseArray = [];
    const proposedAmountArray = [];
    let counter = 1;
    let responseCounter = 0;
    let lenghtOfResponse;
    this.barChartService.getBarData(this.branchId, this.startDate, this.endDate )
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

  private getSpecificProposedAmount(value) {

    if (value.name === 'Discussion') {
      this.discussionProposedAmount = this.discussionProposedAmount + value.value;
      this.discussionFileCount += value.fileCount;
    } else if (value.name === 'Documentation') {
      this.documentationProposedAmount = this.documentationProposedAmount + value.value;
      this.documentationFileCount += value.fileCount;
    } else if (value.name === 'Valuation') {
      this.valuationProposedAmount = this.valuationProposedAmount + value.value;
      this.valuationFileCount += value.fileCount;
    } else if (value.name === 'Under Review') {
      this.reviewProposedAmount = this.reviewProposedAmount + value.value;
      this.reviewFileCount += value.fileCount;
    } else if (value.name === 'Pending') {
      this.pendingProposedAmount = this.pendingProposedAmount + value.value;
      this.pendingFileCount += value.fileCount;
    } else if (value.name === 'Approved') {
      this.approvedProposedAmount = this.approvedProposedAmount + value.value;
      this.approvedFileCount += value.fileCount;
    } else if (value.name === 'Rejected') {
      this.rejectedProposedAmount = this.rejectedProposedAmount + value.value;
      this.rejectedFileCount += value.fileCount;
    } else {
      this.closureProposedAmount = this.closureProposedAmount + value.value;
      this.closureFileCount += value.fileCount;
    }
  }

  private findActiveRole() {
    this.roleAccess = LocalStorageUtil.getStorage().roleAccess;
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
        const storage = LocalStorageUtil.getStorage();
        LocalStorageUtil.setStorage(storage);
        this.branches.forEach((branch, index) => {
          this.userBranchId = branch.id;
          this.selectedBranch = branch.name;
        }
      );
      }
    });
  }

  private getAllData(): void {
    this.loanFormService.getProposedAmount(this.startDate, this.endDate).subscribe((response: any) => {
      this.pieChart = response.detail;
      this.pieChart.forEach(p => {
        if (p.value == null) {
          p.value = 0;
        }
      });
      this.selectedBranch = 'All branches';
    }, (error) => console.log(error));
  }

  private getBarChartData(): void {
    this.barChartService.getBarData(this.branchId, this.startDate, this.endDate )
    .subscribe((response: any) => {
      this.barChartData = response.detail;
      this.barChartData.forEach(b => {
        b.series.forEach(s => {
          if (s.value == null) {
            s.value = 0;
          }
        });
      });
    });
  }

  private formateDate(date: string) {
    const pipe = new DatePipe('en-US');
    date = pipe.transform(new Date(date), 'MM/dd/yyyy');
    return date;
  }
  resolveToCatalogue(status: string) {
    const search: CatalogueSearch = new CatalogueSearch();
    if (status === 'approved') {
      search.documentStatus = DocStatus.value(DocStatus.APPROVED);
    } else if (status === 'rejected') {
      search.documentStatus = DocStatus.value(DocStatus.REJECTED);
    } else if (status === 'closed') {
      search.documentStatus = DocStatus.value(DocStatus.CLOSED);
    } else if (status === 'pending') {
      search.documentStatus = DocStatus.value(DocStatus.PENDING);
    } else if (status === 'discussion') {
      search.documentStatus = DocStatus.value(DocStatus.DISCUSSION);
    } else if (status === 'documentation') {
      search.documentStatus = DocStatus.value(DocStatus.DOCUMENTATION);
    } else if (status === 'valuation') {
      search.documentStatus = DocStatus.value(DocStatus.VALUATION);
    } else if (status === 'underReview') {
      search.documentStatus = DocStatus.value(DocStatus.UNDER_REVIEW);
    }

    this.catalogueService.search = search;
    this.router.navigate(['/home/admin/catalogue'], {
      queryParams: {
        redirect: true,
        search: search.documentStatus
      }
    });
  }

}
