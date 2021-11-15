import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../admin/modal/proposal';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {DocStatus} from '../../loan/model/docStatus';
import {LoanType} from '../../loan/model/loanType';
import {EnumUtils} from '../../../@core/utils/enums.utils';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {LoanTag} from '../../loan/model/loanTag';
import {CustomerLoanDto} from '../../loan/model/customerLoanDto';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.scss']
})
export class ProposalViewComponent implements OnInit {
  @Input() proposalData: Proposal;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() loanDataHolder: LoanDataHolder;
  public DocStatus = DocStatus;
  public LoanType = LoanType;
  public EnumUtils = EnumUtils;
  proposalAllData: any;
  customerFundedLoanList: LoanDataHolder[];
  customerNonFundedLoanList: LoanDataHolder[];
  checkedData;
  client = environment.client;
  clientName = Clients;
  isFundable = false;
  fundableNonFundableSelcted = false;
  isFixedDeposit = false;
  loanNature;
  loanNatureSelected = false;
  isRevolving = false;
  isTerminating = false;
  isGeneral = false;
  isVehicle = false;
  isShare = false;
  allId;
  showInstallmentAmount = false;
  showRepaymentMode = false;
  showPrincipalAmount = false;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  showInterestAmount = false;
  prepaymentCharge;
  isRemit = false;
  customerLoanDtoList: CustomerLoanDto[];

  constructor(private activatedRoute: ActivatedRoute,
              private loanConfigService: LoanConfigService) {
  }

  ngOnInit() {
    this.proposalAllData = JSON.parse(this.proposalData.data);
    this.checkedData = JSON.parse(this.proposalData.checkedData);
    if (this.loanDataHolder.customerLoanDtoList !== null) {
      this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
    }
    this.calculateInterestRate();
    this.getLoanConfig();
    this.checkInstallmentAmount();
    if (this.loanDataHolder.loan.loanTag === LoanTag.getKeyByValue(LoanTag.REMIT_LOAN)) {
      this.isRemit = true;
    }
  }

  public getTotal(key: string): number {
      const filteredList = this.customerAllLoanList.filter(l => l.proposal.data !== null);
      const tempList = filteredList
          .filter(l => JSON.parse(l.proposal.data)[key]);
      const total = tempList
          .map(l => JSON.parse(l.proposal.data)[key])
          .reduce((a, b) => a + b, 0);
      return this.isNumber(total);
  }

  public getTotalFundable(key: string, funded: boolean, loanList: LoanDataHolder[]): number {
      this.fundedAndNonfundedList(loanList);
        let numb;
        if (funded) {
          const filteredList = this.customerFundedLoanList.filter(l => l.proposal.data !== null);
          const tempList = filteredList
              .filter(l => JSON.parse(l.proposal.data)[key]);
          numb = tempList
              .map(l => JSON.parse(l.proposal.data)[key])
              .reduce((a, b) => a + b, 0);
        } else {
          const filteredList = this.customerNonFundedLoanList.filter(l => l.proposal.data != null);
          const tempList = filteredList
              .filter(l => JSON.parse(l.proposal.data)[key]);
          numb = tempList
              .map(l => JSON.parse(l.proposal.data)[key])
              .reduce((a, b) => a + b, 0);
        }

        return this.isNumber(numb);
  }

  fundedAndNonfundedList(loanList: LoanDataHolder[]) {
    this.customerFundedLoanList = loanList.filter((l) => l.loan.isFundable);
    if (ObjectUtil.isEmpty(this.customerFundedLoanList)) {
      this.customerFundedLoanList = [];
    }
    this.customerNonFundedLoanList = this.customerAllLoanList.filter((l) => !l.loan.isFundable);
    if (ObjectUtil.isEmpty(this.customerNonFundedLoanList)) {
      this.customerNonFundedLoanList = [];
    }
  }

  isNumber(value) {
    if (ObjectUtil.isEmpty(value)) {
      return 0;
    }
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }

  }

  getLoanConfig() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.allId = {
            loanConfigId: null
          };
          this.allId = paramsValue;
          this.loanConfigService.detail(this.allId.loanConfigId).subscribe((response: any) => {
            this.isFundable = response.detail.isFundable;
            this.fundableNonFundableSelcted = !ObjectUtil.isEmpty(response.detail.isFundable);
            this.isFixedDeposit = response.detail.loanTag === 'FIXED_DEPOSIT';
            this.isGeneral = response.detail.loanTag === 'GENERAL';
            this.isShare = response.detail.loanTag === 'SHARE_SECURITY';
            this.isVehicle = response.detail.loanTag === 'VEHICLE';
            this.loanNature = response.detail.loanNature;
            if (!ObjectUtil.isEmpty(this.loanNature)) {
              this.loanNatureSelected = true;
              this.isTerminating = this.loanNature === 'Terminating';
              this.isRevolving = this.loanNature === 'Revolving';
              if (this.isRevolving) {
                this.isGeneral = false;
              }
            }
            if (!this.isFundable) {
              this.isGeneral = false;
            }
            if (this.isFixedDeposit) {
              this.loanNatureSelected = false;
              this.fundableNonFundableSelcted = false;
            }
          });
        });
  }
  checkInstallmentAmount() {
    if (this.proposalAllData.repaymentMode === 'EMI' || this.proposalAllData.repaymentMode === 'EQI') {
      this.showInstallmentAmount = true;
    }
    if (this.proposalAllData.repaymentMode === 'CUSTOM') {
      this.showInterestAmount = true;
      this.showRepaymentMode = true;
    }
    if (this.proposalAllData.repaymentMode === 'AT MATURITY') {
      this.showPrincipalAmount = true;
    }
  }

  calculateInterestRate() {
    const premiumRateOnBaseRate = Number(this.proposalAllData.premiumRateOnBaseRate);
    const baseRate = Number(this.proposalAllData.baseRate);
    const subsidizedRate = Number(this.proposalAllData.subsidizedLoan);
    const interestRate = baseRate + premiumRateOnBaseRate - subsidizedRate;
    return interestRate;
  }
}
