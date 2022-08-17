import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfigService} from '../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../admin/modal/loan-config';
import {LoanFormService} from '../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../loan/model/loanData';
import {environment} from '../../../environments/environment';
import {ReadmoreModelComponent} from '../loan/component/readmore-model/readmore-model.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanStage} from '../loan/model/loanStage';
import {DocAction} from '../loan/model/docAction';
import {ApiConfig} from '../../@core/utils/api/ApiConfig';
import {CalendarType} from '../../@core/model/calendar-type';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {FiscalYearService} from '../admin/service/fiscal-year.service';
import {ToastService} from '../../@core/utils';
import {CombinedLoan} from '../loan/model/combined-loan';
import {CombinedLoanService} from '../service/combined-loan.service';
import {Clients} from '../../../environments/Clients';
import {SiteVisitDocument} from '../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {NgxSpinnerService} from 'ngx-spinner';
import {Proposal} from '../admin/modal/proposal';
import {LoanType} from '../loan/model/loanType';

@Component({
    selector: 'app-loan-information-detail-view',
    templateUrl: './loan-information-detail-view.component.html',
    styleUrls: ['./loan-information-detail-view.component.scss']
})
export class LoanInformationDetailViewComponent implements OnInit {
    megaGroupEnabled = environment.MEGA_GROUP;
    allId;
    customerId;
    loanConfigId;
    id;
    loanConfig: LoanConfig;
    loanDataHolder: LoanDataHolder;
    loanCategory;
    client;
    clientList;
    currentIndex;
    signatureList: Array<LoanStage> = new Array<LoanStage>();
    RootUrl = ApiConfig.URL;
    calendarType: CalendarType = CalendarType.AD;
    loanHolder;
    currentDocAction;
    fiscalYearArray = [];
    customerAllLoanList: Array<LoanDataHolder> = [];
    crgGammaSummary = false;
    crgGammaScore = 0;
    crgGammaGradeStatusBadge;
    crgGammaGrade;
    isJointInfo = false;
    jointInfo = [];
    isRemitLoan = false;
    isLoaded = false;
    siteVisitDocuments: Array<SiteVisitDocument>;
    reviewDateData;
    naChecked: boolean;
    loaded;
    combinedLoan;
    combined = false;
    allLoanList = [];
    loanSecurity = [];
    approvedSecurity = [];
    combinedLoanList = [];
    consumerFinance = false;
    smallBusiness = false;
    deprivedSector = false;
    microFinancialService = false;
    thisClient;
    customerReportingInfo = [];
    hasLastReview = false;
    constructor(private loanConfigService: LoanConfigService,
                private activatedRoute: ActivatedRoute,
                private customerLoanService: LoanFormService,
                private modalService: NgbModal,
                private fiscalYearService: FiscalYearService,
                private toastService: ToastService,
                private combinedLoanService: CombinedLoanService,
                private spinner: NgxSpinnerService
    ) {
        this.client = environment.client;
        this.clientList = Clients;

    }

