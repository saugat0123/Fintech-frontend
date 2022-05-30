import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {User} from '../../../admin/modal/user';
import {Security} from '../../../admin/modal/security';
import {LoanDataHolder} from '../../model/loanData';
import {UserService} from '../../../../@core/service/user.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {DmsLoanService} from '../loan-main-template/dms-loan-file/dms-loan-service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {DmsLoanFile} from '../../../admin/modal/dms-loan-file';
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
import {ShareSecurity} from '../../../admin/modal/shareSecurity';
import {Proposal} from '../../../admin/modal/proposal';
import {CombinedLoanService} from '../../../service/combined-loan.service';
import {CombinedLoan} from '../../model/combined-loan';
import {NetTradingAssets} from '../../../admin/modal/NetTradingAssets';
import {CommonRoutingUtilsService} from '../../../../@core/utils/common-routing-utils.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ProductUtils} from '../../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {FiscalYearService} from '../../../admin/service/fiscal-year.service';
import {RouteConst} from '../../../credit-administration/model/RouteConst';
import {ApprovalSheetInfoComponent} from './approval-sheet-info/approval-sheet-info.component';
import {Clients} from '../../../../../environments/Clients';
import {
    CollateralSiteVisitService
} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ApprovalRoleHierarchyComponent} from '../../approval/approval-role-hierarchy.component';
import {DOCUMENT} from '@angular/common';
// tslint:disable-next-line:max-line-length
import {
    SiteVisitDocument
} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils/lib/index.js';
import {saveAs as importedSaveAs} from 'file-saver';
import {IndividualJsonData} from '../../../admin/modal/IndividualJsonData';
import {NgxSpinnerService} from 'ngx-spinner';
import {CustomerType} from '../../../customer/model/customerType';
import {DocStatus} from '../../model/docStatus';

