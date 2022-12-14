import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../model/loanData';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {CommonRoutingUtilsService} from '../../../../@core/utils/common-routing-utils.service';
import {environment} from '../../../../../environments/environment';
import {RouteConst} from '../../../credit-administration/model/RouteConst';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LoanStage} from '../../model/loanStage';
import {LoanType} from '../../model/loanType';
import {CombinedLoan} from '../../model/combined-loan';
import {DmsLoanFile} from '../../../admin/modal/dms-loan-file';
import {User} from '../../../admin/modal/user';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {BusinessType} from '../../../admin/modal/businessType';
import {Financial} from '../../model/financial';
import {Proposal} from '../../../admin/modal/proposal';
import {NetTradingAssets} from '../../../admin/modal/NetTradingAssets';
import {ProductUtils} from '../../../admin/service/product-mode.service';
import {UserService} from '../../../../@core/service/user.service';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {DmsLoanService} from '../loan-main-template/dms-loan-file/dms-loan-service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ApprovalLimitService} from '../../../admin/component/approvallimit/approval-limit.service';
import {DateService} from '../../../../@core/service/baseservice/date.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentService} from '../../../admin/component/document/document.service';
import {CombinedLoanService} from '../../../service/combined-loan.service';
import {ToastService} from '../../../../@core/utils';
import {FiscalYearService} from '../../../admin/service/fiscal-year.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ReadmoreModelComponent} from '../readmore-model/readmore-model.component';
import {DocAction} from '../../model/docAction';
import {Security} from '../../../admin/modal/security';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';
import {Clients} from '../../../../../environments/Clients';
import {CollateralSiteVisitService} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ApprovalRoleHierarchyComponent} from '../../approval/approval-role-hierarchy.component';
import {CustomerType} from '../../../customer/model/customerType';
import {MicroCustomerType} from '../../../../@core/model/enum/micro-customer-type';
import {CustomerInfoData} from '../../model/customerInfoData';

@Component({
    selector: 'app-micro-loan-summary',
    templateUrl: './micro-loan-summary.component.html',
    styleUrls: ['./micro-loan-summary.component.scss']
})
export class MicroLoanSummaryComponent implements OnInit, OnDestroy {
    @Output() changeToApprovalSheetActive = new EventEmitter<string>();
    @Input() loanData;
    loanDataHolder: LoanDataHolder;
    customerInfoData: CustomerInfoData;

    @Input()
    loanConfig: LoanConfig = new LoanConfig();

    @Input() nepaliDate;

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

    crgMicroSummary = false;
    crgMicroScore = 0;
    crgMicroGrade;
    crgMicroRating;
    crgMicroPremium;
    crgMicroStatusBadge;

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
    synopsis = false;
    baselRiskExposure = false;
    borrowerPortfolio = false;
    marketingActivity = false;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    fiscalYearArray = [];

