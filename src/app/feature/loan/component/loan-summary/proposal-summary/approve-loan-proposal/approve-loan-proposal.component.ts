import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {Proposal} from '../../../../../admin/modal/proposal';
import {environment} from '../../../../../../../environments/environment';
import {Clients} from '../../../../../../../environments/Clients';
import {ProductUtils} from '../../../../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {SummaryType} from '../../../SummaryType';
import {DocStatus} from '../../../../model/docStatus';
import { LoanType } from '../../../../model/loanType';
import { EnumUtils } from '../../../../../../@core/utils/enums.utils';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfigService} from '../../../../../admin/component/loan-config/loan-config.service';
import {LoanFormService} from '../../../loan-form/service/loan-form.service';

@Component({
  selector: 'app-approve-loan-proposal',
  templateUrl: './approve-loan-proposal.component.html',
  styleUrls: ['./approve-loan-proposal.component.scss']
})
export class ApproveLoanProposalComponent implements OnInit {
  @Input() proposalData: Proposal;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() customerAllLoanList1: LoanDataHolder[];
  @Input() loanDataHolder;
  @Input() approveSheet;
  public DocStatus = DocStatus;
  public LoanType = LoanType;
  public EnumUtils = EnumUtils;
  proposalAllData: any;
  customerFundedLoanList: LoanDataHolder[];
  customerNonFundedLoanList: LoanDataHolder[];
  loanType: any;
  client = environment.client;
  clientName = Clients;
  checkedData;
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
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  @Input() loanCategory;
  data;

  constructor(private activatedRoute: ActivatedRoute,
              private loanConfigService: LoanConfigService,
              private loanFormService: LoanFormService) { }

  ngOnInit() {
    console.log(this.loanDataHolder);
    console.log('Proosal', this.customerAllLoanList);
    // this.customerAllLoanList.filter(test => {
    // })
    this.proposalAllData = JSON.parse(this.loanDataHolder.approvedLoan);
    console.log('proposalAllData:::', this.proposalAllData);
    // this.checkedData = JSON.parse(this.proposalData.checkedData);
    // this.calculateInterestRate();
    this.getLoanConfig();
    // this.checkInstallmentAmount();
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
  //
  // getLoanConfig() {
  //   console.log('id', this.loanDataHolder.id);
  //   this.loanFormService.getLoansByLoanHolderId(this.loanDataHolder.id).subscribe((res: any) => {
  //     this.data = res.detail;
  //     console.log('data', this.data);
  //   });
  // }

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
}
