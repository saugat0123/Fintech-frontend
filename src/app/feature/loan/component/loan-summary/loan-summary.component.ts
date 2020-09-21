import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {User} from '../../../admin/modal/user';
import {Security} from '../../../admin/modal/security';
import {LoanDataHolder} from '../../model/loanData';
import {UserService} from '../../../../@core/service/user.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {DmsLoanService} from '../loan-main-template/dms-loan-file/dms-loan-service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {DmsLoanFile} from '../../../admin/modal/dms-loan-file';
import {ActionModel} from '../../model/action';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {ApprovalLimitService} from '../../../admin/component/approvallimit/approval-limit.service';
import {LoanStage} from '../../model/loanStage';
import {environment} from '../../../../../environments/environment';
import {DateService} from '../../../../@core/service/baseservice/date.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReadmoreModelComponent} from '../readmore-model/readmore-model.component';
import {LoanType} from '../../model/loanType';
import {BusinessType} from '../../../admin/modal/businessType';
import {Financial} from '../../model/financial';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {DocAction} from '../../model/docAction';
import {DocumentService} from '../../../admin/component/document/document.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';
import {Proposal} from '../../../admin/modal/proposal';
import {CombinedLoanService} from '../../../service/combined-loan.service';
import {CombinedLoan} from '../../model/combined-loan';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit, OnDestroy {

  client: string;

  docMsg;
  rootDocLength;
  dmsLoanFile: DmsLoanFile = new DmsLoanFile();
  loanConfig: LoanConfig = new LoanConfig();
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
  loanDataHolder: LoanDataHolder = new LoanDataHolder();
  loanType = LoanType;
  allId;
  customerId;
  loanConfigId;
  actionsList: ActionModel = new ActionModel();
  catalogueStatus = false;
  RootUrl = ApiConfig.URL;
  signatureList: Array<LoanStage> = new Array<LoanStage>();
  previousList: Array<LoanStage> = new Array<LoanStage>();
  currentDocAction = '';
  nepaliDate;
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
  navigationSubscription;
  securitySummary = false;
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
  noComplianceLoanAlpha = false;
  creditRiskAlphaSummary = false;
  alphaFiscalYearArray = [];
  creditRiskGradeAlphaArray = [];
  creditRiskAlphaScoreArray = [];
  selectedAlphaCrgIndex = 0;
  customerAllLoanList: LoanDataHolder[] = []; // current loan plus staged and combined loans

  constructor(
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
      private combinedLoanService: CombinedLoanService
  ) {
    this.client = environment.client;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.loadSummary();
      }
    });
  }

  ngOnInit() {
    this.loadSummary();
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  loadSummary() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.allId = {
            loanConfigId: null,
            customerId: null,
            catalogue: null
          };
          this.allId = paramsValue;
          this.customerId = this.allId.customerId;
          this.loanConfigId = this.allId.loanConfigId;
          if (this.allId.catalogue) {
            this.catalogueStatus = true;
          }
        });
    this.id = this.activatedRoute.snapshot.params['id'];
    this.loanConfigService.detail(this.loanConfigId).subscribe(
        (response: any) => {
          this.loanConfig = response.detail;
        }
    );
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
          this.actionsList.roleTypeMaker = this.user.role.roleType === 'MAKER';
        }
    );
    this.getLoanDataHolder();
  }

  getLoanDataHolder() {
    this.loanFormService.detail(this.customerId).subscribe(
        (response: any) => {

          this.loanDataHolder = response.detail;

          this.getAllLoans(this.loanDataHolder.loanHolder.id);

          // Setting financial data---
          if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
            this.financialData = this.loanDataHolder.financial;
            this.financialSummary = true;
          }

          // Setting Security data--
          if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
            this.securityData = JSON.parse(this.loanDataHolder.security.data);
            this.securitySummary = true;
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
            if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.crgGamma)) {
                this.crgGammaSummary = true;
                const crgParsedData = JSON.parse(this.loanDataHolder.loanHolder.crgGamma.data);
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

          // Setting credit risk alpha data---
          if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.creditRiskGradingAlpha)) {
            this.creditRiskAlphaSummary = true;
            const crgParsedData = JSON.parse(this.loanDataHolder.loanHolder.creditRiskGradingAlpha.data);
            this.alphaFiscalYearArray = crgParsedData.fiscalYearArray;
            if (this.alphaFiscalYearArray.length > 0) {
              this.selectedAlphaCrgIndex = this.alphaFiscalYearArray.length - 1;
            }
            if (crgParsedData.complianceOfCovenants === 0) {
              this.noComplianceLoanAlpha = true;
            }
            this.creditRiskGradeAlphaArray = crgParsedData.gradesArray;
            this.creditRiskAlphaScoreArray = crgParsedData.totalPointsArray;
            this.changeFiscalYearForAlpha(this.selectedAlphaCrgIndex);
          }

          // Setting SiteVisit data--
          if (!ObjectUtil.isEmpty(this.loanDataHolder.siteVisit)) {
            this.siteVisitData = JSON.parse(this.loanDataHolder.siteVisit.data);
            this.siteVisitSummary = true;
          }

          if (this.loanDataHolder.taggedGuarantors.length > 0) {
            console.log(this.loanDataHolder.taggedGuarantors);
            this.guarantorData = this.loanDataHolder.taggedGuarantors;
            this.checkGuarantorData = true;
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
          this.actionsList.approved = true;
          this.actionsList.sendForward = true;
          this.actionsList.edit = true;
          this.actionsList.sendBackward = true;
          this.actionsList.rejected = true;
          this.actionsList.closed = true;
          this.currentDocAction = this.loanDataHolder.currentStage.docAction.toString();
          if (this.loanDataHolder.createdBy.toString() === LocalStorageUtil.getStorage().userId) {
            this.actionsList.sendBackward = false;
            this.actionsList.edit = true;
            this.actionsList.approved = false;
            this.actionsList.closed = false;
          } else {
            this.actionsList.edit = false;
          }

          if (this.loanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
            this.actionsList.approved = false;
          } else {
            this.actionsList.closed = false;
          }

          this.loanActionService.getSendForwardList().subscribe((res: any) => {
            const forward = res.detail;
            if (forward.length === 0) {
              this.actionsList.sendForward = false;
            }
          });
          if (this.loanDataHolder.currentStage.docAction.toString() === 'APPROVED' ||
              this.loanDataHolder.currentStage.docAction.toString() === 'REJECT' ||
              this.loanDataHolder.currentStage.docAction.toString() === 'CLOSED') {
            this.actionsList.approved = false;
            this.actionsList.sendForward = false;
            this.actionsList.edit = false;
            this.actionsList.sendBackward = false;
            this.actionsList.rejected = false;
            this.actionsList.closed = false;
          }
          // commented code is for approval limit
          this.approvalLimitService.getLimitByRoleAndLoan(this.loanDataHolder.loan.id, this.loanDataHolder.loanCategory)
              .subscribe((res: any) => {
            if (res.detail === undefined) {
              this.actionsList.approved = false;
            } else {
              if (this.loanDataHolder.proposal !== null
                  && this.loanDataHolder.proposal.proposedLimit > res.detail.amount) {
                this.actionsList.approved = false;
              }
            }
          });
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
          this.dateService.getDateInNepali(this.loanDataHolder.createdAt.toString()).subscribe((nepDate: any) => {
            this.nepaliDate = nepDate.detail;
          });

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
        }
    );
  }

  getAllLoans(customerInfoId: number): void {
    const search = {
      loanHolderId: customerInfoId.toString(),
      isStaged: 'true'
    };
    this.customerLoanService.getAllWithSearch(search)
    .subscribe((res: any) => {
      this.customerAllLoanList = res.detail;
      // push current loan if not fetched from staged spec response
      if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
        this.customerAllLoanList.push(this.loanDataHolder);
      }
      // push loans from combined loan if not in the existing array
      const combinedLoans = this.customerAllLoanList
      .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan));
      if (combinedLoans.length > 0) {
        const combinedLoanId = combinedLoans[0].combinedLoan.id;
        this.combinedLoanService.detail(combinedLoanId).subscribe((response: any) => {
          (response.detail as CombinedLoan).loans.forEach((cl) => {
            const allLoanIds = this.customerAllLoanList.map((loan) => loan.id);
            if (!allLoanIds.includes(cl.id)) {
              this.customerAllLoanList.push(cl);
            }
          });
        }, err => {
          console.error(err);
        });
      }
    }, error => {
      console.error(error);
    });
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
          console.log(error1);
          console.log('Error downloading the file');
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
          console.log('Error downloading the file!');
        }
    );
  }

  downloadAllDocument(path: string) {

    this.documentService.downloadAllDoc(path).subscribe((res: any) => {
      this.previewOfferLetterDocument(res.detail, res.detail);
    });
  }

  loanHandler(index: number, length: number) {
    if (index === 0) {
      return 'INITIATED BY:';
    } else if (index === length - 1) {
      if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
        return 'APPROVED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'REJECTED') {
        return 'REJECTED BY:';
      } else if (this.loanDataHolder.documentStatus.toString() === 'CLOSED') {
        return 'CLOSED BY:';
      } else {
        return 'SUPPORTED BY:';
      }
    } else {
      return 'SUPPORTED BY:';
    }
  }

  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
    modalRef.componentInstance.comments = comments;
  }

  renewedOrCloseFrom(id) {
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: this.loanConfigId,
        customerId: id
      }
    });

    this.customerId = id;
    this.getLoanDataHolder();

  }

  previewOfferLetterDocument(url: string, name: string): void {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}`;
    link.download = name;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  /**
   * Changes Acting Fiscal year for Alpha CRG.
   *
   * @param $event Change event of nb-select.
   */
  public changeFiscalYearForAlpha($event: number) {
      if (!ObjectUtil.isEmpty(this.creditRiskAlphaScoreArray)) {
          this.creditRiskAlphaScore = ObjectUtil.isEmpty(this.creditRiskAlphaScoreArray[$event]) ? 0
              : this.creditRiskAlphaScoreArray[$event];
          this.creditRiskGradeAlpha = this.creditRiskGradeAlphaArray[$event];
          if (this.creditRiskGradeAlpha === 'Superior' || this.creditRiskGradeAlpha === 'Good') {
              this.creditGradeAlphaStatusBadge = 'badge badge-success';
          } else if (this.creditRiskGradeAlpha === 'Bad & Loss' || this.creditRiskGradeAlpha === 'Doubtful') {
              this.creditGradeAlphaStatusBadge = 'badge badge-danger';
          } else {
              this.creditGradeAlphaStatusBadge = 'badge badge-warning';
          }
      }
  }

  /**
   * Get array of loan stage for authority signature array.
   *
   * @param stages Array of loan stages that must include previous stages and current stage.
   */
  private getSignatureList(stages: Array<LoanStage>): Array<LoanStage> {
    let lastBackwardIndex = 0;
    stages.forEach((data, index) => {
      if (data.docAction.toString() === DocAction.value(DocAction.BACKWARD)) {
        lastBackwardIndex = index;
      }
    });
    if (lastBackwardIndex !== 0) {
      stages.splice(0, lastBackwardIndex + 1);
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
}