@Component({
    selector: 'app-loan-summary',
    templateUrl: './loan-summary.component.html',
    styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit, OnDestroy {

    @Output() changeToApprovalSheetActive = new EventEmitter<string>();

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
    navigationSubscription;
    securitySummary = false;
    securityData: Object;
    approvedSecurityData: Object;
    approvedShareSecurityData: Object;
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

    disableApprovalSheetFlag = environment.disableApprovalSheet;
    roleType;
    showApprovalSheetInfo = false;
    notApprove = 'notApprove';

    sbsGroupEnabled = environment.SBS_GROUP;
    megaGroupEnabled = environment.MEGA_GROUP;
    commentsSummary = false;
    dataFromComments;
    previousSecuritySummary = false;
    dataFromPreviousSecurity;
    isJointInfo = false;
    jointInfo = [];
    newJointInfo = [];
    collateralSiteVisitDetail = [];
    isCollateralSiteVisit = false;
    age: number;
    isOpen: false;
    private dialogRef: NbDialogRef<any>;
    refId: number;
    securityId: number;
    siteVisitDocuments: Array<SiteVisitDocument>;
    isRemitLoan = false;
    beneficiary;
    dbr;
    individual;
    individualJsonData: IndividualJsonData;
    riskInfo;
    senderDetails;
    bankingRelation;
    isIndividual = false;
    naChecked: boolean;
    reviewDateData;
    multiBankingSummary = false;
    multiBankingData;
    requestedLoanType;
    initialSecurity = false;
    approvedSecurity = false;
    approvedSecurityAsProposed = false;
    checkedData;
    proposalAllData;
    financial;
    paperChecklist;
    allIds;
    citizen;
    hidePreviewButton = false;
    zipDocName;
    loaded = false;
    newSecurity = [];

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
        private collateralSiteVisitService: CollateralSiteVisitService,
        private nbDialogService: NbDialogService,
        private spinnerService: NgxSpinnerService
    ) {
        this.client = environment.client;
        this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.loadSummary();
            }
        });
    }

    consumerFinance = false;
    smallBusiness = false;

    ngOnInit() {
        if (this.loanConfig.loanTag === 'REMIT_LOAN' && this.loanConfig.isRemit) {
            this.isRemitLoan = true;
        }
        this.loanDataHolder = this.loanData;
        this.disable();
        if (this.loanDataHolder.loanHolder.clientType === 'CONSUMER_FINANCE') {
            this.consumerFinance = true;
        } else if (this.loanDataHolder.loanHolder.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES' && this.loanDataHolder.loanHolder.customerType === 'INSTITUTION') {
            this.smallBusiness = true;
        }
        if (this.loanDataHolder.loanCategory === 'INDIVIDUAL') {
            this.isIndividual = true;
        }
        this.individual = this.loanDataHolder.customerInfo;
        if (!ObjectUtil.isEmpty(this.individual)) {
            if (!ObjectUtil.isEmpty(this.individual.individualJsonData)) {
                this.individualJsonData = JSON.parse(this.individual.individualJsonData);
            }
        }
        if (this.loanDataHolder.loanCategory === 'INDIVIDUAL' &&
            !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
            if (this.loanDataHolder.customerInfo.jointInfo) {
                const jointCustomerInfo = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
                this.riskInfo = jointCustomerInfo;
                this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
                let innerCustomer = [];
                this.jointInfo[0].forEach((g, i) => {
                    innerCustomer.push(g);
                    if (!ObjectUtil.isEmpty(this.jointInfo[0][i + 1])) {
                        this.citizen = this.jointInfo[0][i + 1].citizenshipNumber;
                    }
                    if ((i + 1) % 2 === 0) {
                        if (innerCustomer.length > 0) {
                            this.newJointInfo.push(innerCustomer);
                        }
                        innerCustomer = [];
                    }
                    if (i === this.jointInfo[0].length - 1) {
                        if (innerCustomer.length > 0) {
                            this.newJointInfo.push(innerCustomer);
                        }
                        innerCustomer = [];
                    }
                });
                this.isJointInfo = true;
            }
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
            this.checkedData = JSON.parse(this.loanDataHolder.proposal.checkedData);
            this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
        }
        this.loadSummary();
        this.roleType = LocalStorageUtil.getStorage().roleType;
        this.checkDocUploadConfig();
        if (this.isRemitLoan) {
            this.beneficiary = JSON.parse(this.loanDataHolder.remitCustomer.beneficiaryData);
            this.senderDetails = JSON.parse(this.loanDataHolder.remitCustomer.senderData);
        }
        this.calculateEmiEqiAmount();
        if (!ObjectUtil.isEmpty(this.loanData.loanHolder.bankingRelationship)) {
            this.bankingRelation = JSON.parse(this.loanData.loanHolder.bankingRelationship);
        }
        // if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
        //     if (!ObjectUtil.isEmpty(this.loanDataHolder.security.data)) {
        //         this.initialSecurity = true;
        //     }
        // }
        this.checkDocumentStatus();
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
            if (ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)) {
                this.financial = JSON.parse(this.financialData.data);
            }
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
            this.netTradingAssetsData = this.loanDataHolder.loanHolder.netTradingAssets;
            this.netTradingAssetsSummary = true;
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

    getAllLoans(customerInfoId: number): void {
        const search = {
            loanHolderId: customerInfoId.toString(),
            isStaged: 'true'
        };
        this.customerLoanService.getAllWithSearch(search)
            .toPromise().then(async (res: any) => {
                this.customerAllLoanList = await res.detail;
                // push current loan if not fetched from staged spec response
                if (ObjectUtil.isEmpty(this.requestedLoanType)) {
                    if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
                        this.customerAllLoanList.push(this.loanDataHolder);
                    }
                    if ((this.loanDataHolder.documentStatus.toString() === 'APPROVED') || (this.loanDataHolder.documentStatus.toString() === 'CLOSED') || (this.loanDataHolder.documentStatus.toString() === 'REJECTED')) {
                        this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.id === this.loanDataHolder.id);
                    } else {
                        this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => ((c.currentStage.docAction !== 'CLOSED') && (c.currentStage.docAction !== 'REJECT')));
                    }
                } else {
                    this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => ((c.currentStage.docAction === this.requestedLoanType)));
                }
                // push loans from combined loan if not in the existing array
                const combinedLoans = this.customerAllLoanList
                    .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan));
                if (combinedLoans.length > 0) {
                    const combinedLoanId = combinedLoans[0].combinedLoan.id;
                    this.combinedLoanService.detail(combinedLoanId).toPromise().then((response: any) => {
                        (response.detail as CombinedLoan).loans.forEach((cl) => {
                            const allLoanIds = this.customerAllLoanList.map((loan) => loan.id);
                            if (!allLoanIds.includes(cl.id)) {
                                this.customerAllLoanList.push(cl);
                            }
                        });
                    }, err => {
                        console.error(err);
                    }).finally( () => {
                        this.loaded = true;
                    });
                } else {
                    this.loaded = true;
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

    open(comments) {
        const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
        modalRef.componentInstance.comments = comments;
    }

    renewedOrCloseFrom(id, loanId) {
        // this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
        //     if (value) {
        //         this.router.navigate(['/home/loan/summary'],
        //             {
        //                 queryParams: {
        //                     loanConfigId: loanId,
        //                     customerId: id
        //                 }
        //             });
        //     }
        // });
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

    goToCustomer() {
        const loanHolder = this.loanDataHolder.loanHolder;
        // this.commonRoutingUtilsService.loadCustomerProfile(loanHolder.associateId, loanHolder.id, loanHolder.customerType);
        if (CustomerType[loanHolder.customerType] === CustomerType.INDIVIDUAL) {
            window.open('/#/home/customer/profile/' + loanHolder.associateId + `?customerType=${loanHolder.customerType}&customerInfoId=${loanHolder.id}`, '_blank');
        } else if (CustomerType[loanHolder.customerType] === CustomerType.INSTITUTION) {
            window.open('/#/home/customer/company-profile/' + loanHolder.associateId + `?id=${loanHolder.id}&customerType=${loanHolder.customerType}&companyInfoId=${loanHolder.associateId}&customerInfoId=${loanHolder.id}`, '_blank');
        }
    }

    getFiscalYears() {
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYearArray = response.detail;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
        });
    }

    goToApprovalSheet() {
        this.changeToApprovalSheetActive.next();
    }

    SetRoleHierarchy(loanId: number) {
        let context;
        context = {
            approvalType: 'LOAN',
            refId: loanId,
            isRoleModal: true,
        };
        // @ts-ignore
        this.dialogRef = this.nbDialogService.open(ApprovalRoleHierarchyComponent, {
            context,
        }).onClose.subscribe((res: any) => {
            this.activatedRoute.queryParams.subscribe((res) => {
                this.loanConfigId = res.loanConfigId;
                this.customerId = res.customerId;
            });
            this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
                if (value) {
                    this.router.navigate(['/home/loan/summary'],
                        {
                            queryParams: {
                                loanConfigId: this.loanConfigId,
                                customerId: this.customerId,
                            }
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

    openApprovalSheetInfoModal() {
        const modal = this.modalService.open(ApprovalSheetInfoComponent, {size: 'lg'});
        modal.componentInstance.loanConfig = this.loanConfig;
        modal.componentInstance.loanDataHolder = this.loanData;
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
}

