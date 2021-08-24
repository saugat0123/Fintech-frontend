import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanConfig} from '../../../../admin/modal/loan-config';
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
import {UserService} from '../../../../../@core/service/user.service';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanActionService} from '../../../loan-action/service/loan-action.service';
import {DmsLoanService} from '../../loan-main-template/dms-loan-file/dms-loan-service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ApprovalLimitService} from '../../../../admin/component/approvallimit/approval-limit.service';
import {DateService} from '../../../../../@core/service/baseservice/date.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentService} from '../../../../admin/component/document/document.service';
import {CombinedLoanService} from '../../../../service/combined-loan.service';
import {CommonRoutingUtilsService} from '../../../../../@core/utils/common-routing-utils.service';
import {ToastService} from '../../../../../@core/utils';
import {FiscalYearService} from '../../../../admin/service/fiscal-year.service';
import {environment} from '../../../../../../environments/environment';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CombinedLoan} from '../../../model/combined-loan';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ReadmoreModelComponent} from '../../readmore-model/readmore-model.component';
import {DocAction} from '../../../model/docAction';
import {Security} from '../../../../admin/modal/security';
import {RoleHierarchyService} from '../../../../admin/component/role-hierarchy/role-hierarchy.service';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {ApprovalSheetInfoComponent} from '../approval-sheet-info/approval-sheet-info.component';
import {Clients} from '../../../../../../environments/Clients';
import {ObtainableDoc} from '../../../../loan-information-template/obtained-document/obtainableDoc';

@Component({
    selector: 'app-approval-sheet',
    templateUrl: './approval-sheet.component.html',
    styleUrls: ['./approval-sheet.component.scss']
})
export class ApprovalSheetComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Output() changeToLoanSummaryActive = new EventEmitter<string>();

    @Input() loanData;
    loanDataHolder: LoanDataHolder;

    @Input()
    loanConfig: LoanConfig = new LoanConfig();

    @Input() nepaliDate;

    client: string;
    clientName = Clients;

    ckeConfig = Editor.CK_CONFIG;
    authorityReviewComments;
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
    loggedUserAccess;
    taggedGuarantorWithDoc = [];
    insuranceWithDoc = [];
    showCadDoc = false;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    fiscalYearArray = [];
    age: number;
    approveSheet = 'approveSheet';

    riskOfficerLevel = false;
    riskOfficerLevelComment = false;

    public currentAuthorityList: LoanStage[] = [];
    private spinner = false;
    disableApprovalSheetFlag = environment.disableApprovalSheet;
    showApprovalSheetInfo = false;
    isJointInfo = false;
    jointInfo = [];
    proposalAllData;
    companyInfo: any;
    obtainableDocuments = Array<ObtainableDoc>();
    otherObtainableDocuments = Array<string>();
    megaGroupEnabled = environment.MEGA_GROUP;

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
        private roleHierarchyService: RoleHierarchyService,
        private commonRoutingUtilsService: CommonRoutingUtilsService,
        private toastService: ToastService,
        private fiscalYearService: FiscalYearService,
        private cdRef: ChangeDetectorRef
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
        if (this.loanDataHolder.loanCategory === 'INDIVIDUAL' && !ObjectUtil.isEmpty(
            this.loanDataHolder.customerInfo.jointInfo)) {
            const jointCustomerInfo = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
            this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
            this.isJointInfo = true;
        }
        if (this.loanDataHolder.loanCategory === 'INSTITUTION') {
            this.companyInfo = JSON.parse(this.loanDataHolder.companyInfo.companyJsonData);
        }
        this.loggedUserAccess = LocalStorageUtil.getStorage().roleAccess;
        this.loadSummary();
        this.checkDocUploadConfig();
        this.obtainableDocument();
    }

    ngOnDestroy(): void {
        this.navigationSubscription.unsubscribe();
    }

    /**
     *  Rearranges loan stage list in accordance with the Role name 'RISK OFFICER' **
     * */
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
            this.proposalAllData = JSON.parse(this.proposalData.data);
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
                if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
                    this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.id === this.loanDataHolder.id);
                } else {
                    this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.currentStage.docAction !== 'APPROVED');
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
    goToLoanSummary() {
        this.changeToLoanSummaryActive.next();
    }

    openTermsAndCommentModal(model) {
        this.authorityReviewComments = this.loanDataHolder.authorityReviewComments;
        this.modalService.open(model , {size: 'lg'});
    }

    saveTermsAndCommentModal() {
            this.spinner = true;
            this.loanDataHolder.authorityReviewComments = this.authorityReviewComments;
            this.loanFormService.save(this.loanDataHolder).subscribe(() => {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.SUCCESS, `Successfully Saved Authority Comments`));
                this.close();
                this.router.navigateByUrl('/home/dashboard').then(value => {
                    if (value) {
                        this.router.navigate(['/home/loan/summary'], {
                            queryParams: {
                                loanConfigId: this.loanConfig.id,
                                customerId: this.loanDataHolder.id,
                                // to do: remove this if not required in future
                                // catalogue: false
                            }
                        });
                    }
                });
            }, error => {
                console.error(error);
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.ERROR, `Error Saving Authority Comments: ${error.error.message}`));
                this.close();
            });
        }

        close() {
        this.modalService.dismissAll();
        }

    calculateAge(dob) {
        const difference = Math.abs(Date.now() - new Date(dob).getTime());
        this.age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
        return this.age;
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

    /** setting value from chlid
     class after comment approval verification **/
    setCommentApproval(event: boolean) {
        this.riskOfficerLevelComment = event;
    }

    ngAfterViewChecked(): void {
        if (this.riskOfficerLevelComment === true) {
            this.cdRef.detectChanges();

        }
    }

    obtainableDocument() {
        this.activatedRoute.queryParams.subscribe((res) => {
            this.customerLoanService.detail(res.customerId).subscribe( response => {
                const detail = JSON.parse(response.detail.data);
                if (!ObjectUtil.isEmpty(detail.documents)) {
                    detail.documents.forEach(resData => {
                        this.obtainableDocuments.push(resData);
                    });
                }
                if (!ObjectUtil.isEmpty(detail.OtherDocuments)) {
                    detail.OtherDocuments.split(',').forEach(resData => {
                        if (resData !== '') {
                            this.obtainableDocuments.push(resData);
                        }
                    });
                }
            });
        });
    }
}
