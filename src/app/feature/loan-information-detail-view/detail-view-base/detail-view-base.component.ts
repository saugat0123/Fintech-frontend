import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {environment} from '../../../../environments/environment';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Proposal} from '../../admin/modal/proposal';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {LoanType} from '../../loan/model/loanType';
import {Document} from '../../admin/modal/document';
import {EnumUtils} from '../../../@core/utils/enums.utils';
import {DocumentCheckType} from '../../../@core/model/enum/document-check-type.enum';
import {ActionModel} from '../../loan/model/action';
import {User} from '../../admin/modal/user';
import {LoanActionService} from '../../loan/loan-action/service/loan-action.service';
import {ApprovalLimitService} from '../../admin/component/approvallimit/approval-limit.service';
import {DateService} from '../../../@core/service/baseservice/date.service';
import {LoanConfig} from '../../admin/modal/loan-config';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {UserService} from '../../../@core/service/user.service';

@Component({
  selector: 'app-detail-view-base',
  templateUrl: './detail-view-base.component.html',
  styleUrls: ['./detail-view-base.component.scss']
})
export class DetailViewBaseComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder = new LoanDataHolder();
  @Input() loanHolder;
  @Input() calendarType;
  @Input() loanId;
  @Input() comment;
  @Input() formData;
  fiscalYearArray: Array<FiscalYear>;
  customerAllLoanList: LoanDataHolder[] = [];
  proposalData: Proposal;
  dataFromComments: any;
  commentsSummary = false;
  previousSecuritySummary = false;
  dataFromPreviousSecurity: any;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  showCadDoc = false;
  securityId: number;
  siteVisitDocuments: Array<SiteVisitDocument>;
  @Output() documents = new EventEmitter();
  requestedLoanType;
  private customerId: number;
  //////////////////////
    customerType;
    actionsList: ActionModel = new ActionModel();
    loanCategory;
    currentIndex: number;
    loanType = LoanType;
    user: User = new User();
    hasMissingDeferredDocs = false;
    nepaliDate;
    loanSummaryActive = true;
    loanConfig: LoanConfig = new LoanConfig();
    allId;
    loanConfigId;
    catalogueStatus = false;
    id: number;
    navigationSubscription;

  constructor(private customerLoanService: LoanFormService,
              private combinedLoanService: CombinedLoanService,
              private loanActionService: LoanActionService,
              private approvalLimitService: ApprovalLimitService,
              private dateService: DateService,
              private activatedRoute: ActivatedRoute,
              private loanConfigService: LoanConfigService,
              private userService: UserService,
              private router: Router,
              private fiscalYearService: FiscalYearService) {
    this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
          if (e instanceof NavigationEnd) {
              this.loadSummary();
          }
      });
  }

  ngOnInit() {
    this.getAllLoans(this.loanDataHolder.loanHolder.id);
    this. fiscalYearService.getAll().subscribe( res => {
      this.fiscalYearArray = res.detail;
    });
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
      this.dataFromComments = JSON.parse(this.loanDataHolder.loanHolder.data);
      this.commentsSummary = true;
    }
    // Setting Previous Security Data
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
      this.dataFromPreviousSecurity = JSON.parse(this.loanDataHolder.loanHolder.data);
      this.previousSecuritySummary = true;
    }
    if (!ObjectUtil.isEmpty(this.loanHolder.security)) {
      this.securityId = this.loanHolder.security.id;
    }
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
                if (ObjectUtil.isEmpty(this.requestedLoanType)) {
                    if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
                        this.customerAllLoanList.push(this.loanDataHolder);
                    }
                    if  ((this.loanDataHolder.documentStatus.toString() === 'APPROVED') ||
                        (this.loanDataHolder.documentStatus.toString() === 'CLOSED') ||
                        (this.loanDataHolder.documentStatus.toString() === 'REJECTED')) {
                        this.customerAllLoanList = this.customerAllLoanList
                            .filter((c: any) => c.id === this.loanDataHolder.id);
                    } else {
                        this.customerAllLoanList = this.customerAllLoanList
                            .filter((c: any) =>  ((c.currentStage.docAction !== 'CLOSED') && (c.currentStage.docAction !== 'REJECT')));
                    }
                } else {
                    this.customerAllLoanList = this.customerAllLoanList
                        .filter((c: any) => ((c.currentStage.docAction === this.requestedLoanType)));
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

  checkSiteVisitDocument(event: any) {
    this.siteVisitDocuments = event;
    this.documents.emit(this.siteVisitDocuments);
  }


    getLoanDataHolder() {
        this.actionsList.approved = false;
        this.actionsList.sendForward = false;
        this.actionsList.edit = false;
        this.actionsList.sendBackward = false;
        this.actionsList.rejected = false;
        this.actionsList.closed = false;
        this.customerLoanService.detail(this.customerId).subscribe(async (response: any) => {
            this.loanDataHolder = response.detail;
            this.customerType = this.loanDataHolder.loanCategory;
            this.loanCategory = this.loanDataHolder.loanCategory;
            this.currentIndex = this.loanDataHolder.previousList.length;

            this.actionsList.approved = true;
            this.actionsList.sendForward = true;
            this.actionsList.edit = true;
            this.actionsList.sendBackward = true;
            this.actionsList.rejected = true;
            this.actionsList.closed = true;
            if ((this.loanDataHolder.createdBy.toString() === LocalStorageUtil.getStorage().userId) ||
                (this.loanDataHolder.currentStage.toRole.roleType.toString() === 'MAKER')) {
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
                if (!ObjectUtil.isEmpty(this.loanDataHolder.solUser)) {
                    if (this.loanDataHolder.solUser.id !== this.user.id) {
                        this.actionsList.approved = false;
                    }
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
            if (!ObjectUtil.isEmpty(deferredDocs)) {
                deferredDocs = deferredDocs.filter((d) => (
                    !ObjectUtil.isEmpty(d.checkType) && d.checkType === EnumUtils.getEnum(DocumentCheckType, DocumentCheckType.DEFERRAL)
                ));
            }
            const uploadedDocIds = this.loanDataHolder.customerDocument.map(d => d.document.id);
            this.hasMissingDeferredDocs = !deferredDocs.every(d => uploadedDocIds.includes(d.id));
        });
    }

    activeApprovalSheet() {
        this.loanSummaryActive = false;
    }

    customerLoanList(event) {
        this.customerAllLoanList = event;
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
}
