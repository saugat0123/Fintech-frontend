import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
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
import {SummaryType} from '../../loan/component/SummaryType';
import {CustomerLoanDto} from '../../loan/model/CustomerLoanDto';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.scss']
})
export class ProposalViewComponent implements OnInit,OnChanges {
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
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  @Input() loanCategory;
  customerLoanDtoList: CustomerLoanDto[];
  array = [];
  dtoArray = [];

  constructor(private activatedRoute: ActivatedRoute,
              private loanConfigService: LoanConfigService) {
  }

  ngOnInit() {
  }

  public getTotal(key: string): number {
    const tempList = this.customerAllLoanList
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
      const tempList = this.customerFundedLoanList
          .filter(l => JSON.parse(l.proposal.data)[key]);
      numb = tempList
          .map(l => JSON.parse(l.proposal.data)[key])
          .reduce((a, b) => a + b, 0);
    } else {
      const tempList = this.customerNonFundedLoanList
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

  ngOnChanges(changes: SimpleChanges): void {
    this.proposalAllData = JSON.parse(this.proposalData.data);
    this.checkedData = JSON.parse(this.proposalData.checkedData);
    if (this.loanDataHolder.customerLoanDtoList !== null) {
      this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
    }
    this.calculateInterestRate();
    this.getLoanConfig();
    this.checkInstallmentAmount();
    this.loanConfig();
  }

  private loanConfig() {
    this.customerAllLoanList.forEach(c => {
      const config = {
          isFundable: c.loan.isFundable,
          fundableNonFundableSelcted: !ObjectUtil.isEmpty(c.loan.isFundable),
          isFixedDeposit: c.loan.loanTag === 'FIXED_DEPOSIT',
          isGeneral: c.loan.loanTag === 'GENERAL',
          isShare: c.loan.loanTag === 'SHARE_SECURITY',
          isVehicle: c.loan.loanTag === 'VEHICLE',
          loanNature: c.loan.loanNature,
          loanNatureSelected: false,
          isTerminating: false,
          isRevolving: false,
        };
      if (!ObjectUtil.isEmpty(config.loanNature)) {
        config.loanNatureSelected = true;
        if (config.loanNature.toString() === 'Terminating') {
          config.isTerminating = true;
        } else {
          config.isRevolving = true;
        }
        if (config.isRevolving) {
          config.isGeneral = false;
        }
      }
      if (!config.isFundable) {
        config.isGeneral = false;
      }
      if (config.isFixedDeposit) {
        config.loanNatureSelected = false;
        config.fundableNonFundableSelcted = false;
      }
      this.array.push(config);
    });
    if (!ObjectUtil.isEmpty(this.customerLoanDtoList)) {
      this.customerLoanDtoList.forEach(cd => {
        let dtoCfonfig;
        if (!ObjectUtil.isEmpty(cd.loanConfig)) {
          dtoCfonfig = {
            isFundable: cd.loanConfig.isFundable,
            fundableNonFundableSelcted: !ObjectUtil.isEmpty(cd.loanConfig.isFundable),
            isFixedDeposit: cd.loanConfig.loanTag === 'FIXED_DEPOSIT',
            isGeneral: cd.loanConfig.loanTag === 'GENERAL',
            isShare: cd.loanConfig.loanTag === 'SHARE_SECURITY',
            isVehicle: cd.loanConfig.loanTag === 'VEHICLE',
            loanNature: cd.loanConfig.loanNature,
            loanNatureSelected: false,
            isTerminating: false,
            isRevolving: false,
          };
        }
        if (!ObjectUtil.isEmpty(dtoCfonfig.loanNature)) {
          dtoCfonfig.loanNatureSelected = true;
          if (dtoCfonfig.loanNature.toString() === 'Terminating') {
            dtoCfonfig.isTerminating = true;
          } else {
            dtoCfonfig.isRevolving = true;
          }
          if (dtoCfonfig.isRevolving) {
            dtoCfonfig.isGeneral = false;
          }
        }
        if (!dtoCfonfig.isFundable) {
          dtoCfonfig.isGeneral = false;
        }
        if (dtoCfonfig.isFixedDeposit) {
          dtoCfonfig.loanNatureSelected = false;
          dtoCfonfig.fundableNonFundableSelcted = false;
        }
        this.dtoArray.push(dtoCfonfig);
      });
    }
  }
}
