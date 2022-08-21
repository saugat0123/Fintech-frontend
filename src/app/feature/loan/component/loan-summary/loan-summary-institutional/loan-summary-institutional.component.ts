import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Clients} from '../../../../../../environments/Clients';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {User} from '../../../../admin/modal/user';
import {LoanType} from '../../../model/loanType';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {LoanStage} from '../../../model/loanStage';
import {BusinessType} from '../../../../admin/modal/businessType';
import {Financial} from '../../../model/financial';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';
import {Proposal} from '../../../../admin/modal/proposal';
import {NetTradingAssets} from '../../../../admin/modal/NetTradingAssets';
import {ProductUtils} from '../../../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {NbDialogRef} from '@nebular/theme';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {IndividualJsonData} from '../../../../admin/modal/IndividualJsonData';
import {DOCUMENT} from '@angular/common';
import {UserService} from '../../../../../@core/service/user.service';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanActionService} from '../../../loan-action/service/loan-action.service';
import {DmsLoanService} from '../../loan-main-template/dms-loan-file/dms-loan-service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ApprovalLimitService} from '../../../../admin/component/approvallimit/approval-limit.service';
import {DateService} from '../../../../../@core/service/baseservice/date.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentService} from '../../../../admin/component/document/document.service';
import {CombinedLoanService} from '../../../../service/combined-loan.service';
import {CommonRoutingUtilsService} from '../../../../../@core/utils/common-routing-utils.service';
import {ToastService} from '../../../../../@core/utils';
import {FiscalYearService} from '../../../../admin/service/fiscal-year.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import {saveAs as importedSaveAs} from 'file-saver';
import {DocStatus} from '../../../model/docStatus';
import {Security} from 'src/app/feature/admin/modal/security';
import {DocAction} from '../../../model/docAction';
import {ReadmoreModelComponent} from '../../readmore-model/readmore-model.component';
import {LoanTag} from '../../../model/loanTag';

@Component({
  selector: 'app-loan-summary-institutional',
  templateUrl: './loan-summary-institutional.component.html',
  styleUrls: ['./loan-summary-institutional.component.scss']
})
export class LoanSummaryInstitutionalComponent implements OnInit {
  @Output() changeToApprovalSheetActive = new EventEmitter<string>();

  @Input() loanDataHolder: LoanDataHolder;

  @Input()
  loanConfig: LoanConfig = new LoanConfig();

  @Input() nepaliDate;
  @Input() customerAllLoanList: LoanDataHolder [];
  @Input() loanSecurity: Array<Security>;
  @Input() approvedSecurity: Array<Security> = [];

  client: string;
  clientName = Clients;

  docMsg;
  rootDocLength;
  dmsLoanFile: DmsLoanFile = new DmsLoanFile();
  loan: string;
  index = 0;
  currentIndex: number;
  user: User = new User();
  securities: any = [];
  Security: typeof Security = Security;
  documents: [] = [];
  documentUrls = [];
  documentUrl: string;
  documentNames = [];
  documentName: string;
  document: string;
  documentNamesSplit: string[] = [];
  id: number;
  customerInfo: any;
  loanType = LoanType;
  customerId;
  loanConfigId;
  RootUrl = ApiConfig.URL;
  signatureList: Array<LoanStage> = new Array<LoanStage>();
  previousList: Array<LoanStage> = new Array<LoanStage>();
  currentDocAction = '';
  loanCategory;
  @ViewChild('print', {static: false}) print;
  businessType = BusinessType;
  financialData: Financial = new Financial();
  shareSecurityData: ShareSecurity = new ShareSecurity();
  proposalData: Proposal;
  guarantorData = [];
  financialSummary = false;
  siteVisitSummary = false;
  shareSecuritySummary = false;
  proposalSummary = false;
  securityData: Object;
  siteVisitData: Object;
  checkGuarantorData = false;
  offerLetterDocuments: {
    name: string,
    url: string
  }[] = [];
  registeredOfferLetters: Array<string> = [];

