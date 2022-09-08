import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ProductPaperChecklistComponent} from '../../loan-information-template/product-paper-checklist/product-paper-checklist.component';
import {Security} from '../../loan/model/security';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Proposal} from '../../admin/modal/proposal';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {ReadmoreModelComponent} from '../../loan/component/readmore-model/readmore-model.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Clients} from '../../../../environments/Clients';
import {environment} from '../../../../environments/environment';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {LoanTag} from '../../loan/model/loanTag';

@Component({
  selector: 'app-detail-view-of-individual',
  templateUrl: './detail-view-of-individual.component.html',
  styleUrls: ['./detail-view-of-individual.component.scss']
})
export class DetailViewOfIndividualComponent implements OnInit {
  @Input() securityValue: Security;
  @ViewChild('productPaperChecklistComponent', {static: false})
  productPaperChecklistComponent: ProductPaperChecklistComponent;
  checklistData;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() loanId;
  @Input() calendarType;
  @Input() loanHolder;
  @Input() signatureList;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() loanSecurity: Array<Security>;
  @Input() approvedSecurity: Array<Security> = [];
  loans;
  paperChecklist;
  allIds = [];
  allId;
  checklistChecked = false;
  proposalData: Proposal;
  financial;
  checkedData;
  proposalAllData;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  showCadDoc = false;
  siteVisitDocuments: Array<SiteVisitDocument>;
  currentIndex;
  client = environment.client;
  clientName = Clients;
  RootUrl = ApiConfig.URL;
  creditRiskAlphaSummary = false;
  creditRiskGradeAlpha;
  creditRiskAlphaScore = 0;
  creditRiskAlphaPremium;
  creditRiskRatingAlpha;
  creditRiskRatingAlphaCurrentYear;
  creditRiskGrade;
  creditGradeAlphaStatusBadge;
  creditRiskLambdaSummary = false;
  creditRiskLambdaScore = 0;
  creditRiskGradeLambda;
  creditRiskRatingLambda;
  creditRiskLambdaPremium;
  creditGradeLambdaStatusBadge;
  crgGammaGradeStatusBadge;
  crgGammaGrade;
  crgGammaScore = 0;
  crgGammaSummary = false;
  financialData;
  loanTagEnum = LoanTag;
  isShareLoan = false;
  residenceVerificationVisible = false;
  @Input() combinedLoan: LoanDataHolder [];
  toggleChecklist = [];
  toggleId = [];
  check = false;
  thisClient;

  constructor(
      private modalService: NgbModal,
  ) {
    this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
  }

  ngOnInit() {
    this.disable();
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
      this.financialData = this.loanDataHolder.financial;
      this.financial = JSON.parse(this.financialData.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.checkedData = JSON.parse(this.loanDataHolder.proposal.checkedData);
      this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loan.paperChecklist)) {
      const obj = JSON.parse(this.loanDataHolder.loan.paperChecklist);
      this.checklistChecked = obj.checklistChecked;
    }
    this.thisClient = this.loanDataHolder.loanHolder.clientType;
    if (this.thisClient === 'CORPORATE' || this.thisClient === 'INFRASTRUCTURE_AND_PROJECT' ||
        this.thisClient === 'MID_MARKET' || this.thisClient === 'BUSINESS_DEVELOPMENT') {
      this.check = true;
    }
    // Setting CRG- Alpha data --
    if (!ObjectUtil.isEmpty(this.loanDataHolder.creditRiskGradingAlpha)) {
      this.creditRiskAlphaSummary = true;
      const crgParsedData = JSON.parse(this.loanDataHolder.creditRiskGradingAlpha.data);
      this.creditRiskGradeAlpha = crgParsedData.creditRiskGrade;
      this.creditRiskRatingAlpha = crgParsedData.creditRiskRating;
      this.creditRiskRatingAlphaCurrentYear = crgParsedData.currentFiscalYear;
      this.creditRiskAlphaPremium = crgParsedData.premium;
      this.creditRiskAlphaScore = ObjectUtil.isEmpty(crgParsedData.totalScore) || Number.isNaN(Number(crgParsedData.totalScore)) ?
          0 : crgParsedData.totalScore;
      if (this.creditRiskGrade === 'Excellent' || this.creditRiskGrade === 'Very Good') {
        this.creditGradeAlphaStatusBadge = 'badge badge-success';
      } else if (this.creditRiskGrade === 'Reject') {
        this.creditGradeAlphaStatusBadge = 'badge badge-danger';
      } else {
        this.creditGradeAlphaStatusBadge = 'badge badge-warning';
      }
    }

