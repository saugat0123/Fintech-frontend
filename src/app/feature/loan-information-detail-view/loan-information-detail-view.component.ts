import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
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
import {SummaryType} from '../loan/component/SummaryType';
import {ObtainableDoc} from '../loan-information-template/obtained-document/obtainableDoc';
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
    spinner;
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
    isMicro = false;
    crgGammaSummary = false;
    crgGammaScore = 0;
    crgGammaGradeStatusBadge;
    crgGammaGrade;
    isJointInfo = false;
    jointInfo = [];
    obtainableDocuments = Array<ObtainableDoc>();
    otherObtainableDocuments = Array<string>();
    summaryType = environment.summaryType;
    summaryTypeName = SummaryType;
    loanType = LoanType;

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
        this.loadSummary();
        this.customerLoanService.detail(this.customerId).subscribe(response => {
            this.loanDataHolder = response.detail;
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

            this.signatureList = this.getSignatureList(new Array<LoanStage>
            (...this.loanDataHolder.previousList, this.loanDataHolder.currentStage));
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
                if (!loanStage.fromUser.name.toLowerCase().includes('default') ) {
                    if (addedStages.has(loanStage.fromUser.id)) {
                        signatureList[addedStages.get(loanStage.fromUser.id)] = loanStage;
                    } else {
                        signatureList.push(loanStage);
                        addedStages.set(loanStage.fromUser.id, index);
                    }
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

    customSafePipe(val) {
        if(val == null){
            return "";
        }
        return val.replace(/(<([^>]+)>)/gi, '');
    }
}
