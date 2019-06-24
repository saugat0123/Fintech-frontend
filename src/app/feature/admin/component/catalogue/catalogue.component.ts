import { Component, OnInit } from '@angular/core';
import {BranchService} from '../branch/branch.service';
import {Branch} from '../../modal/branch';
import {LoanConfig} from '../../modal/loan-config';
import {LoanConfigService} from '../loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  branchList: Array<Branch> = new Array<Branch>();
  loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
  constructor(private branchService: BranchService,
              private loanConfigService: LoanConfigService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.branchService.getAll().subscribe((response: any) => {
      this.branchList = response.detail;
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
    });
    this.loanConfigService.getAll().subscribe((response: any) => {
      this.loanTypeList = response.detail;
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
    });
  }

}
