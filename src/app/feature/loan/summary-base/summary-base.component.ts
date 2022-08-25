import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../@core/service/user.service';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {LoanActionService} from '../loan-action/service/loan-action.service';
import {DmsLoanService} from '../component/loan-main-template/dms-loan-file/dms-loan-service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ApprovalLimitService} from '../../admin/component/approvallimit/approval-limit.service';
import {DateService} from '../../../@core/service/baseservice/date.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentService} from '../../admin/component/document/document.service';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {ActionModel} from '../model/action';
import {LoanConfig} from '../../admin/modal/loan-config';
import {User} from '../../admin/modal/user';
import {LoanDataHolder} from '../model/loanData';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {LoanType} from '../model/loanType';
import {ObjectUtil} from 'src/app/@core/utils/ObjectUtil';
import {DocumentCheckType} from '../../../@core/model/enum/document-check-type.enum';
import {Document} from '../../admin/modal/document';
import {EnumUtils} from '../../../@core/utils/enums.utils';
import {LoanTag} from '../model/loanTag';
import {environment} from '../../../../environments/environment';
import {SummaryType} from '../component/SummaryType';

@Component({
    selector: 'app-summary-base',
    templateUrl: './summary-base.component.html',
    styleUrls: ['./summary-base.component.scss']
})
export class SummaryBaseComponent implements OnInit, OnDestroy {

    navigationSubscription;
    allId;
    customerId;
    loanConfigId;
    catalogueStatus = false;
    loanConfig: LoanConfig = new LoanConfig();
    id: number;
    user: User = new User();
    loanCategory;
    currentIndex: number;
    loanType = LoanType;
    loanDataHolder: LoanDataHolder = new LoanDataHolder();
    nepaliDate;
    hasMissingDeferredDocs = false;

    loanSummaryActive = true;
    approvalSheetActive = false;
    loanTag = LoanTag;
    summaryType = environment.summaryType;
    summaryTypeName = SummaryType;
    spinner = false;
    isMyBucketFile = false;

    constructor(private userService: UserService,
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
                private combinedLoanService: CombinedLoanService) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.loadSummary();
                this.spinner = false;
            }
        });
    }

    ngOnInit() {
        const checkRoute = localStorage.getItem('FromDetailed-view');
        if (checkRoute === 'true') {
            this.activeApprovalSheet();
        }
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
        this.getLoanDataHolder();
    }


    getLoanDataHolder() {
        this.spinner = true;
        this.loanFormService.detail(this.customerId).subscribe(async (response: any) => {
            this.loanDataHolder = response.detail;
            if (this.loanDataHolder.currentStage.toUser.id.toString() === LocalStorageUtil.getStorage().userId &&
                this.loanDataHolder.currentStage.toRole.id.toString() === LocalStorageUtil.getStorage().roleId) {
                this.isMyBucketFile = true;
            }
            this.spinner = false;
            this.loanCategory = this.loanDataHolder.loanCategory;
            this.currentIndex = this.loanDataHolder.previousList.length;
            this.dateService.getDateInNepali(this.loanDataHolder.createdAt.toString()).subscribe((nepDate: any) => {
                this.nepaliDate = nepDate.detail;
            });
            // check deferred docs
            let deferredDocs: Document[];
            switch (this.loanDataHolder.loanType) {
                case EnumUtils.getEnum(LoanType, LoanType.NEW_LOAN):
                    deferredDocs = this.loanDataHolder.loan.initial;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.ENHANCED_LOAN):
                    deferredDocs = this.loanDataHolder.loan.enhance;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.RENEWED_LOAN):
                    deferredDocs = this.loanDataHolder.loan.renew;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.CLOSURE_LOAN):
                    deferredDocs = this.loanDataHolder.loan.closure;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.PARTIAL_SETTLEMENT_LOAN):
                    deferredDocs = this.loanDataHolder.loan.partialSettlement;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.FULL_SETTLEMENT_LOAN):
                    deferredDocs = this.loanDataHolder.loan.fullSettlement;
                    break;
                default:
                    deferredDocs = [];
            }
            if (!ObjectUtil.isEmpty(deferredDocs)) {
                deferredDocs = deferredDocs.filter((d) => (
                    !ObjectUtil.isEmpty(d.checkType) && d.checkType === EnumUtils.getEnum(DocumentCheckType, DocumentCheckType.DEFERRAL)
                ));
                const uploadedDocIds = this.loanDataHolder.customerDocument.map(d => d.document.id);
                this.hasMissingDeferredDocs = !deferredDocs.every(d => uploadedDocIds.includes(d.id));
            }
        });
    }

    activeApprovalSheet() {
        this.approvalSheetActive = true;
        this.loanSummaryActive = false;
    }

    activeLoanSummary() {
        this.approvalSheetActive = false;
        this.loanSummaryActive = true;
    }
}
