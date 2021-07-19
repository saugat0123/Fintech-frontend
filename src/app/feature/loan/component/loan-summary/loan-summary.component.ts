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
import {environment as envSrdb} from '../../../../../environments/environment.srdb';
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
import {CollateralSiteVisitService} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ApprovalRoleHierarchyComponent} from '../../approval/approval-role-hierarchy.component';
import {DOCUMENT} from '@angular/common';
// tslint:disable-next-line:max-line-length
import {SiteVisitDocument} from '../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {flatten} from '@angular/compiler';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils/lib/index.js';
import {saveAs as importedSaveAs} from 'file-saver';

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
    collateralSiteVisitDetail = [];
    isCollateralSiteVisit = false;
    age: number;
   isOpen: false;
   private dialogRef: NbDialogRef<any>;
   refId: number;
    securityId: number;
    siteVisitDocuments: Array<SiteVisitDocument>;


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
        if (this.loanDataHolder.loanCategory === 'INDIVIDUAL' &&
            !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.jointInfo)) {
            const jointCustomerInfo = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
            this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
            this.isJointInfo = true;
        }
        this.loadSummary();
        this.roleType = LocalStorageUtil.getStorage().roleType;
        this.checkDocUploadConfig();
        if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
            this.securityId = this.loanDataHolder.security.id;
            this.collateralSiteVisitService.getCollateralSiteVisitBySecurityId(this.loanDataHolder.security.id)
               .subscribe((response: any) => {
                   this.collateralSiteVisitDetail.push(response.detail);
                   const arr = [];
                   response.detail.forEach(f => {
                       if (f.siteVisitDocuments.length > 0) {
                         arr.push(f.siteVisitDocuments);
                       }
                   });
                   // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
                   this.siteVisitDocuments = flatten(arr);
                   if (response.detail.length > 0) {
                       this.isCollateralSiteVisit = true;
                   }
               });
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
                if (this.client === this.clientName.SHINE_RESUNGA) {
                    if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
                        this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.id === this.loanDataHolder.id);
                    } else {
                        this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.currentStage.docAction !== 'APPROVED');
                    }
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

    loanHandler(index: number, length: number, label: string) {
        if (index === length - 1 && index !== 0) {
            if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
                return 'APPROVED BY:';
            } else if (this.loanDataHolder.documentStatus.toString() === 'REJECTED') {
                return 'REJECTED BY:';
            } else if (this.loanDataHolder.documentStatus.toString() === 'CLOSED') {
                return 'CLOSED BY:';
            }
        }
        if (!ObjectUtil.isEmpty(label)) {
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

    /**
     * Get array of loan stage for authority signature array.
     *
     * @param stages Array of loan stages that must include previous stages and current stage.
     */
    private getSignatureList(stages: Array<LoanStage>): Array<LoanStage> {
        let lastBackwardIndex = 0;
        stages.forEach((data, index) => {
            if (data.docAction.toString() === DocAction.value(DocAction.BACKWARD)
                || data.docAction.toString() === DocAction.value(DocAction.RE_INITIATE)) {
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
}