  // Credit risk variables ---
  creditGradeStatusBadge;
  creditRiskGrade;
  creditRiskScore = 0;
  noComplianceLoan = false;
  creditRiskSummary = false;

  // Credit risk GAMMA variables ---
  crgGammaGradeStatusBadge;
  crgGammaGrade;
  crgGammaScore = 0;
  crgGammaSummary = false;

  // credit risk alpha variables --
  creditGradeAlphaStatusBadge;
  creditRiskGradeAlpha;
  creditRiskAlphaScore = 0;
  creditRiskAlphaPremium;
  creditRiskRatingAlpha;
  creditRiskRatingAlphaCurrentYear;
  creditRiskAlphaSummary = false;

  creditRiskLambdaSummary = false;
  creditRiskLambdaScore = 0;
  creditRiskGradeLambda;
  creditRiskRatingLambda;
  creditRiskLambdaPremium;
  creditGradeLambdaStatusBadge;

  incomeFromAccountSummary = false;
  incomeFromAccountData;
  netTradingAssetsSummary = false;
  netTradingAssetsData: NetTradingAssets;
  minOneInsuranceDoc = false;
  minOneGuarantorDoc = false;
  taggedGuarantorWithDoc = [];
  insuranceWithDoc = [];
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  fiscalYearArray = [];
  roleType;
  showApprovalSheetInfo = false;
  notApprove = 'notApprove';
  commentsSummary = false;
  dataFromComments;
  previousSecuritySummary = false;
  dataFromPreviousSecurity;
  isJointInfo = false;
  jointInfo = [];
  newJointInfo = [];
  age: number;
  isOpen: false;
  private dialogRef: NbDialogRef<any>;
  refId: number;
  securityId: number;
  siteVisitDocuments: Array<SiteVisitDocument>;
  isRemitLoan = false;
  beneficiary;
  dbr;
  individualJsonData: IndividualJsonData;
  senderDetails;
  bankingRelation;
  naChecked: boolean;
  reviewDateData;
  multiBankingSummary = false;
  multiBankingData;
  checkedData;
  proposalAllData;
  financial;
  paperChecklist;
  allIds;
  hidePreviewButton = false;
  zipDocName;
  loaded = false;
  isShareLoan = false;
  loanTagEnum = LoanTag;
  @Input() combinedLoan: any;
  isCorporate = false;
  thisClient;
  customerReportingInfo = [];
  esrmData;
  constructor(
      @Inject(DOCUMENT) private _document: Document,
      private userService: UserService,
      private loanFormService: LoanFormService,
      private loanActionService: LoanActionService,
      private dmsLoanService: DmsLoanService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private loanConfigService: LoanConfigService,
      private approvalLimitService: ApprovalLimitService,
      private dateService: DateService,
      private modalService: NgbModal,
      private documentService: DocumentService,
      private customerLoanService: LoanFormService,
      private combinedLoanService: CombinedLoanService,
      private commonRoutingUtilsService: CommonRoutingUtilsService,
      private toastService: ToastService,
      private fiscalYearService: FiscalYearService,
  ) {
  }

  consumerFinance = false;
  smallBusiness = false;
  fullSettlement = false;

