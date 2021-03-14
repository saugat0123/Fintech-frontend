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

@Component({
    selector: 'app-summary-base',
    templateUrl: './summary-base.component.html',
    styleUrls: ['./summary-base.component.scss']
})
export class SummaryBaseComponent implements OnInit, OnDestroy {

    navigationSubscription;
    actionsList: ActionModel = new ActionModel();
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
    loanTag= LoanTag;

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
            }
        });
    }

    ngOnInit() {
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
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
                this.actionsList.roleTypeMaker = this.user.role.roleType === 'MAKER';
            }
        );
        this.getLoanDataHolder();
    }


    getLoanDataHolder() {
        this.actionsList.approved = false;
        this.actionsList.sendForward = false;
        this.actionsList.edit = false;
        this.actionsList.sendBackward = false;
        this.actionsList.rejected = false;
        this.actionsList.closed = false;
        this.loanFormService.detail(this.customerId).subscribe(async (response: any) => {
            this.loanDataHolder = response.detail;
            this.loanCategory = this.loanDataHolder.loanCategory;
            this.currentIndex = this.loanDataHolder.previousList.length;

            this.actionsList.approved = true;
            this.actionsList.sendForward = true;
            this.actionsList.edit = true;
            this.actionsList.sendBackward = true;
            this.actionsList.rejected = true;
            this.actionsList.closed = true;
            if (this.loanDataHolder.createdBy.toString() === LocalStorageUtil.getStorage().userId) {
                this.actionsList.sendBackward = false;
                this.actionsList.edit = true;
                this.actionsList.approved = false;
                this.actionsList.closed = false;
            } else {
                this.actionsList.edit = false;
            }

            if (this.loanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
                this.actionsList.approved = false;
            } else {
                this.actionsList.closed = false;
            }
            this.actionsList.loanApproveStatus = this.loanDataHolder.documentStatus.toString() === 'APPROVED';

            if (this.user.role.roleName !== 'admin') {
                await this.loanActionService.getSendForwardList().subscribe((res: any) => {
                    const forward = res.detail;
                    if (forward.length === 0) {
                        this.actionsList.sendForward = false;
                    }
                });
            }
            if (this.loanDataHolder.currentStage.docAction.toString() === 'APPROVED' ||
                this.loanDataHolder.currentStage.docAction.toString() === 'REJECT' ||
                this.loanDataHolder.currentStage.docAction.toString() === 'CLOSED') {
                this.actionsList.approved = false;
                this.actionsList.sendForward = false;
                this.actionsList.edit = false;
                this.actionsList.sendBackward = false;
                this.actionsList.rejected = false;
                this.actionsList.closed = false;
            }

            await this.approvalLimitService.getLimitByRoleAndLoan(this.loanDataHolder.loan.id, this.loanDataHolder.loanCategory)
                .subscribe((res: any) => {
                    if (res.detail === undefined) {
                        this.actionsList.approved = false;
                    } else {
                        if (this.loanDataHolder.proposal !== null
                            && this.loanDataHolder.proposal.proposedLimit > res.detail.amount) {
                            this.actionsList.approved = false;
                        }
                    }
                });
            if (this.loanDataHolder.isSol) {
                if (this.loanDataHolder.solUser.id !== this.user.id) {
                    this.actionsList.approved = false;
                }
            }

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
            deferredDocs = deferredDocs.filter((d) => (
                !ObjectUtil.isEmpty(d.checkType) && d.checkType === EnumUtils.getEnum(DocumentCheckType, DocumentCheckType.DEFERRAL)
            ));
            const uploadedDocIds = this.loanDataHolder.customerDocument.map(d => d.document.id);
            this.hasMissingDeferredDocs = !deferredDocs.every(d => uploadedDocIds.includes(d.id));
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
