import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfigService} from '../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../admin/modal/loan-config';
import {LoanFormService} from '../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../loan/model/loanData';
import {environment} from '../../../environments/environment';
import {ReadmoreModelComponent} from '../loan/component/readmore-model/readmore-model.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
import {SummaryType} from '../loan/component/SummaryType';
import {ObtainableDoc} from '../loan-information-template/obtained-document/obtainableDoc';
import {LoanType} from '../loan/model/loanType';
import {SiteVisitDocument} from '../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {DocStatus} from '../loan/model/docStatus';
import {LocalStorageUtil} from "../../@core/utils/local-storage-util";

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
    spinner = false;
    loanCategory;
    client;
    clientList;
    currentIndex;
    RootUrl = ApiConfig.URL;
    calendarType: CalendarType = CalendarType.AD;
    loanHolder;
    currentDocAction;
    fiscalYearArray = [];
    customerAllLoanList: Array<LoanDataHolder> = [];
    isMicro = false;
    crgGammaSummary = false;
    crgGammaScore = 0;
    crgGammaGradeStatusBadge;
    crgGammaGrade;
    crgGammaPremiumRange;
    isJointInfo = false;
    jointInfo = [];
    obtainableDocuments = Array<ObtainableDoc>();
    otherObtainableDocuments = Array<string>();
    summaryType = environment.summaryType;
    summaryTypeName = SummaryType;
    loanType = LoanType;
    loaded = false;
    docAction = DocAction;
    siteVisitDocuments: Array<SiteVisitDocument>;
    showRibbon = false;
    catalogueStatus = false;
    isMyBucketFile = false;

    constructor(private loanConfigService: LoanConfigService,
                private activatedRoute: ActivatedRoute,
                private customerLoanService: LoanFormService,
                private modalService: NgbModal,
                private fiscalYearService: FiscalYearService,
                private toastService: ToastService,
                private combinedLoanService: CombinedLoanService,
    ) {
        this.client = environment.client;
        this.clientList = Clients;

    }

    ngOnInit() {
        this.spinner = true;
        this.loadSummary();
        this.customerLoanService.detail(this.customerId).subscribe(response => {
            this.loanDataHolder = response.detail;
            if (this.loanDataHolder.currentStage.toUser.id.toString() === LocalStorageUtil.getStorage().userId &&
                this.loanDataHolder.currentStage.toRole.id.toString() === LocalStorageUtil.getStorage().roleId) {
                this.isMyBucketFile = true;
            }
            this.activeRibbon();
            this.spinner = false;
            this.loaded = true;
            this.id = this.loanDataHolder.id;
            this.loanHolder = this.loanDataHolder.loanHolder;
            this.loanCategory = this.loanDataHolder.loanCategory;
            this.currentIndex = this.loanDataHolder.previousList.length;
            this.currentDocAction = this.loanDataHolder.currentStage.docAction.toString();
            if (ObjectUtil.isEmpty(this.loanDataHolder.reportingInfoLevels)) {
                this.loanDataHolder.reportingInfoLevels = [];
            }
            if (ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.insurance)) {
                this.loanDataHolder.loanHolder.insurance = [];
            }

            // Setting credit risk GAMMA data---
            if (!ObjectUtil.isEmpty(this.loanDataHolder.crgGamma)) {
                this.crgGammaSummary = true;
                const crgParsedData = JSON.parse(this.loanDataHolder.crgGamma.data);
                this.crgGammaGrade = crgParsedData.grade;
                this.crgGammaScore = ObjectUtil.isEmpty(crgParsedData.totalPoint) ? 0 : crgParsedData.totalPoint;
                this.crgGammaPremiumRange = crgParsedData.premiumRange;
                if (this.crgGammaGrade === 'A' || this.crgGammaGrade === 'B') {
                    this.crgGammaGradeStatusBadge = 'badge badge-success';
                } else if (this.crgGammaGrade === 'C' || this.crgGammaGrade === 'D') {
                    this.crgGammaGradeStatusBadge = 'badge badge-danger';
                } else {
                    this.crgGammaGradeStatusBadge = 'badge badge-warning';
                }
            }
            this.getAllLoans(this.loanHolder.id);
            if (this.loanDataHolder.loanCategory === 'INDIVIDUAL' &&
                !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.jointInfo)) {
                const jointCustomerInfo = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
                this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
                this.isJointInfo = true;
            }

        });
        this.getFiscalYears();

    }

    loadSummary() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = paramsValue;
                this.customerId = this.allId.customerId;
                this.loanConfigId = this.allId.loanConfigId;
                if (this.allId.catalogue) {
                  this.catalogueStatus = true;
                }
            });
        // this.id = this.activatedRoute.snapshot.params['id'];
        this.spinner = true;
        this.loanConfigService.detail(this.loanConfigId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
                this.spinner = false;
                if (this.loanConfig.loanTag === 'MICRO_LOAN') {
                    this.isMicro = true;
                }
            }
        );

    }

    onBack() {
        this.spinner = true;
        window.history.back();
    }

    open(comments) {
        const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
        modalRef.componentInstance.comments = comments;
    }
    getFiscalYears() {
        this.spinner = true;
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYearArray = response.detail;
            this.spinner = false;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
            this.spinner = false;
        });
    }

    getAllLoans(customerInfoId: number): void {
        const search = {
            loanHolderId: customerInfoId.toString(),
            isStaged: 'true'
        };
        this.spinner = true;
        this.customerLoanService.getAllWithSearch(search)
        .subscribe((res: any) => {
            this.customerAllLoanList = res.detail;
            this.spinner = false;
            // push current loan if not fetched from staged spec response
            if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
                this.customerAllLoanList.push(this.loanDataHolder);
            }
            // push loans from combined loan if not in the existing array
            const combinedLoans = this.customerAllLoanList
            .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan));
            if (combinedLoans.length > 0) {
                const combinedLoanId = combinedLoans[0].combinedLoan.id;
                this.spinner = true;
                this.combinedLoanService.detail(combinedLoanId).subscribe((response: any) => {
                    this.spinner = false;
                    (response.detail as CombinedLoan).loans.forEach((cl) => {
                        const allLoanIds = this.customerAllLoanList.map((loan) => loan.id);
                        if (!allLoanIds.includes(cl.id)) {
                            this.customerAllLoanList.push(cl);
                        }
                    });
                }, err => {
                    console.error(err);
                    this.spinner = false;
                });
            }
        }, error => {
            console.error(error);
            this.spinner = false;
        });
    }

    customSafePipe(val) {
        if (val == null) {
            return '';
        }
        return val.replace(/(<([^>]+)>)/gi, '');
    }
    goToApprovalSheet() {
        localStorage.setItem('FromDetailed-view', 'true');
        this.spinner = true;
        window.history.back();
    }

    checkSiteVisitDocument(event: any) {
        this.siteVisitDocuments = event;
    }

    activeRibbon() {
         if (this.loanDataHolder.currentStage.docAction.toString() === DocAction.value(DocAction.APPROVED) ||
            this.loanDataHolder.currentStage.docAction.toString() === DocAction.value(DocAction.CLOSED) ||
            this.loanDataHolder.currentStage.docAction.toString() === DocAction.value(DocAction.REJECT)) {
            this.showRibbon = false;
        } else {
            this.showRibbon = true;
        }
    }
}
