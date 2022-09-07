import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanType} from '../../../model/loanType';
import {ProposalCalculationUtils} from '../ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../@core/utils/constants/loan-data-key';
import {Security} from '../../../model/security';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerInfoData} from '../../../model/customerInfoData';

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
  @Input() customerInfo: CustomerInfoData;

  client = environment.client;
  clientName = Clients;
  fundedList: LoanDataHolder[];
  nonFundedList: LoanDataHolder[];
  loanType = LoanType;
  proposalUtil = ProposalCalculationUtils;
  loanDataKey = LoanDataKey;
  totalProposedAmount = 0;
  totalRequiredCollateral = 0;

  totaldv = 0;
  totalmv = 0;
  totalcv = 0;

  constructor() {
  }

  ngOnInit() {
    this.filterLoan();
    this.updateLandSecurityTotal();
  }

  filterLoan() {
    this.fundedList = this.customerAllLoanList.filter((l) => l.loan.isFundable
        && l.loanType.toString() !== 'FULL_SETTLEMENT_LOAN' && l.loanType.toString() !== 'CLOSURE_LOAN');
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
  updateLandSecurityTotal() {
    const parseData = JSON.parse(this.customerInfo.security.data);
    const landDetails = parseData.initialForm.landDetails;
    this.totaldv = 0;
    this.totalmv = 0;
    this.totalcv = 0;
    landDetails.forEach((sec) => {
      if (sec['revaluationData'] !== null && sec['revaluationData']['isReValuated']) {
        if (sec['revaluationData'].revaluationDetails === undefined || sec['revaluationData'].revaluationDetails === null) {
          this.totaldv += Number(sec['revaluationData']['reValuatedDv']);
          this.totalmv += Number(sec['revaluationData']['reValuatedFmv']);
          this.totalcv += Number(sec['revaluationData']['reValuatedConsideredValue']);
        } else {
          const revData = sec['revaluationData'].revaluationDetails;
          if (ObjectUtil.isEmpty(revData.reValuatedConsideredValue)) {
            this.totalmv += Number(revData[revData.length - 1].reValuatedFmv);
            this.totaldv += Number(revData[revData.length - 1].reValuatedDv);
            this.totalcv += Number(revData[revData.length - 1].reValuatedConsideredValue);
          } else {
            this.totalmv += Number(revData.reValuatedFmv);
            this.totaldv += Number(revData.reValuatedDv);
            this.totalcv += Number(revData.reValuatedConsideredValue);
          }
        }
      } else {
        this.totaldv += Number(sec['distressValue']);
        this.totalmv += Number(sec['marketValue']);
        this.totalcv += Number(sec['landConsideredValue']);
      }
    });


  }

}