  ngOnInit() {
    this.thisClient = this.loanDataHolder.loanHolder.clientType;
    if ((this.thisClient === 'CORPORATE' || this.thisClient === 'INFRASTRUCTURE_AND_PROJECT' ||
        this.thisClient === 'MID_MARKET' || this.thisClient === 'BUSINESS_DEVELOPMENT') && this.loanDataHolder.loanHolder.customerType === 'INSTITUTION') {
      this.isCorporate = true;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.creditChecklist)) {
      this.esrmData = JSON.parse(this.loanDataHolder.loanHolder.creditChecklist.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder) && !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.reportingInfoLevels)
        && this.loanDataHolder.loanHolder.reportingInfoLevels.length > 0) {
        this.loanDataHolder.loanHolder.reportingInfoLevels.forEach(rep => {
        this.customerReportingInfo.push(rep);
      });
    }
    this.getLoanDataHolder();
    if (LoanType[this.loanDataHolder.loanType] === LoanType.FULL_SETTLEMENT_LOAN) {
      this.fullSettlement = true;
    }
    if (this.loanConfig.loanTag === 'REMIT_LOAN' && this.loanConfig.isRemit) {
      this.isRemitLoan = true;
    }
    // this.disable();
    if (this.loanDataHolder.loanHolder.clientType === 'CONSUMER_FINANCE') {
      this.consumerFinance = true;
    } else if (this.loanDataHolder.loanHolder.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES' && this.loanDataHolder.loanHolder.customerType === 'INSTITUTION') {
      this.smallBusiness = true;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.checkedData = JSON.parse(this.loanDataHolder.proposal.checkedData);
      this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
    }
    this.roleType = LocalStorageUtil.getStorage().roleType;
    this.checkDocUploadConfig();
    if (this.isRemitLoan) {
      this.beneficiary = JSON.parse(this.loanDataHolder.remitCustomer.beneficiaryData);
      this.senderDetails = JSON.parse(this.loanDataHolder.remitCustomer.senderData);
    }
    this.calculateEmiEqiAmount();
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.bankingRelationship)) {
      this.bankingRelation = JSON.parse(this.loanDataHolder.loanHolder.bankingRelationship);
    }
    this.checkDocumentStatus();
    this.flagShareSecurity();
  }

  getLoanDataHolder() {
    // Setting financial data---
    if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
      this.financialData = this.loanDataHolder.financial;
        this.financial = JSON.parse(this.financialData.data);
        this.financialSummary = true;
    }

    if (!ObjectUtil.isEmpty(this.loanDataHolder.insurance)) {
      this.loanDataHolder.insurance.forEach(value => {
        if (value.policyDocumentPath) {
          this.insuranceWithDoc.push(value);
          this.minOneInsuranceDoc = true;
        }
      });
    }

    // Setting IncomeFromAccount data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.incomeFromAccount)) {
      this.incomeFromAccountData = this.loanDataHolder.loanHolder.incomeFromAccount;
      this.incomeFromAccountSummary = true;
    }
    // Setting Comments data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
      this.dataFromComments = JSON.parse(this.loanDataHolder.loanHolder.data);
      this.commentsSummary = true;
    }

    // Setting Previous Security Data
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
      this.dataFromPreviousSecurity = JSON.parse(this.loanDataHolder.loanHolder.data);
      this.previousSecuritySummary = true;
    }


    // Setting NetTradingAssets data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.netTradingAssets)) {
      this.netTradingAssetsData = JSON.parse(this.loanDataHolder.loanHolder.netTradingAssets.data);
      if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {
        this.netTradingAssetsSummary = true;
      }
    }


    // Setting credit risk data---
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.creditRiskGrading)) {
      this.creditRiskSummary = true;
      const crgParsedData = JSON.parse(this.loanDataHolder.loanHolder.creditRiskGrading.data);
      if (crgParsedData.complianceOfCovenants === 0) {
        this.noComplianceLoan = true;
      }
      this.creditRiskGrade = crgParsedData.grade;
      this.creditRiskScore = ObjectUtil.isEmpty(crgParsedData.totalPoint) ? 0 : crgParsedData.totalPoint;
      if (this.creditRiskGrade === 'Superior' || this.creditRiskGrade === 'Good') {
        this.creditGradeStatusBadge = 'badge badge-success';
      } else if (this.creditRiskGrade === 'Bad & Loss' || this.creditRiskGrade === 'Doubtful') {
        this.creditGradeStatusBadge = 'badge badge-danger';
      } else {
        this.creditGradeStatusBadge = 'badge badge-warning';
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

    // Setting SiteVisit data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.siteVisit)) {
      this.siteVisitData = JSON.parse(this.loanDataHolder.siteVisit.data);
      this.siteVisitSummary = true;
    }

    if (this.loanDataHolder.taggedGuarantors.length > 0) {
      this.guarantorData = this.loanDataHolder.taggedGuarantors;
      this.checkGuarantorData = true;
      this.loanDataHolder.taggedGuarantors.forEach(value => {
        if (!ObjectUtil.isEmpty(value.docPath)) {
          this.taggedGuarantorWithDoc.push(value);
          this.minOneGuarantorDoc = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal;
      this.proposalSummary = true;
    }

    // setting share-secuirty data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.shareSecurity)) {
      this.shareSecuritySummary = true;
      this.shareSecurityData = JSON.parse(this.loanDataHolder.shareSecurity.data);
    }
    this.loanCategory = this.loanDataHolder.loanCategory;
    this.currentIndex = this.loanDataHolder.previousList.length;

    this.signatureList = this.getSignatureList(new Array<LoanStage>
    (...this.loanDataHolder.previousList, this.loanDataHolder.currentStage));

    this.previousList = this.loanDataHolder.previousList;
    this.currentDocAction = this.loanDataHolder.currentStage.docAction.toString();
    this.id = this.loanDataHolder.id;
    this.dmsLoanFile = this.loanDataHolder.dmsLoanFile;
    if (this.dmsLoanFile !== undefined && this.dmsLoanFile !== null) {
      this.securities = this.dmsLoanFile.securities;
      this.documents = JSON.parse(this.dmsLoanFile.documentPath);
      if (this.documents !== null) {
        this.documentNames = [];
        this.documentUrls = [];
        for (this.document of this.documents) {
          this.documentNamesSplit = this.document.split(':');
          if (!this.documentNames.includes(this.documentNamesSplit[0])) {
            this.documentNames.push(this.documentNamesSplit[0]);
            this.documentUrls.push(this.documentNamesSplit[1]);
          }
        }

        if (LoanType[this.loanDataHolder.loanType] === LoanType.NEW_LOAN) {
          this.rootDocLength = this.loanDataHolder.loan.initial.length;
        }
        if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEWED_LOAN) {
          this.rootDocLength = this.loanDataHolder.loan.renew.length;
        }

        if (LoanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
          this.rootDocLength = this.loanDataHolder.loan.closure.length;
        }

        const filledDocLength = this.documentNames.length;
        this.docMsg = filledDocLength + ' out of ' + this.rootDocLength + ' document has been uploaded';
      }
    }

    // Offer Letter Documents
    if (this.loanDataHolder.customerOfferLetter && this.loanDataHolder.customerOfferLetter.customerOfferLetterPath) {
      this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(offerLetterPath => {
        if (offerLetterPath.path && !this.registeredOfferLetters.includes(offerLetterPath.offerLetter.name)) {
          this.registeredOfferLetters.push(offerLetterPath.offerLetter.name);
          this.offerLetterDocuments.push({
            name: offerLetterPath.offerLetter.name,
            url: offerLetterPath.path
          });
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder)) {
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.reviewDate)) {
        this.reviewDateData = JSON.parse(this.loanDataHolder.loanHolder.reviewDate.data);
        this.naChecked = this.reviewDateData.checked;
      }
    }

    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.multiBanking)) {
      this.multiBankingData = this.loanDataHolder.loanHolder.multiBanking;
      this.multiBankingSummary = true;
    }
    // getting fiscal years
    this.getFiscalYears();
  }

  download(i) {
    this.documentUrl = this.documentUrls[i];
    this.documentName = this.documentNames[i];
    this.dmsLoanService.downloadDocument(this.documentUrl).subscribe(
        (response: any) => {
          const downloadUrl = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = downloadUrl;
          const toArray = this.documentUrl.split('.');
          const extension = toArray[toArray.length - 1];
          link.download = this.documentName + '.' + extension;
          link.click();
        },
        error1 => {
          this.toastService.show(new Alert(AlertType.ERROR, error1.error.message));
        }
    );
  }

  downloadCustomerDocument(documentPath, documentName) {
    this.dmsLoanService.downloadDocument(documentPath).subscribe(
        (response: any) => {
          const downloadUrl = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = downloadUrl;
          const toArray = documentPath.split('.');
          const extension = toArray[toArray.length - 1];
          link.download = documentName + '.' + extension;
          link.click();
        },
        error => {
          console.log(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'File not Found'));
        }
    );
  }

  downloadAllDocument(path: string) {
    path = '/doc';
    this.documentService.downloadAllDoc(path, this.loanDataHolder.id).subscribe((res: any) => {
      this.previewOfferLetterDocument(res.detail, res.detail);
    }, error => this.toastService.show(new Alert(AlertType.ERROR, error.error.message)));
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

  renewedOrCloseFrom(id, loanId) {
    window.open('/#/home/loan/summary' + `?loanConfigId=${loanId}&customerId=${id}`, '_blank');

    this.customerId = id;
    this.getLoanDataHolder();

  }

  previewOfferLetterDocument(url: string, name: string): void {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
    link.download = name;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  /**
   * Get array of loan stage for authority signature array.
   *
   * @param stages Array of loan stages that must include previous stages and current stage.
   */
  private getSignatureList(stages: Array<LoanStage>): Array<LoanStage> {
    let lastBackwardIndex = 0;
    let lastRevokedIndex = 0;
    stages.forEach((data, index) => {
      if (data.docAction.toString() === DocAction.value(DocAction.BACKWARD)
          || data.docAction.toString() === DocAction.value(DocAction.RE_INITIATE)) {
        lastBackwardIndex = index;
      }
    });
    if (lastBackwardIndex !== 0) {
      stages.splice(0, lastBackwardIndex + 1);
    }
    const stage1 = stages;
    for (let i = 0; i <= stages.length - 1; i++) {
      if (stages[i].docAction.toString() === DocAction.value(DocAction.REVERT_APPROVED)) {
        lastRevokedIndex = i;
        break;
      }
    }
    if (stages.length > 0) {
      if (stages[stages.length - 1].docAction.toString() === DocAction.value(DocAction.REVERT_APPROVED)) {
        if (lastRevokedIndex !== 0) {
          stage1.splice(lastRevokedIndex - 1, ((stages.length - 1) - (lastRevokedIndex - 2)));
        }
      } else {
        if (lastRevokedIndex !== 0) {
          stage1.splice(lastRevokedIndex - 1, ((stages.length - 1) - (lastRevokedIndex - 1)));
        }
      }
    }
    const signatureList = new Array<LoanStage>();
    const addedStages = new Map<number, number>(); // KEY = loan stage from user id, value = array index
    stages.forEach((loanStage, index) => {
      if (loanStage.docAction.toString() !== DocAction.value(DocAction.TRANSFER)) {
        if (addedStages.has(loanStage.fromUser.id)) {
          signatureList[addedStages.get(loanStage.fromUser.id)] = loanStage;
        } else {
          signatureList.push(loanStage);
          addedStages.set(loanStage.fromUser.id, index);
        }
      }
    });
    return signatureList;
  }

  getFiscalYears() {
    this.fiscalYearService.getAll().subscribe(response => {
      this.fiscalYearArray = response.detail;
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
    });
  }

  public close() {
    if (this.isOpen) {
      this.dialogRef.close();
      this.isOpen = false;
    }
  }

  checkDocUploadConfig() {
    const storage = LocalStorageUtil.getStorage();
    const docStatus = this.loanDataHolder.documentStatus.toString();
    this.showApprovalSheetInfo = docStatus !== 'APPROVED' && docStatus !== 'CLOSED' && docStatus !== 'REJECTED'
        && storage.roleType === 'COMMITTEE'
        && this.loanDataHolder.currentStage.toUser.id === Number(storage.userId);
  }

  public customSafePipe(val) {
    return val.replace(/(<([^>]+)>)/gi, ' ');
  }

  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    this.age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return this.age;
  }

  // method to get all the paths which is require to zipping all files
  public getDocPath(): void {
    const docPaths = [];
    if (this.loanDataHolder.zipPath === null || this.loanDataHolder.zipPath === '') {
      const loanDocument = this.loanDataHolder.customerDocument;
      for (const doc of loanDocument) {
        docPaths.push(doc.documentPath);
      }
      const generalDocument = this.loanDataHolder.loanHolder.customerGeneralDocuments;
      for (const doc of generalDocument) {
        docPaths.push(doc.docPath);
      }
      const guarantorDocument = this.taggedGuarantorWithDoc;
      for (const doc of guarantorDocument) {
        docPaths.push(doc.docPath);
      }
      const insuranceDocument = this.insuranceWithDoc;
      for (const doc of insuranceDocument) {
        docPaths.push(doc.policyDocumentPath);
      }
      // Collateral Document
      const siteVisitDocument = this.siteVisitDocuments;
      if (!ObjectUtil.isEmpty(siteVisitDocument)) {
        for (const doc of siteVisitDocument) {
          docPaths.push(doc.docPath.concat(doc.docName).concat('.jpg'));
        }
      }
    } else {
      docPaths.push(this.loanDataHolder.zipPath);
    }
    this.downloadAll(docPaths);
  }

  // method to make all files as a .zip file
  private downloadAll(documentUrls: string[]): void {
    const zip = new JSZip();
    let count = 0;
    const zipFilename = 'AllDocument.zip';
    const urls = [];
    if (documentUrls.length > 0) {
      documentUrls.map(d => {
        d = ApiConfig.URL + '/' + d;
        urls.push(d);
      });

      urls.forEach((url: string) => {
        const pathToZipFrom = new URL(url).pathname;
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, (err, data) => {
          if (err) {
            throw err; // or handle the error
          }
          zip.file(pathToZipFrom, data, {binary: true});
          count++;
          if (count === urls.length) {
            zip.generateAsync({type: 'blob'}).then(content => {
              importedSaveAs(content, zipFilename);
            });
          }
        });
      });
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Files has been downloaded!'));
    } else {
      this.toastService.show(new Alert(AlertType.ERROR, 'No file found!!!'));
    }
  }

  calculateEmiEqiAmount() {
    const proposedAmount = this.loanDataHolder.proposal.proposedLimit;
    const rate = Number(this.loanDataHolder.loan.interestRate) / (12 * 100);
    const n = this.loanDataHolder.proposal.tenureDurationInMonths;
    const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
    if (this.isRemitLoan) {
      this.dbr = emi / JSON.parse(this.loanDataHolder.remitCustomer.senderData).senderEmployment.monthly_salary;
    }
  }

  checkSiteVisitDocument(event: any) {
    this.siteVisitDocuments = event;
  }

  disable() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.paperProductChecklist)) {
      const obj = JSON.parse(this.loanDataHolder.paperProductChecklist);
      this.paperChecklist = obj.view;
      this.allIds = obj.id;
      const parserData = new DOMParser().parseFromString(this.paperChecklist, 'text/html');
      this.allIds.forEach(d => {
        const input = parserData.getElementById(d);
        const child = input.innerHTML;
        if (!child.includes('checked')) {
          input.innerHTML = `<input type="radio" disabled>`;
        }
      });
      this.paperChecklist = parserData.body.innerHTML;
    }
  }

  checkDocumentStatus() {
    if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED) ||
        this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.REJECTED) ||
        this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.CLOSED)) {
      this.hidePreviewButton = true;
      if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED)) {
        this.zipDocName = '-documents';
      } else if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.CLOSED)) {
        this.zipDocName = '-closed-documents';
      } else {
        this.zipDocName = '-rejected-documents';
      }
    } else {
      this.hidePreviewButton = false;
    }
  }
  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg', backdrop: true});
    modalRef.componentInstance.comments = comments;
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

