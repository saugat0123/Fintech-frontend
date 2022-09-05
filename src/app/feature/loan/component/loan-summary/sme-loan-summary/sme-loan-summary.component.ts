import {DOCUMENT} from '@angular/common';
import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Clients} from '../../../../../../environments/Clients';
import {environment} from '../../../../../../environments/environment';
import {DateService} from '../../../../../@core/service/baseservice/date.service';
import {ToastService} from '../../../../../@core/utils';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {CommonRoutingUtilsService} from '../../../../../@core/utils/common-routing-utils.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {DocumentService} from '../../../../admin/component/document/document.service';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {UserService} from '../../../../admin/component/user/user.service';
import {BusinessType} from '../../../../admin/modal/businessType';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {NetTradingAssets} from '../../../../admin/modal/NetTradingAssets';
import {Proposal} from '../../../../admin/modal/proposal';
import {ShareSecurity} from '../../../../admin/modal/shareSecurity';
import {User} from '../../../../admin/modal/user';
import {FiscalYearService} from '../../../../admin/service/fiscal-year.service';
import {ProductUtils} from '../../../../admin/service/product-mode.service';
import {RouteConst} from '../../../../credit-administration/model/RouteConst';
import {
  CollateralSiteVisitService
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {
  SiteVisitDocument
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {CombinedLoanService} from '../../../../service/combined-loan.service';
import {LoanActionService} from '../../../loan-action/service/loan-action.service';
import {CombinedLoan} from '../../../model/combined-loan';
import {Financial} from '../../../model/financial';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanStage} from '../../../model/loanStage';
import {LoanType} from '../../../model/loanType';
import {Security} from '../../../model/security';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {DmsLoanService} from '../../loan-main-template/dms-loan-file/dms-loan-service';
import {ReadmoreModelComponent} from '../../readmore-model/readmore-model.component';
// tslint:disable-next-line:max-line-length
import * as JSZipUtils from 'jszip-utils/lib/index.js';
import {saveAs as importedSaveAs} from 'file-saver';
import * as JSZip from 'jszip';
import {DocStatus} from '../../../model/docStatus';
import {NgxSpinnerService} from 'ngx-spinner';
import {ApprovalRoleHierarchyComponent} from '../../../approval/approval-role-hierarchy.component';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {CustomerCategory} from '../../../../customer/model/customerCategory';

@Component({
  selector: 'app-sme-loan-summary',
  templateUrl: './sme-loan-summary.component.html',
  styleUrls: ['./sme-loan-summary.component.scss'],
})
export class SmeLoanSummaryComponent implements OnInit, OnDestroy {

  @Input() loanData;
  loanDataHolder: LoanDataHolder;

  @Input()
  loanConfig: LoanConfig = new LoanConfig();

  @Input() nepaliDate;
  hasMissingDeferredDocs = false;

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
  previousList: Array<LoanStage> = new Array<LoanStage>();
  currentDocAction = '';
  loanCategory;
  @ViewChild('print', {static: false}) print;
  businessType = BusinessType;
  financialData: Financial = new Financial();
  shareSecurityData: ShareSecurity = new ShareSecurity();
  proposalData: Proposal;
  proposalView: any;
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
    name: string;
    url: string;
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
  // noComplianceLoanAlpha = false;
  creditRiskAlphaSummary = false;
  /*alphaFiscalYearArray = [];
    creditRiskGradeAlphaArray = [];
    creditRiskAlphaScoreArray = [];
    selectedAlphaCrgIndex = 0;*/

  creditRiskLambdaSummary = false;
  creditRiskLambdaScore = 0;
  creditRiskGradeLambda;
  creditRiskRatingLambda;
  creditRiskLambdaPremium;
  creditGradeLambdaStatusBadge;

  customerAllLoanList: LoanDataHolder[] = []; // current loan plus staged and combined loans
  incomeFromAccountSummary = false;
  incomeFromAccountData;
  netTradingAssetsSummary = false;
  netTradingAssetsData: NetTradingAssets;
  minOneInsuranceDoc = false;
  minOneGuarantorDoc = false;
  taggedGuarantorWithDoc = [];
  insuranceWithDoc = [];
  showCadDoc = false;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  fiscalYearArray = [];

  roleType;
  notApprove = 'notApprove';

  sbsGroupEnabled = environment.SBS_GROUP;
  commentsSummary = false;
  dataFromComments;
  previousSecuritySummary = false;
  dataFromPreviousSecurity;
  isJointInfo = false;
  jointInfo = [];
  collateralSiteVisitDetail = [];
  isCollateralSiteVisit = false;
  age: number;
  isOpen: false;
  private dialogRef: NbDialogRef<any>;
  refId: number;
  securityId: number;
  siteVisitDocuments: Array<SiteVisitDocument>;
  requestedLoanType;
  @Output() customerLoanList = new EventEmitter();
  companyInfoJson: Array<any>;
  hidePreviewButton = false;
  zipDocumentName: any;

  isAboveTenMillion = false;
  isUpToTenMillion = false;
  isDetailedView = false;
  isSaneView = false;
  isDslWholesale = false;
  radioSelected: any;
  viewName = ['Sana Byabasahi Karja', 'Upto Ten Million', 'Above Ten Million'];
  tempData;
  companyInfo: CompanyInfo = new CompanyInfo();
  customerCategory = CustomerCategory;
  totalProposedLimit = 0;
  loaded = false;
  customerCategoryType = CustomerCategory.SANA_BYABASAYI;
  ccblData: any;
  fixedAssetsData = [];
  isExecutive = false;

  @Input() crgTotalRiskScore: any;
  data;
  approveAuth;
  spinner = false;
  lastDateOfInspection;
  isUptoTwoMillion = false;

  constructor(
      @Inject(DOCUMENT) private _document: Document,
      private userService: UserService,
      private loanFormService: LoanFormService,
      private loanActionService: LoanActionService,
      private dmsLoanService: DmsLoanService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private loanConfigService: LoanConfigService,
      private dateService: DateService,
      private modalService: NgbModal,
      private documentService: DocumentService,
      private customerLoanService: LoanFormService,
      private combinedLoanService: CombinedLoanService,
      private commonRoutingUtilsService: CommonRoutingUtilsService,
      private toastService: ToastService,
      private fiscalYearService: FiscalYearService,
      private collateralSiteVisitService: CollateralSiteVisitService,
      private nbDialogService: NbDialogService,
      private ngxSpinner: NgxSpinnerService
  ) {
    this.client = environment.client;
    this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.loadSummary();
      }
    });
  }

  ngOnInit() {
    this.loanDataHolder = this.loanData;
   this.data = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
    if (!ObjectUtil.isEmpty(this.data)) {
      this.approveAuth = this.data.approvingAuthority;
    }
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.companyInfo = this.loanData.companyInfo;
      this.tempData = JSON.parse(this.companyInfo.companyJsonData);
    }
    this.checkCustomerCategoryForDetailView();
    this.loadSummary();
    this.roleType = LocalStorageUtil.getStorage().roleType;
    this.checkDocUploadConfig();
    this.getCompanyAccountNo();
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.siteVisit)) {
      const data = JSON.parse(this.loanDataHolder.loanHolder.siteVisit.data);
      if (data.currentResidentFormChecked) {
        this.lastDateOfInspection = data.currentResidentDetails[data.currentResidentDetails.length - 1].dateOfVisit;
      }
    }

  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  loadSummary() {
    this.getLoanDataHolder();
  }

  getLoanDataHolder() {
    this.getAllLoans(this.loanDataHolder.loanHolder.id);

    // Setting financial data---
    if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
      this.financialData = this.loanDataHolder.financial;
      this.financialSummary = true;
    }

    // Setting Security data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
      this.securityId = this.loanDataHolder.security.id;
      this.securityData = JSON.parse(this.loanDataHolder.security.data);
      if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
        this.fixedAssetsData = this.loanDataHolder.collateralSiteVisits;
      } else {
        if (this.securityData['selectedArray'] !== undefined) {
          // land security
          this.securityData['selectedArray'].filter(f => {
            if (f.indexOf('LandSecurity') !== -1) {
              this.securityData['initialForm']['landDetails'].forEach((ld, index) => {
                this.getFixedAssetsCollateral('Land Security ' + (index + 1),
                    this.securityId, ld.uuid);
              });
            }
          });
          // apartment security
          this.securityData['selectedArray'].filter(f => {
            if (f.indexOf('ApartmentSecurity') !== -1) {
              this.securityData['initialForm']['buildingDetails'].forEach((appart, ind) => {
                this.getFixedAssetsCollateral('Apartment Security ' + (ind + 1),
                    this.securityId, appart.uuid);
              });
            }
          });
          // land and building security
          this.securityData['selectedArray'].filter(f => {
            if (f.indexOf('Land and Building Security') !== -1) {
              this.securityData['initialForm']['landBuilding'].forEach((ld, index) => {
                this.getFixedAssetsCollateral('Land And Building Security ' + (index + 1),
                    this.securityId, ld.uuid);
              });
            }
          });
        }
      }
      this.securitySummary = true;
    }

    if (!ObjectUtil.isEmpty(this.loanDataHolder.insurance)) {
      this.loanDataHolder.insurance.forEach((value) => {
        if (value.policyDocumentPath) {
          this.insuranceWithDoc.push(value);
          this.minOneInsuranceDoc = true;
        }
      });
    }

    // Setting IncomeFromAccount data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.incomeFromAccount)) {
      this.incomeFromAccountData =
          this.loanDataHolder.loanHolder.incomeFromAccount;
      this.incomeFromAccountSummary = true;
    }
    // Setting Comments data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
      this.dataFromComments = JSON.parse(this.loanDataHolder.loanHolder.data);
      this.commentsSummary = true;
    }

    // Setting Previous Security Data
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
      this.dataFromPreviousSecurity = JSON.parse(
          this.loanDataHolder.loanHolder.data
      );
      this.previousSecuritySummary = true;
    }

    // Setting NetTradingAssets data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.netTradingAssets)) {
      this.netTradingAssetsData =
          this.loanDataHolder.loanHolder.netTradingAssets;
      this.netTradingAssetsSummary = true;
    }

    // Setting credit risk data---
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.creditRiskGrading)) {
      this.creditRiskSummary = true;
      const crgParsedData = JSON.parse(
          this.loanDataHolder.loanHolder.creditRiskGrading.data
      );
      if (crgParsedData.complianceOfCovenants === 0) {
        this.noComplianceLoan = true;
      }
      this.creditRiskGrade = crgParsedData.grade;
      this.creditRiskScore = ObjectUtil.isEmpty(crgParsedData.totalPoint)
          ? 0
          : crgParsedData.totalPoint;
      if (
          this.creditRiskGrade === 'Superior' ||
          this.creditRiskGrade === 'Good'
      ) {
        this.creditGradeStatusBadge = 'badge badge-success';
      } else if (
          this.creditRiskGrade === 'Bad & Loss' ||
          this.creditRiskGrade === 'Doubtful'
      ) {
        this.creditGradeStatusBadge = 'badge badge-danger';
      } else {
        this.creditGradeStatusBadge = 'badge badge-warning';
      }
    }

    // Setting credit risk GAMMA data---
    // DO not Remove
    // if (!ObjectUtil.isEmpty(this.loanDataHolder.crgGamma)) {
    //   this.crgGammaSummary = true;
    //   const crgParsedData = JSON.parse(this.loanDataHolder.crgGamma.data);
    //   this.crgGammaGrade = crgParsedData.grade;
    //   this.crgGammaScore = ObjectUtil.isEmpty(crgParsedData.totalPoint)
    //     ? 0
    //     : crgParsedData.totalPoint;
    //   if (this.crgGammaGrade === 'Superior' || this.crgGammaGrade === 'Good') {
    //     this.crgGammaGradeStatusBadge = 'badge badge-success';
    //   } else if (
    //     this.crgGammaGrade === 'Bad & Loss' ||
    //     this.crgGammaGrade === 'Doubtful'
    //   ) {
    //     this.crgGammaGradeStatusBadge = 'badge badge-danger';
    //   } else {
    //     this.crgGammaGradeStatusBadge = 'badge badge-warning';
    //   }
    // }


    // Setting SiteVisit data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.siteVisit)) {
      this.siteVisitData = JSON.parse(this.loanDataHolder.siteVisit.data);
      this.siteVisitSummary = true;
    }

    if (this.loanDataHolder.taggedGuarantors.length > 0) {
      this.guarantorData = this.loanDataHolder.taggedGuarantors;
      this.checkGuarantorData = true;
      this.loanDataHolder.taggedGuarantors.forEach((value) => {
        if (!ObjectUtil.isEmpty(value.docPath)) {
          this.taggedGuarantorWithDoc.push(value);
          this.minOneGuarantorDoc = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal;
      this.proposalView = JSON.parse(this.proposalData.data);
      this.proposalSummary = true;
    }

    // setting share-secuirty data--
    if (!ObjectUtil.isEmpty(this.loanDataHolder.shareSecurity)) {
      this.shareSecuritySummary = true;
      this.shareSecurityData = JSON.parse(this.loanDataHolder.shareSecurity.data);
    }
    this.loanCategory = this.loanDataHolder.loanCategory;
    this.currentIndex = this.loanDataHolder.previousList.length;
    this.previousList = this.loanDataHolder.previousList;
    this.currentDocAction =
        this.loanDataHolder.currentStage.docAction.toString();
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
        this.docMsg =
            filledDocLength +
            ' out of ' +
            this.rootDocLength +
            ' document has been uploaded';
      }
    }

    // Offer Letter Documents
    if (
        this.loanDataHolder.customerOfferLetter &&
        this.loanDataHolder.customerOfferLetter.customerOfferLetterPath
    ) {
      this.loanDataHolder.customerOfferLetter.customerOfferLetterPath.forEach(
          (offerLetterPath) => {
            if (
                offerLetterPath.path &&
                !this.registeredOfferLetters.includes(
                    offerLetterPath.offerLetter.name
                )
            ) {
              this.registeredOfferLetters.push(offerLetterPath.offerLetter.name);
              this.offerLetterDocuments.push({
                name: offerLetterPath.offerLetter.name,
                url: offerLetterPath.path,
              });
            }
          }
      );
    }
    // getting fiscal years
    this.getFiscalYears();

    if (this.loanDataHolder.loanHolder.crgCcbl) {
      this.ccblData = JSON.parse(this.loanDataHolder.loanHolder.crgCcbl);
    }
  }

  getAllLoans(customerInfoId: number) {
    const search = {
      loanHolderId: customerInfoId.toString(),
      isStaged: 'true',
    };
    this.customerLoanService.getAllWithSearch(search).toPromise().then((res: any) => {
          this.loaded = true;
          this.customerAllLoanList = res.detail;
          // push current loan if not fetched from staged spec response
          if (ObjectUtil.isEmpty(this.requestedLoanType)) {
            if (
                this.customerAllLoanList.filter(
                    (l) => l.id === this.loanDataHolder.id
                ).length < 1
            ) {
              this.customerAllLoanList.push(this.loanDataHolder);
            }
            if (
                this.loanDataHolder.documentStatus.toString() === 'APPROVED' ||
                this.loanDataHolder.documentStatus.toString() === 'CLOSED' ||
                this.loanDataHolder.documentStatus.toString() === 'REJECTED'
            ) {
              this.customerAllLoanList = this.customerAllLoanList.filter(
                  (c: any) => c.id === this.loanDataHolder.id
              );
            } else {
              this.customerAllLoanList = this.customerAllLoanList.filter(
                  (c: any) =>
                      c.documentStatus.toString() !== 'CLOSED' &&
                      c.documentStatus.toString() !== 'REJECT' &&
                      c.documentStatus.toString() !== 'APPROVED'
              );
            }
          } else {
            this.customerAllLoanList = this.customerAllLoanList.filter(
                (c: any) => c.currentStage.docAction === this.requestedLoanType
            );
          }
          // push loans from combined loan if not in the existing array
          const combinedLoans = this.customerAllLoanList.filter(
              (l) => !ObjectUtil.isEmpty(l.combinedLoan)
          );
          if (combinedLoans.length > 0) {
            this.loaded = false;
            const combinedLoanId = combinedLoans[0].combinedLoan.id;
            this.combinedLoanService.detail(combinedLoanId).toPromise().then(
                (response: any) => {
                  (response.detail as CombinedLoan).loans.forEach((cl) => {
                    const allLoanIds = this.customerAllLoanList.map(
                        (loan) => loan.id
                    );
                    if (!allLoanIds.includes(cl.id)) {
                      this.customerAllLoanList.push(cl);
                    }
                    this.calculateTotalProposedLimit(this.customerAllLoanList);
                    this.loaded = true;
                  });
                },
                (err) => {
                  console.error(err);
                }
            );
          } else {
            this.calculateTotalProposedLimit(this.customerAllLoanList);
          }
          this.customerLoanList.emit(this.customerAllLoanList);
        },
        (error) => {
          console.error(error);
        }
    );
  }

  calculateTotalProposedLimit(customerAllLoanList: LoanDataHolder[]) {
    this.totalProposedLimit = 0;
    customerAllLoanList.forEach(cl => {
      this.totalProposedLimit += cl.proposal.proposedLimit;
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
        (error1) => {
          this.toastService.show(
              new Alert(AlertType.ERROR, error1.error.message)
          );
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
        (error) => {
          console.log(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'File not Found'));
        }
    );
  }

  downloadAllDocument(path: string) {
    path = '/doc';
    this.documentService.downloadAllDoc(path, this.loanDataHolder.id).subscribe(
        (res: any) => {
          this.previewOfferLetterDocument(res.detail, res.detail);
        },
        (error) =>
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message))
    );
  }

  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.comments = comments;
  }

  renewedOrCloseFrom(id, loanId) {
    this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then((value) => {
      if (value) {
        this.router.navigate(['/home/loan/summary'], {
          queryParams: {
            loanConfigId: loanId,
            customerId: id,
          },
        });
      }
    });

    this.customerId = id;
    this.getLoanDataHolder();
  }

  previewOfferLetterDocument(url: string, name: string): void {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}?${
        Math.floor(Math.random() * 100) + 1
    }`;
    link.download = name;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  /**
   * Changes Acting Fiscal year for Alpha CRG.
   *
   * @param $event Change event of nb-select.
   */

  /*public changeFiscalYearForAlpha($event: number) {
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
    }*/
  goToCustomer() {
    const loanHolder = this.loanDataHolder.loanHolder;
    this.commonRoutingUtilsService.loadCustomerProfile(
        loanHolder.associateId,
        loanHolder.id,
        loanHolder.customerType
    );
  }

  getFiscalYears() {
    this.fiscalYearService.getAll().subscribe(
        (response) => {
          this.fiscalYearArray = response.detail;
        },
        (error) => {
          console.log(error);
          this.toastService.show(
              new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!')
          );
        }
    );
  }

  SetRoleHierarchy(loanId: number) {
    let context;
    context = {
      approvalType: 'LOAN',
      refId: loanId,
      isRoleModal: true,
    };
    // @ts-ignore
    this.dialogRef = this.nbDialogService
      .open(ApprovalRoleHierarchyComponent, {
        context,
      })
      .onClose.subscribe((res: any) => {
          // tslint:disable-next-line:no-shadowed-variable
        this.activatedRoute.queryParams.subscribe((res) => {
          this.loanConfigId = res.loanConfigId;
          this.customerId = res.customerId;
        });
        this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then((value) => {
          if (value) {
            this.router.navigate(['/home/loan/summary'], {
              queryParams: {
                loanConfigId: this.loanConfigId,
                customerId: this.customerId,
              },
            });
          }
        });
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
  }

  public customSafePipe(val) {
    return val.replace(/(<([^>]+)>)/gi, ' ');
  }

  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    this.age = Math.floor(difference / (1000 * 3600 * 24) / 365);
    return this.age;
  }

  // method to get all the paths which is require to zipping all files
  public getDocPath(): void {
    const docPaths = [];
    if (
        this.loanDataHolder.zipPath === null ||
        this.loanDataHolder.zipPath === ''
    ) {
      const loanDocument = this.loanDataHolder.customerDocument;
      for (const doc of loanDocument) {
        docPaths.push(doc.documentPath);
      }
      const generalDocument =
          this.loanDataHolder.loanHolder.customerGeneralDocuments;
      for (const doc of generalDocument) {
        docPaths.push(doc.docPath);
      }
      const guarantorDocument = this.taggedGuarantorWithDoc;
      for (const g of guarantorDocument) {
        for (const doc of g.docPath.split(',')) {
          docPaths.push(doc);
        }
      }
      const insuranceDocument = this.insuranceWithDoc;
      for (const i of insuranceDocument) {
        for (const doc of i.policyDocumentPath.split(',')) {
          docPaths.push(doc);
        }
      }
      const siteVisitDocument = this.siteVisitDocuments;
      if (!ObjectUtil.isEmpty(this.siteVisitDocuments)) {
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
      documentUrls.map((d) => {
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
            zip.generateAsync({type: 'blob'}).then((content) => {
              importedSaveAs(content, zipFilename);
            });
          }
        });
      });
      this.toastService.show(
          new Alert(AlertType.SUCCESS, 'Files has been downloaded!')
      );
    } else {
      this.toastService.show(new Alert(AlertType.ERROR, 'No file found!!!'));
    }
  }

  checkSiteVisitDocument(event: any) {
    this.siteVisitDocuments = event;
  }

  getCompanyAccountNo() {
    const companyInfoJson = JSON.parse(
        this.loanDataHolder.companyInfo.companyJsonData
    );
    this.companyInfoJson = companyInfoJson.accountDetails;
    // for (let x in companyInfoJson.accountDetails) {
    //     this.companyInfoJson = x.accountNo
    // }
  }

  checkDocumentStatus() {
    if (
        this.loanDataHolder.documentStatus.toString() ===
        DocStatus.value(DocStatus.APPROVED) ||
        this.loanDataHolder.documentStatus.toString() ===
        DocStatus.value(DocStatus.REJECTED) ||
        this.loanDataHolder.documentStatus.toString() ===
        DocStatus.value(DocStatus.CLOSED)
    ) {
      this.hidePreviewButton = true;
      if (
          this.loanDataHolder.documentStatus.toString() ===
          DocStatus.value(DocStatus.APPROVED)
      ) {
        this.zipDocumentName = '-approved-documents';
      } else if (
          this.loanDataHolder.documentStatus.toString() ===
          DocStatus.value(DocStatus.CLOSED)
      ) {
        this.zipDocumentName = '-closed-documents';
      } else {
        this.zipDocumentName = '-rejected-documents';
      }
    } else {
      this.hidePreviewButton = false;
    }
  }

  checkCustomerCategoryForDetailView() {
    if (this.loanDataHolder.loanHolder.customerCategory.toString() === 'SME_ABOVE_TEN_MILLION' ||
        this.loanDataHolder.loanHolder.customerCategory.toString() === 'AGRICULTURE_ABOVE_TEN_MILLION') {
      this.isAboveTenMillion = true;
      this.isDetailedView = true;
    } else if (this.loanDataHolder.loanHolder.customerCategory.toString() === 'DSL_WHOLE_SALE') {
      this.isDslWholesale = true;
    } else if (this.loanDataHolder.loanHolder.customerCategory.toString() === 'SME_UPTO_TEN_MILLION' ||
        this.loanDataHolder.loanHolder.customerCategory.toString() === 'AGRICULTURE_TWO_TO_TEN_MILLION') {
      this.isUpToTenMillion = true;
      this.isDetailedView = true;
    } else if (this.loanDataHolder.loanHolder.customerCategory.toString() === 'AGRICULTURE_UPTO_TWO_MILLION') {
      this.isUptoTwoMillion = true;
    } else {
      this.isSaneView = true;
      this.isDetailedView = true;
    }
  }

  getFixedAssetsCollateral(securityName: string, securityId: number, uuid: string) {
    const collateral = {
      securityName: null,
      collateralData: null,
    };
    this.collateralSiteVisitService.getCollateralByUUID(securityName, securityId, uuid)
        .subscribe((response: any) => {
          if (response.detail.length > 0) {
            collateral.securityName = securityName;
            collateral.collateralData = response.detail;
            this.fixedAssetsData.push(collateral);
          }
        }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, `Unable to load site visit info of ${securityName}`));
        });

  }
}
