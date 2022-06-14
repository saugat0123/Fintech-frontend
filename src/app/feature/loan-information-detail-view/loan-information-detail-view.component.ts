import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfigService} from '../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../admin/modal/loan-config';
import {LoanFormService} from '../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../loan/model/loanData';
import {environment} from '../../../environments/environment';
import {ReadmoreModelComponent} from '../loan/component/readmore-model/readmore-model.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
import {CrgGammaDetailViewComponent} from '../loan-information-view/crg-gamma-detail-view/crg-gamma-detail-view.component';
import {
    CollateralSiteVisitService
} from '../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';

@Component({
    selector: 'app-loan-information-detail-view',
    templateUrl: './loan-information-detail-view.component.html',
    styleUrls: ['./loan-information-detail-view.component.scss']
})
export class LoanInformationDetailViewComponent implements OnInit, OnDestroy {
    allId;
    customerId;
    loanConfigId;
    id;
    loanConfig: LoanConfig;
    loanDataHolder: LoanDataHolder = new LoanDataHolder();
    spinner;
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
    isJointInfo = false;
    jointInfo = [];
    loaded = false;
    siteVisitDocuments: Array<SiteVisitDocument>;
    isRetailDetailView = true;
    individualData: any;
    incomeSource: any;
    financialData: any;
    proposalData: any;
    commonLoanData: any;
    companyGroup;
    fixedAssetsData = [];

    constructor(private loanConfigService: LoanConfigService,
                private activatedRoute: ActivatedRoute,
                private customerLoanService: LoanFormService,
                private modalService: NgbModal,
                private fiscalYearService: FiscalYearService,
                private toastService: ToastService,
                private combinedLoanService: CombinedLoanService,
                private collateralSiteVisitService: CollateralSiteVisitService,
    ) {
        this.client = environment.client;
        this.clientList = Clients;

    }

    ngOnInit() {
        this.loadSummary();
        this.customerLoanService.detail(this.customerId).subscribe(response => {
            this.loanDataHolder = response.detail;
            if (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
                this.incomeSource = JSON.parse(this.loanDataHolder.customerInfo.incomeSource);
            }
            if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
                this.financialData = JSON.parse(this.loanDataHolder.financial.data);
            }
            if (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
                this.individualData = JSON.parse(this.loanDataHolder.customerInfo.individualJsonData);
            }
            if (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
                this.proposalData = JSON.parse(this.loanDataHolder.proposal.data);
            }
            if (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
                this.commonLoanData = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
            }
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
                if (this.crgGammaGrade === 'Superior' || this.crgGammaGrade === 'Good') {
                    this.crgGammaGradeStatusBadge = 'badge badge-success';
                } else if (this.crgGammaGrade === 'Bad & Loss' || this.crgGammaGrade === 'Doubtful') {
                    this.crgGammaGradeStatusBadge = 'badge badge-danger';
                } else {
                    this.crgGammaGradeStatusBadge = 'badge badge-warning';
                }
            }
            if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.mgroupInfo)) {
                if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.mgroupInfo.companyGroup)) {
                    this.companyGroup = JSON.parse(this.loanDataHolder.loanHolder.mgroupInfo.companyGroup);
                }
            }
            this.getAllLoans(this.loanHolder.id);
            if (this.loanDataHolder.loanCategory === 'INDIVIDUAL' &&
                !ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.jointInfo)) {
                const jointCustomerInfo = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
                this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
                this.isJointInfo = true;
            }
            if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
                const securityData = JSON.parse(this.loanDataHolder.security.data);
                if (securityData['selectedArray'] !== undefined) {
                    // land security
                    securityData['selectedArray'].filter(f => {
                        if (f.indexOf('LandSecurity') !== -1) {
                            securityData['initialForm']['landDetails'].forEach((ld, index) => {
                                this.getFixedAssetsCollateral('Land Security ' + (index + 1),
                                    this.loanDataHolder.security.id, ld.uuid);
                            });
                        }
                    });
                    // apartment security
                    securityData['selectedArray'].filter(f => {
                        if (f.indexOf('ApartmentSecurity') !== -1) {
                            securityData['initialForm']['buildingDetails'].forEach((appart, ind) => {
                                this.getFixedAssetsCollateral('Apartment Security ' + (ind + 1),
                                    this.loanDataHolder.security.id, appart.uuid);
                            });
                        }
                    });
                    // land and building security
                    securityData['selectedArray'].filter(f => {
                        if (f.indexOf('Land and Building Security') !== -1) {
                            securityData['initialForm']['landBuilding'].forEach((ld, index) => {
                                this.getFixedAssetsCollateral('Land And Building Security ' + (index + 1),
                                    this.loanDataHolder.security.id, ld.uuid);
                            });
                        }
                    });
                }
            }

        });
        this.getFiscalYears();

    }

    ngOnDestroy() {
        this.isRetailDetailView = false;
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
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYearArray = response.detail;
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
        });
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
                if (this.loanDataHolder.documentStatus.toString() === 'APPROVED' ||
                    this.loanDataHolder.documentStatus.toString() === 'CLOSED' ||
                    this.loanDataHolder.documentStatus.toString() === 'REJECTED') {
                    this.customerAllLoanList = this.customerAllLoanList.filter(
                        (c: any) => c.id === this.loanDataHolder.id
                    );
                } else {
                    this.customerAllLoanList = this.customerAllLoanList.filter(
                        (c: any) =>
                            c.currentStage.docAction !== 'CLOSED' &&
                            c.currentStage.docAction !== 'REJECT' &&
                            c.currentStage.docAction !== 'APPROVED'
                    );
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

    customSafePipe(val) {
        if (val == null) {
            return '';
        }
        return val.replace(/(<([^>]+)>)/gi, '');
    }

    checkSiteVisitDocument(event: any) {
        this.siteVisitDocuments = event;
    }

    onOpen() {
        const crgGamma = this.modalService.open(CrgGammaDetailViewComponent, {size: 'lg'});
        crgGamma.componentInstance.formData = this.loanDataHolder.crgGamma;
        crgGamma.componentInstance.loanHolderData = this.loanDataHolder;
        crgGamma.componentInstance.landSecurityDetails =  JSON.parse(this.loanDataHolder.security.data);
    }

    getFixedAssetsCollateral(securityName: string, securityId: number, uuid: string) {
        this.collateralSiteVisitService.getCollateralByUUID(securityName, securityId, uuid)
            .subscribe((response: any) => {
                if (response.detail.length > 0) {
                    response.detail.forEach(rd => {
                        this.fixedAssetsData.push(rd);
                    });
                }
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, `Unable to load site visit info of ${securityName}`));
            });
        console.log('fixedAssetsData', this.fixedAssetsData);
    }
}
