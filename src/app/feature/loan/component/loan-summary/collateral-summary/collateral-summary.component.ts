import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanType} from '../../../model/loanType';
import {ProposalCalculationUtils} from '../ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../@core/utils/constants/loan-data-key';
import {Security} from '../../../model/security';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";

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

  constructor() {
  }

  ngOnInit() {
    this.filterLoan();
    this.displaySecurityExposure();
  }

  filterLoan() {
    this.fundedList = this.customerAllLoanList.filter((l) => l.loan.isFundable);
    this.nonFundedList = this.customerAllLoanList.filter((l) => !l.loan.isFundable);
    this.totalProposedAmount =  ProposalCalculationUtils.calculateTotalFromProposalList
    (LoanDataKey.PROPOSE_LIMIT, this.customerAllLoanList);
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
}
