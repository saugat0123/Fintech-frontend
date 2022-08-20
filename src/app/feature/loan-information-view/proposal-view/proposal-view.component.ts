import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {CustomerLoanDto} from '../../loan/model/customerLoanDto';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {CompanyInfoService} from '../../admin/service/company-info.service';
import {ToastService} from '../../../@core/utils';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {CustomerType} from '../../customer/model/customerType';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {CompanyInfo} from '../../admin/modal/company-info';
import {CompanyJsonData} from '../../admin/modal/CompanyJsonData';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.scss']
})
export class ProposalViewComponent implements OnInit {
  @Input() proposalData: Proposal;
  @Input() companyJson: CompanyJsonData;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() loanDataHolder: LoanDataHolder;
  @Input() loanCategory;
  @Input() formValue: CompanyInfo;
  @Output() documents = new EventEmitter();
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
  customerLoanDtoList: CustomerLoanDto[];
  fiscalYearArray: Array<FiscalYear>;
  companyInfo = new CompanyInfo();
  customerInfo: CustomerInfoData;
  companyJsonData: CompanyJsonData;
  siteVisitDocuments: Array<SiteVisitDocument>;

  constructor(private activatedRoute: ActivatedRoute,
              private loanConfigService: LoanConfigService,
              private customerLoanService: LoanFormService,
              private combinedLoanService: CombinedLoanService,
              private companyInfoService: CompanyInfoService,
              private toastService: ToastService,
              private  fiscalYearService: FiscalYearService) {
  }

  ngOnInit() {
    this.customerInfo = this.loanDataHolder.loanHolder;
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.companyJsonData = JSON.parse(this.formValue.companyJsonData);
    }
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.checkCustomerType();
    }
    this.proposalAllData = JSON.parse(this.proposalData.data);
    this.checkedData = JSON.parse(this.proposalData.checkedData);
    if (this.loanDataHolder.customerLoanDtoList !== null) {
      this.customerLoanDtoList = this.loanDataHolder.customerLoanDtoList;
    }
    this.getAllFiscalYear();
    this.calculateInterestRate();
    this.getLoanConfig();
    this.checkInstallmentAmount();
  }

  checkCustomerType() {
    if (CustomerType[this.customerInfo.customerType] === CustomerType.INSTITUTION) {
      this.companyInfoService.detail(this.customerInfo.associateId).subscribe((res: any) => {
        this.companyInfo = res.detail;
      }, error => {
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
      });
    }
  }

  getAllFiscalYear() {
    this.fiscalYearService.getAll().subscribe({
      next: (res: any) => {
        this.fiscalYearArray = res.detail;
      },
      error: (err) => {
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable To Fetch Fiscal Year'));
      },
      complete: () => {

      }
    });
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

  checkSiteVisitDocument(event: any) {
    this.siteVisitDocuments = event;
    this.documents.emit(this.siteVisitDocuments);
  }
}