    disableApprovalSheetFlag = environment.disableApprovalSheet;
    roleType;
    synopsisCreditWorthiness;
    baselWiseRiskExposure;
    customerType: string;
    borrowerPortfolioDetail;
    marketingActivityDetail;
    collateralSiteVisitDetail = [];
    isCollateralSiteVisit = false;
    commentsSummary = false;
    dataFromComments;
    previousSecuritySummary = false;
    dataFromPreviousSecurity;
    private dialogRef: NbDialogRef<any>;
    isOpen: false;
    securityId: number;
    isMicroCustomer: boolean;


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
        private combinedLoanService: CombinedLoanService,
        private commonRoutingUtilsService: CommonRoutingUtilsService,
        private toastService: ToastService,
        private fiscalYearService: FiscalYearService,
        private collateralSiteVisitService: CollateralSiteVisitService,
        private nbDialogService: NbDialogService,
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
        this.customerInfoData = this.loanDataHolder.loanHolder;
        this.loadSummary();
        this.roleType = LocalStorageUtil.getStorage().roleType;
        this.customerType = this.loanDataHolder.loanHolder.customerType;
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.synopsisCreditworthiness)) {
            this.synopsisCreditWorthiness = this.loanDataHolder.loanHolder.synopsisCreditworthiness;
            this.synopsis = true;
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.microBaselRiskExposure)) {
            this.baselWiseRiskExposure = this.loanDataHolder.loanHolder.microBaselRiskExposure;
            this.baselRiskExposure = true;
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.borrowerPortFolio)) {
            this.borrowerPortfolioDetail = this.loanDataHolder.loanHolder.borrowerPortFolio;
            this.borrowerPortfolio = true;
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.marketingActivities)) {
            this.marketingActivityDetail = this.loanDataHolder.loanHolder.marketingActivities;
            this.marketingActivity = true;
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
            this.securityId = this.loanDataHolder.security.id;
        }
    }

    ngOnDestroy(): void {
        this.navigationSubscription.unsubscribe();
    }

    loadSummary() {
        this.getLoanDataHolder();
    }

    getLoanDataHolder() {
        if (this.loanDataHolder.loanHolder.customerType === CustomerType.INSTITUTION) {
            this.isMicroCustomer = this.loanDataHolder.companyInfo.isMicroCustomer;
        } else {
            this.isMicroCustomer = this.loanDataHolder.customerInfo.isMicroCustomer;
        }
        this.getAllLoans(this.loanDataHolder.loanHolder.id);

        // Setting micro financial data---
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.microOtherParameters)) {
            this.financialData = this.loanDataHolder.loanHolder.microOtherParameters;
            this.financialSummary = true;
        }

        // Setting Security data--
        if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
            this.securityData = JSON.parse(this.loanDataHolder.security.data);
            this.securitySummary = true;
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

        // Setting NetTradingAssets data--
        if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.netTradingAssets)) {
            this.netTradingAssetsData = this.loanDataHolder.loanHolder.netTradingAssets;
            this.netTradingAssetsSummary = true;
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
            this.crgGammaScore = ObjectUtil.isEmpty(crgParsedData.totalPoint.toFixed(2)) ? 0 : crgParsedData.totalPoint.toFixed(2);
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

        // Setting CRG- Micro data --
        if (!ObjectUtil.isEmpty(this.loanDataHolder.crgMicro)) {
            const crgParsedData = JSON.parse(this.loanDataHolder.crgMicro.data);
            this.crgMicroPremium = crgParsedData.premium;
            this.crgMicroSummary = true;
            this.crgMicroRating = crgParsedData.creditRiskRating;
            this.crgMicroGrade = crgParsedData.creditRiskGrade;
            this.crgMicroScore = ObjectUtil.isEmpty(crgParsedData.totalScore) || Number.isNaN(Number(crgParsedData.totalScore)) ?
                0 : crgParsedData.totalScore;
            if (this.crgMicroGrade === 'Excellent' || this.crgMicroGrade === 'Very Good') {
                this.creditGradeLambdaStatusBadge = 'badge badge-success';
            } else if (this.crgMicroGrade === 'Reject') {
                this.crgMicroStatusBadge = 'badge badge-danger';
            } else {
                this.crgMicroStatusBadge = 'badge badge-warning';
            }
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
        // getting fiscal years
        this.getFiscalYears();
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
    open(comments) {
        const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
        modalRef.componentInstance.comments = comments;
    }

    renewedOrCloseFrom(id, loanId) {
        this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
            if (value) {
                this.router.navigate(['/home/loan/summary'],
                    {
                        queryParams: {
                            loanConfigId: loanId,
                            customerId: id
                        }
                    });
            }
        });

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

    goToCustomer() {
        const loanHolder = this.loanDataHolder.loanHolder;
        this.commonRoutingUtilsService.loadCustomerProfile(loanHolder.associateId, loanHolder.id, loanHolder.customerType);
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

    setRoleHierarchy(loanId: number) {
        let context;
        context = {
            approvalType: 'LOAN',
            refId: loanId,
            isRoleModal: true
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
                    this.router.navigate(['/home/loan/summary'], {
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

    public customSafePipe(val) {
        return val.replace(/(<([^>]+)>)/gi, ' ');
    }

    get otherMicroDetailsVisibility() {
        if (this.customerInfoData.customerType === CustomerType.INDIVIDUAL && this.isMicroCustomer) {
            return true;
        } else {
            return this.customerInfoData.customerType === CustomerType.INSTITUTION && this.isMicroCustomer &&
                this.loanDataHolder.companyInfo.microCustomerType === MicroCustomerType.DIRECT;
        }
    }

}
