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
import {Clients} from '../../../../environments/Clients';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';

@Component({
  selector: 'app-detail-view-base',
  templateUrl: './detail-view-base.component.html',
  styleUrls: ['./detail-view-base.component.scss']
})
export class DetailViewBaseComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() loanHolder;
  @Input() calendarType;
  @Input() loanId;
  @Input() comment;
  @Input() formData;
  @Input() isRemit;
  fiscalYearArray: Array<FiscalYear>;
  customerAllLoanList: LoanDataHolder[] = [];
  proposalData: Proposal;
  megaGroupEnabled = environment.MEGA_GROUP;
  dataFromComments: any;
  commentsSummary = false;
  previousSecuritySummary = false;
  dataFromPreviousSecurity: any;
  client = environment.client;
  clientName = Clients;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  showCadDoc = false;
  securityId: number;
  siteVisitDocuments: Array<SiteVisitDocument>;
  @Output() documents = new EventEmitter();
  bankingRelation;
  isIndividual =  false;
  financialData;
  financialKeys;
  requestedLoanType;
  approvedSecurity = false;
  approveSecurityAsProposed = false;
  checkedData;
  proposalAllData;
  financial;
  consumerFinance = false;
  smallBusiness = false;
  loaded = false;
  constructor(private customerLoanService: LoanFormService,
              private combinedLoanService: CombinedLoanService,
              private fiscalYearService: FiscalYearService) {
    this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
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
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.bankingRelationship)) {
      this.bankingRelation = JSON.parse(this.loanDataHolder.loanHolder.bankingRelationship);
    }
    if (this.loanDataHolder.loanHolder.clientType === 'CONSUMER_FINANCE') {
      this.consumerFinance = true;
    } else  if (this.loanDataHolder.loanHolder.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES') {
      this.smallBusiness = true;
    }
    if (this.loanDataHolder.loanCategory !== 'INDIVIDUAL') {
      if (!ObjectUtil.isEmpty(this.loanHolder.financial)) {
        if (!ObjectUtil.isEmpty(this.loanHolder.financial.data)) {
          this.financialData = JSON.parse(this.loanHolder.financial.data);
          this.financialKeys = Object.keys(this.financialData);
        }
      }
    }
    if (this.loanDataHolder.loanCategory === 'INDIVIDUAL') {
      this.isIndividual = true;
      if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
        this.financialData = this.loanDataHolder.financial;
        if (ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)) {
          this.financial = JSON.parse(this.financialData.data);
        }
      }
    }
    if (!ObjectUtil.isEmpty(this.loanHolder.security)) {
      if (!ObjectUtil.isEmpty(this.loanHolder.security.approvedData)) {
        this.approvedSecurity = true;
      }
    }
    if (!ObjectUtil.isEmpty(this.loanHolder.security)) {
      if (ObjectUtil.isEmpty(this.loanHolder.security.data) &&
          !ObjectUtil.isEmpty(this.loanHolder.security.approvedData)) {
        this.approvedSecurity = true;
        this.approveSecurityAsProposed = false;
      }
    }

    if (!ObjectUtil.isEmpty(this.loanHolder.shareSecurity)) {
      if (ObjectUtil.isEmpty(this.loanHolder.shareSecurity.data) && !ObjectUtil.isEmpty(this.loanHolder.shareSecurity.approvedData)) {
        const data = JSON.parse(this.loanHolder.security.approvedData);
        const selectedArray = data.selectedArray;
        if (selectedArray.indexOf('ShareSecurity') !== -1) {
          this.approvedSecurity = true;
          this.approveSecurityAsProposed = false;
        }
      }
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.checkedData = JSON.parse(this.loanDataHolder.proposal.checkedData);
      this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
    }
  }

  getAllLoans(customerInfoId: number): void {
    const search = {
      loanHolderId: customerInfoId.toString(),
      isStaged: 'true'
    };
    this.customerLoanService.getLoansByLoanHolderId(customerInfoId)
        .toPromise().then(async (res: any) => {
      this.customerAllLoanList = await res.detail;
      // push current loan if not fetched from staged spec response
      if (ObjectUtil.isEmpty(this.requestedLoanType) && this.customerAllLoanList.length > 0) {
        if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
          this.customerAllLoanList.push(this.loanDataHolder);
        }
        if ((this.loanDataHolder.documentStatus.toString() === 'APPROVED') || (this.loanDataHolder.documentStatus.toString() === 'CLOSED') || (this.loanDataHolder.documentStatus.toString() === 'REJECTED')) {
          this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.id === this.loanDataHolder.id);
        } else {
          this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => ((c.currentStage.docAction !== 'CLOSED') && (c.currentStage.docAction !== 'REJECT')));
        }
      } else {
        this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => ((c.currentStage.docAction === this.requestedLoanType)));
      }
      // push loans from combined loan if not in the existing array
      const combinedLoans = this.customerAllLoanList
          .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan));
      if (combinedLoans.length > 0) {
        const combinedLoanId = combinedLoans[0].combinedLoan.id;
        this.combinedLoanService.detail(combinedLoanId).toPromise().then((response: any) => {
          (response.detail as CombinedLoan).loans.forEach((cl) => {
            const allLoanIds = this.customerAllLoanList.map((loan) => loan.id);
            if (!allLoanIds.includes(cl.id)) {
              this.customerAllLoanList.push(cl);
            }
          });
        }, err => {
          console.error(err);
        }).finally( () => {
          this.loaded = true;
        });
      } else {
        this.customerAllLoanList = this.customerAllLoanList.filter((c: LoanDataHolder) => (c.id === this.loanDataHolder.id || (c.documentStatus.toString() !== 'UNDER_REVIEW' && c.documentStatus.toString() !== 'PENDING')));
        this.loaded = true;
      }
    }, error => {
      console.error(error);
    });
  }

  checkSiteVisitDocument(event: any) {
    this.siteVisitDocuments = event;
    this.documents.emit(this.siteVisitDocuments);
  }
}
