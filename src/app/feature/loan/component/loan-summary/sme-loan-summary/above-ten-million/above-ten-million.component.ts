import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {CustomerCategory} from '../../../../../customer/model/customerCategory';
import {environment} from '../../../../../../../environments/environment';

@Component({
  selector: 'app-above-ten-million',
  templateUrl: './above-ten-million.component.html',
  styleUrls: ['./above-ten-million.component.scss'],
})
export class AboveTenMillionComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() fiscalYear;
  @Input() isDetailedView: boolean;
  @Input() fixedAssetsData: Array<any>;
  @Input() totalProposedLimit: number;
  @Input() isExecutive: boolean;
  isUsedForAboveTenMillion: boolean;
  proposalData;
  tempData;
  loanHolder;
  guarantorData;
  customerCategory = CustomerCategory.SME_ABOVE_TEN_MILLION;
  incomeFromAccountSummary = false;
  incomeFromAccountData: any;
  financialCCBL;
  client: string;
  isJointInfo = false;
  loanCategory;
  jointInfo = [];
  currentDocAction = '';
  crgGammaGrade;
  crgGammaSummary = false;
  crgGammaScore = 0;
  crgGammaGradeStatusBadge;
  constructor() {
    this.client = environment.client;
  }

  ngOnInit() {
    console.log('loanDataHolder', this.loanDataHolder);
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.tempData = this.loanDataHolder.proposal;
      if (!ObjectUtil.isEmpty(this.tempData.data)) {
        this.proposalData = JSON.parse(this.tempData.data);
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.financialCcbl)) {
        this.financialCCBL = JSON.parse(this.loanDataHolder.loanHolder.financialCcbl);
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder) &&
      !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.guarantors) &&
          !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.guarantors.guarantorList)) {
        this.guarantorData = this.loanDataHolder.loanHolder.guarantors.guarantorList;
      }
    }
    // Setting IncomeFromAccount data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.incomeFromAccount)) {
      this.incomeFromAccountData = this.loanDataHolder.loanHolder.incomeFromAccount;
      this.incomeFromAccountSummary = true;
    }
    if (this.loanDataHolder.loanCategory === 'INDIVIDUAL' &&
        !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.jointInfo)) {
      const jointCustomerInfo = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
      this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
      this.isJointInfo = true;
    }
    this.loanCategory = this.loanDataHolder.loanCategory;
    this.currentDocAction = this.loanDataHolder.currentStage.docAction.toString();
    // Setting credit risk GAMMA---
    if (!ObjectUtil.isEmpty(this.loanDataHolder.crgGamma)) {
      this.crgGammaSummary = true;
      const crgParsedData = JSON.parse(this.loanDataHolder.crgGamma.data);
      if (!ObjectUtil.isEmpty(crgParsedData)) {
        this.crgGammaGrade = crgParsedData.grade;
      }
      this.crgGammaScore = ObjectUtil.isEmpty(crgParsedData.totalPoint) ? 0 : crgParsedData.totalPoint;
      if (!ObjectUtil.isEmpty(this.crgGammaGrade)) {
        if (this.crgGammaGrade === 'Superior' || this.crgGammaGrade === 'Good') {
          this.crgGammaGradeStatusBadge = 'badge badge-success';
        } else if (this.crgGammaGrade === 'Bad & Loss' || this.crgGammaGrade === 'Doubtful') {
          this.crgGammaGradeStatusBadge = 'badge badge-danger';
        } else {
          this.crgGammaGradeStatusBadge = 'badge badge-warning';
        }
      }
    }
  }
}