    // Setting CRG- Lambda data --
    if (!ObjectUtil.isEmpty(this.loanDataHolder.creditRiskGradingLambda)) {
      const crgParsedData = JSON.parse(this.loanDataHolder.creditRiskGradingLambda.data);
      this.creditRiskLambdaPremium = crgParsedData.premium;
      this.creditRiskLambdaSummary = true;
      this.creditRiskRatingLambda = crgParsedData.creditRiskRating;
      this.creditRiskGradeLambda = crgParsedData.creditRiskGrade;
      this.creditRiskLambdaScore = ObjectUtil.isEmpty(crgParsedData.totalScore) || Number.isNaN(Number(crgParsedData.totalScore)) ?
          0 : crgParsedData.totalScore;
      if (this.creditRiskGrade === 'Excellent' || this.creditRiskGrade === 'Very Good') {
        this.creditGradeLambdaStatusBadge = 'badge badge-success';
      } else if (this.creditRiskGrade === 'Reject') {
        this.creditGradeLambdaStatusBadge = 'badge badge-danger';
      } else {
        this.creditGradeLambdaStatusBadge = 'badge badge-warning';
      }
    }
    // Setting credit risk GAMMA data---
    if (!ObjectUtil.isEmpty(this.loanDataHolder.crgGamma)) {
      this.crgGammaSummary = true;
      const crgParsedData = JSON.parse(this.loanDataHolder.crgGamma.data);
      this.crgGammaGrade = crgParsedData.grade;
      this.crgGammaScore = ObjectUtil.isEmpty(crgParsedData.totalPoint) ? 0 : crgParsedData.totalPoint;
      if (this.crgGammaGrade === 'Superior' || this.crgGammaGrade === 'Good') {
        this.crgGammaGradeStatusBadge = 'badge badge-success';
      } else if (this.crgGammaGrade === 'Bad & Loss' || this.crgGammaGrade === 'Doubtful') {
        this.crgGammaGradeStatusBadge = 'badge badge-danger';
      } else {
        this.crgGammaGradeStatusBadge = 'badge badge-warning';
      }
    }
    this.flagShareSecurity();
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.siteVisit)) {
      const siteVisitData = JSON.parse(this.loanDataHolder.loanHolder.siteVisit.data);
      if (!ObjectUtil.isEmpty(siteVisitData.currentResidentFormChecked) && siteVisitData.currentResidentFormChecked === true) {
        this.residenceVerificationVisible = true;
      }
    }
  }
  // updateChecklist(event) {
  //   this.checklistData = event;
  // }
  customSafePipe(val) {
    if (val == null) {
      return '';
    }
    return val.replace(/(<([^>]+)>)/gi, '');
  }
  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg', backdrop: true});
    modalRef.componentInstance.comments = comments;
  }

  disable() {
    if (this.combinedLoan.length > 0) {
      this.combinedLoan.forEach((val, i) => {
        if (!ObjectUtil.isEmpty(val.paperProductChecklist)) {
          const obj = JSON.parse(val.paperProductChecklist);
          this.paperChecklist = obj.view;
          this.allId = obj.id;
          const parserData = new DOMParser().parseFromString(this.paperChecklist, 'text/html');
          this.allId.forEach(d => {
            const input = parserData.getElementById(d);
            const child = input.innerHTML;
            if (!child.includes('checked')) {
              input.innerHTML = `<input type="radio" disabled>`;
            } else {
              input.innerHTML = `<input type="radio" checked  name ="${Math.floor(Math.random() * Math.random() * 100) + 1}">`;
            }
          });
          this.toggleChecklist.push(parserData.body.innerHTML);
          this.toggleId.push(this.allId);
        } else {
          this.toggleChecklist.push(null);
          this.toggleId.push(null);
        }
      });
    }
  }

  loanHandler(index: number, length: number, label: string) {
    if (index === length - 1 && index !== 0) {
      if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
        if (this.loanDataHolder.isHsov) {
          return 'HSOV BY:';
        }
        return 'APPROVED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'REJECTED') {
        return 'REJECTED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'CLOSED') {
        return 'CLOSED BY:';
      }
    }
    if (!ObjectUtil.isEmpty(label)) {
      if (this.signatureList[index].docAction.toString() === 'DUAL_APPROVAL_PENDING') {
        return 'Approved By';
      }
      return label;
    } else {
      if (index === 0) {
        if (this.signatureList[index].docAction.toString() === 'RE_INITIATE') {
          return 'RE INITIATED:';
        } else {
          return 'INITIATED BY:';
        }
      } else {
        return 'SUPPORTED BY:';
      }
    }
  }

  flagShareSecurity() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.combinedLoan)) {
      const customerLen = !ObjectUtil.isEmpty(this.combinedLoan) ? this.combinedLoan.length : 0;
      if (customerLen >= 1) {
        let finalData: any;
        if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
          finalData = this.combinedLoan.filter((data) => data.loan.loanTag
              === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY));
        } else {
          finalData = this.combinedLoan.filter((data) => data.loan.loanTag
              === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY) && data.documentStatus.toString() !== 'APPROVED');
        }
        if (finalData.length >= 1) {
          this.isShareLoan = true;
        } else {
          this.isShareLoan = this.loanDataHolder.loan.loanTag === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY);
        }
      } else {
        this.isShareLoan = false;
      }
    } else {
      this.isShareLoan = this.loanDataHolder.loan.loanTag === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY);
    }
  }
}
