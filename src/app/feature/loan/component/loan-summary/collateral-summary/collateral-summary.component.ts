import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanType} from '../../../model/loanType';
import {ProposalCalculationUtils} from '../ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../@core/utils/constants/loan-data-key';
import {Security} from '../../../model/security';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {ActivatedRoute} from '@angular/router';
import {DocStatus} from '../../../model/docStatus';
import {ToastService} from '../../../../../@core/utils';

@Component({
  selector: 'app-collateral-summary',
  templateUrl: './collateral-summary.component.html',
  styleUrls: ['./collateral-summary.component.scss']
})
export class CollateralSummaryComponent implements OnInit {
  @Input() customerAllLoanList;
  @Input() security: Security;
  @Input() loanCategory;
  @Input() approveSheet;

  client = environment.client;
  clientName = Clients;
  fundedList: LoanDataHolder[];
  nonFundedList: LoanDataHolder[];
  loanType = LoanType;
  proposalUtil = ProposalCalculationUtils;
  loanDataKey = LoanDataKey;
  totalProposedAmount = 0;
  totalRequiredCollateral = 0;
  securityExposure = false;
  approvedLoans=[];
  outstandingAmount;
  loanExposureFmv = 0;
  loanExposureDv =0;
  approvedTerminatingLoan;
  companyInfoId;
  approvedTerminatingLoanTotal = 0;
  approvedRevolvingLoanTotal = 0;
  existingLimitTotal =0;
  outstandingLimitTotal=0;
  proposedLimit =0;
  approvedCollateralTotal =0;
  coverage =0;
  constructor(
      private customerLoanService: LoanFormService,
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.displaySecurityExposure();
    this.activatedRoute.queryParams.subscribe((data)=> {
      this.companyInfoId = data.customerInfoId;
      this.filterLoan();
      this.getApprovedLoans(this.companyInfoId);
      this.calculation();
    })
  }

  filterLoan() {
    this.customerLoanService.getFinalLoanListByLoanHolderId(this.companyInfoId).subscribe((response: any) => {
    this.approvedLoans =response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);
    })
    this.fundedList = this.customerAllLoanList.filter((l) => l.loan.isFundable);
    this.nonFundedList = this.customerAllLoanList.filter((l) => !l.loan.isFundable);
  }

  calculateRequiredCollateral(list: LoanDataHolder[]) {
    let total = 0;
    list.forEach(value => {
      if (value.proposal) {
        total += value.proposal.proposedLimit * (value.proposal.collateralRequirement / 100);
      }
    });
    return ProposalCalculationUtils.isNumber(total);
  }

  setField(key , amount) {
    this[key] = amount;
    return amount;
  }

  displaySecurityExposure() {
    const securityData = JSON.parse(this.security.data);
    const initialData = securityData.initialForm;
    if (!ObjectUtil.isEmpty(this.security) && securityData.selectedArray.length > 0) {
      this.securityExposure = true;
      if (securityData.selectedArray.length === 1 &&
          securityData.selectedArray.includes('OtherSecurity')) {
        this.securityExposure = false;
      }
    } else {
      this.securityExposure = false;
    }
  }
  getApprovedLoans(id) {
    this.customerLoanService.getFinalLoanListByLoanHolderId(id).subscribe((response: any) => {
      this.approvedLoans = response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);
    }, err => {
      console.log(err);
    });
  }

  calculation(){
    this.customerLoanService.getFinalLoanListByLoanHolderId(this.companyInfoId).subscribe((response: any) => {
      this.approvedLoans =response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);
      let approvedTerminatingLoanTotal = [];
      this.approvedLoans.map(val => {
        if (val.loan.loanNature === 'Terminating') {
          approvedTerminatingLoanTotal.push(val.proposal.outStandingLimit);
        }
      });
      this.approvedTerminatingLoanTotal = approvedTerminatingLoanTotal.reduce((a, b) => Number(a) + Number(b), 0);

      let approvedRevolvingLoanTotal =[];
      this.approvedLoans.map(val => {
        if (val.loan.loanNature === 'Revolving'){
          approvedRevolvingLoanTotal.push(val.proposal.existingLimit);
        }
      });
      this.approvedRevolvingLoanTotal =approvedRevolvingLoanTotal.reduce((a, b) => Number(a) + Number(b),0);

      let existingLimitTotal = [];
      this.approvedLoans.map(val => {
        existingLimitTotal.push(val.proposal.existingLimit);
      });
      this.existingLimitTotal = existingLimitTotal.reduce((a,b) => Number(a) + Number(b),0);

          let outstandingLimitTotal = [];
          this.approvedLoans.map(val => {
            outstandingLimitTotal.push(val.proposal.outStandingLimit);
          });
          this.outstandingLimitTotal = outstandingLimitTotal.reduce((a,b) => Number(a) + Number(b),0);

          let approvedCollateralTotal = 0;
          this.approvedLoans.forEach(value => {
            if(value.proposal) {
              approvedCollateralTotal += value.proposal.proposedLimit *(value.proposal.collateralRequirement/100);
              console.log('approved collateral total', approvedCollateralTotal);
            }
          });
          this.approvedCollateralTotal = approvedCollateralTotal;

          this.totalProposedAmount =  ProposalCalculationUtils.calculateTotalFromProposalList
          (LoanDataKey.PROPOSE_LIMIT, this.customerAllLoanList);
          this.loanExposureFmv = ((this.totalProposedAmount + this.approvedTerminatingLoanTotal + this.approvedRevolvingLoanTotal ) / this.security.totalSecurityAmount) *100;
          this.loanExposureDv = ((this.totalProposedAmount + this.approvedRevolvingLoanTotal + this.approvedTerminatingLoanTotal) / this.security.totalDistressAmount)*100;
          this.coverage = (this.security.totalSecurityAmount/(this.totalProposedAmount+this.approvedTerminatingLoanTotal+this.approvedRevolvingLoanTotal))*100;

  }

    )}


}
