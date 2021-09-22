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
  loanExposure = 0;
  loanExposureDv =0;
  approvedTerminatingLoan;
  companyInfoId;
  approvedTerminatingLoanTotal = 0;
  approvedRevolvingLoanTotal = 0;
  proposedLimit =0;
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
  getData(){

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
      console.log('approved loans', this.approvedLoans);
      let approvedTerminatingLoanTotal = [];
      this.approvedLoans.map(val => {
        console.log('sum of terminating ', val.loan.loanNature, ' val.proposal.outStandingLimit: ', val.proposal.outStandingLimit);
        if (val.loan.loanNature === 'Terminating') {
          approvedTerminatingLoanTotal.push(val.proposal.outStandingLimit);
          console.log('approvedTerminatingLoanTotal: ', approvedTerminatingLoanTotal)
        }
      });
      this.approvedTerminatingLoanTotal = approvedTerminatingLoanTotal.reduce((a, b) => Number(a) + Number(b), 0);
      console.log('this.approvedTerminatingLoanTotal: ', this.approvedTerminatingLoanTotal);

      let approvedRevolvingLoanTotal =[];
      this.approvedLoans.map(val => {
        if (val.loan.loanNature === 'Revolving'){
          approvedRevolvingLoanTotal.push(val.proposal.existingLimit);
        }
      });
      this.approvedRevolvingLoanTotal =approvedRevolvingLoanTotal.reduce((a, b) => Number(a) + Number(b),0);
      console.log('this. approvedRevolvingLoanTotal', this.approvedRevolvingLoanTotal);


          this.totalProposedAmount =  ProposalCalculationUtils.calculateTotalFromProposalList
          (LoanDataKey.PROPOSE_LIMIT, this.customerAllLoanList);
          console.log('approved terminating loan',this.approvedTerminatingLoanTotal);
          console.log('this.total proposed amount', this.totalProposedAmount);
          this.loanExposure = ((this.totalProposedAmount + this.approvedTerminatingLoanTotal ) / this.security.totalSecurityAmount) *100;
          console.log('loan Exposure', this.loanExposure);
          this.loanExposureDv = ((this.totalProposedAmount + this.approvedRevolvingLoanTotal) / this.security.totalDistressAmount)*100;

  }

    )}


}
