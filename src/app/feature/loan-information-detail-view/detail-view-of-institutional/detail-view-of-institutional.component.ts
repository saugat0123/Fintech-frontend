import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {Proposal} from '../../admin/modal/proposal';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {IndividualJsonData} from '../../admin/modal/IndividualJsonData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {Security} from '../../loan/model/security';
import {ProductPaperChecklistComponent} from '../../loan-information-template/product-paper-checklist/product-paper-checklist.component';
import {ReadmoreModelComponent} from '../../loan/component/readmore-model/readmore-model.component';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DmsLoanFile} from '../../admin/modal/dms-loan-file';
import {LoanType} from '../../loan/model/loanType';
import {LoanTag} from '../../loan/model/loanTag';

@Component({
  selector: 'app-detail-view-of-institutional',
  templateUrl: './detail-view-of-institutional.component.html',
  styleUrls: ['./detail-view-of-institutional.component.scss']
})
export class DetailViewOfInstitutionalComponent implements OnInit {
  @Input() securityValue: Security;
  @Input() loanHolder;
  @Input() loanConfig;
  @Input() signatureList;
  @Input() calendarType;
  @Input() loanId;
  @ViewChild('productPaperChecklistComponent', {static: false})
  productPaperChecklistComponent: ProductPaperChecklistComponent;
  checklistData;
  @Input() loanDataHolder: LoanDataHolder;
  loans;
  paperChecklist;
  allId;
  checklistChecked = false;
  proposalData: Proposal;
  proposalSummary = false;
  loaded = false;
  @Input() customerAllLoanList: LoanDataHolder [];
  isRemitLoan = false;
  beneficiary;
  senderDetails;
  loanCategory;
  isJointInfo = false;
  newJointInfo = [];
  notApprove = 'notApprove';
  checkedData;
  proposalAllData;
  smallBusiness = false;
  consumerFinance = false;
  netTradingAssetsSummary = false;
  netTradingAssetsData: NetTradingAssets;
  fiscalYearArray = [];
  RootUrl = ApiConfig.URL;
  currentIndex: number;
  dmsLoanFile: DmsLoanFile = new DmsLoanFile();
  securities: any = [];
  documents: [] = [];
  documentUrls = [];
  documentUrl: string;
  documentNames = [];
  documentName: string;
  document: string;
  documentNamesSplit: string[] = [];
  docMsg;
  rootDocLength;
  financialData;
  financialKeys;
  loanTagEnum = LoanTag;
  isShareLoan = false;
  @Input() combinedLoan: any;
  @Input() combinedLoanAllApproved: any;

  constructor(
      private fiscalYearService: FiscalYearService,
      private toastService: ToastService,
      private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.currentIndex = this.loanDataHolder.previousList.length;
    this.loanCategory = this.loanDataHolder.loanCategory;

    if (this.loanDataHolder.loanHolder.clientType === 'CONSUMER_FINANCE') {
      this.consumerFinance = true;
    } else if (this.loanDataHolder.loanHolder.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES' && this.loanDataHolder.loanHolder.customerType === 'INSTITUTION') {
      this.smallBusiness = true;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal;
      this.proposalSummary = true;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.checkedData = JSON.parse(this.loanDataHolder.proposal.checkedData);
      this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.netTradingAssets)) {
      this.netTradingAssetsData = this.loanDataHolder.loanHolder.netTradingAssets;
      this.netTradingAssetsSummary = true;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loan.paperChecklist)) {
      const obj = JSON.parse(this.loanDataHolder.loan.paperChecklist);
      this.checklistChecked = obj.checklistChecked;
    }
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
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.financial)) {
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.financial.data)) {
        this.financialData = JSON.parse(this.loanDataHolder.loanHolder.financial.data);
        this.financialKeys = Object.keys(this.financialData);
      }
    }
    // getting fiscal years
    this.getFiscalYears();
    this.flagShareSecurity();
  }
  getFiscalYears() {
    this.fiscalYearService.getAll().subscribe(response => {
      this.fiscalYearArray = response.detail;
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
    });
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

  public customSafePipe(val) {
    return val.replace(/(<([^>]+)>)/gi, ' ');
  }

  open(comments) {
    const modalRef = this.modalService.open(ReadmoreModelComponent, {size: 'lg'});
    modalRef.componentInstance.comments = comments;
  }

  flagShareSecurity() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.combinedLoan)) {
      let customerLen = 0;
      let finalSelectedArr = [];
      if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
        customerLen = !ObjectUtil.isEmpty(this.combinedLoanAllApproved) ? this.combinedLoanAllApproved.length : 0;
        finalSelectedArr = this.combinedLoanAllApproved;
      } else {
        customerLen = !ObjectUtil.isEmpty(this.combinedLoan) ? this.combinedLoan.length : 0;
        finalSelectedArr = this.combinedLoan;
      }
      if (customerLen >= 1) {
        let finalData: any;
        if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
          finalData = finalSelectedArr.filter((data) => data.loan.loanTag
              === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY));
        } else {
          finalData = finalSelectedArr.filter((data) => data.loan.loanTag
              === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY) && data.documentStatus.toString() !== 'APPROVED');
        }
        if (finalData.length >= 1) {
          this.isShareLoan = true;
        } else {
          this.isShareLoan = this.loanDataHolder.loan.loanTag === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY);
        }
      } else {
        this.isShareLoan = false;
      }
    } else {
      this.isShareLoan = this.loanDataHolder.loan.loanTag === this.loanTagEnum.getKeyByValue(LoanTag.SHARE_SECURITY);
    }
  }
}