    ngOnInit() {
        this.spinner.show();
        this.loadSummary();
        if (!ObjectUtil.isEmpty(this.loanDataHolder) && !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.reportingInfoLevels)
            && this.loanDataHolder.loanHolder.reportingInfoLevels.length > 0) {
            this.loanDataHolder.loanHolder.reportingInfoLevels.forEach(rep => {
                this.customerReportingInfo.push(rep);
            });
        }
        this.customerLoanService.detail(this.customerId).subscribe((response) => {
            this.loanDataHolder = response.detail;
            this.getAllLoans(this.loanDataHolder.loanHolder.id);
            this.isLoaded = true;
            this.id = this.loanDataHolder.id;
            this.loanHolder = this.loanDataHolder;
            this.loanCategory = this.loanDataHolder.loanCategory;
            this.currentIndex = this.loanDataHolder.previousList.length;
            this.currentDocAction = this.loanDataHolder.currentStage.docAction.toString();
            this.thisClient = this.loanDataHolder.loanHolder.clientType;
            if (ObjectUtil.isEmpty(this.loanDataHolder.reportingInfoLevels)) {
                this.loanDataHolder.reportingInfoLevels = [];
            }
            if (ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.insurance)) {
                this.loanDataHolder.loanHolder.insurance = [];
            }
            if (this.loanDataHolder.loanHolder.clientType === 'CONSUMER_FINANCE') {
                this.consumerFinance = true;
            } else if (this.loanDataHolder.loanHolder.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES' && this.loanDataHolder.loanHolder.customerType === 'INSTITUTION') {
                this.smallBusiness = true;
            }
            if (this.loanDataHolder.loanHolder.clientType === 'DEPRIVED_SECTOR') {
                this.deprivedSector = true;
            }
            if (this.loanDataHolder.loanHolder.clientType === 'MICRO_FINANCIAL_SERVICES') {
                this.microFinancialService = true;
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

            if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder)) {
                if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.reviewDate)) {
                    this.reviewDateData = JSON.parse(this.loanDataHolder.loanHolder.reviewDate.data);
                    this.naChecked = this.reviewDateData.checked;
                }
            }

            this.signatureList = this.getSignatureList(new Array<LoanStage>
            (...this.loanDataHolder.previousList, this.loanDataHolder.currentStage));
            if (this.loanDataHolder.loanCategory === 'INDIVIDUAL' &&
                !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.jointInfo)) {
                const jointCustomerInfo = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
                this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
                this.isJointInfo = true;
            }
            this.spinner.hide();
        });
        this.getFiscalYears();

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
                // if (this.allId.catalogue) {
                //   this.catalogueStatus = true;
                // }
            });
        // this.id = this.activatedRoute.snapshot.params['id'];
        this.loanConfigService.detail(this.loanConfigId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
                if (this.loanConfig.loanTag === 'REMIT_LOAN' && this.loanConfig.isRemit) {
                    this.isRemitLoan = true;
                }
            }
        );
    }

    onBack() {
        this.spinner.show();
        window.history.back();
    }

    open(comments) {
        const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
        modalRef.componentInstance.comments = comments;
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

    getFiscalYears() {
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYearArray = response.detail;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
        });
    }

    getAllLoans(customerInfoId: number): void {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
            if (!ObjectUtil.isEmpty(this.loanDataHolder.combinedLoan)) {
                this.combinedLoanService.detail(this.loanDataHolder.combinedLoan.id).subscribe({
                    next: (res) => {
                        this.combinedLoanList = res.detail.loans;
                        this.allLoanList = res.detail.loans;
                        (res.detail as CombinedLoan).loans.forEach((cl) => {
                            this.loanSecurity = this.loanSecurity.concat(cl.securities);
                            const allLoanIds = this.customerAllLoanList.map((loan) => loan.id);
                            if (!allLoanIds.includes(cl.id)) {
                                this.customerAllLoanList.push(cl);
                            }
                        });
                    },
                    error: (err) => {

                    },
                    complete: () => {
                        this.loaded = true;
                        this.spinner.hide();
                    }
                });
            } else {
                this.loaded = true;
                this.allLoanList.push(this.loanDataHolder);
                this.loanSecurity = this.loanDataHolder.securities;
                this.customerAllLoanList = [];
                this.combinedLoanList.push(this.loanDataHolder);
                this.customerAllLoanList.push(this.loanDataHolder);
                this.spinner.hide();
            }
            this.allLoanList = this.customerAllLoanList;
            if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.existingExposures)) {
                this.loanDataHolder.loanHolder.existingExposures.forEach((e) => {
                    if (e.docStatus.toString() === 'APPROVED' && e.loanId !== this.loanDataHolder.id) {
                        const loan = new LoanDataHolder();
                        const prop = new Proposal();
                        prop.data = e.proposalData;
                        prop.proposedLimit = e.originalLimit;
                        loan.proposal = prop;
                        loan.loan = e.loanConfig;
                        loan.securities = [];
                        loan.id = e.loanId || e.id;
                        loan.documentStatus = e.docStatus;
                        loan.loanType = (e.loanType) as LoanType;
                        loan.withIn = e.withIn;
                        loan.withInLoan  = e.exposureWithInId;
                        this.customerAllLoanList.push(loan);
                    }
                });
            }
            const uniqueLoanIds = this.customerAllLoanList.map(d => d.id);
            this.customerAllLoanList =  this.customerAllLoanList
                .filter((value, index) => value.id === null || uniqueLoanIds.indexOf(value.id) === index);
            if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.approvedSecurities)) {
                const approvedId = this.loanDataHolder.loanHolder.approvedSecurities.map((d) => d.id);
                this.approvedSecurity = this.loanDataHolder.loanHolder.approvedSecurities
                    .filter((value, index, self) => approvedId.indexOf(value.id) === index);
            }
        }
        this.hasLastReview = this.combinedLoanList.filter(d => !ObjectUtil.isEmpty(d.reviewDate) && !ObjectUtil.isEmpty(d.reviewDate.data)).length > 0;
    }

    customSafePipe(val) {
        if (val == null) {
            return '';
        }
        return val.replace(/(<([^>]+)>)/gi, '');
    }

    checkSiteVisitDocument(event: any) {
        this.siteVisitDocuments = event;
    }
}
