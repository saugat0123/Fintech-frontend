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
import {SummaryType} from '../../loan/component/SummaryType';

@Component({
  selector: 'app-detail-view-base',
  templateUrl: './detail-view-base.component.html',
  styleUrls: ['./detail-view-base.component.scss']
})
export class DetailViewBaseComponent implements OnInit {
  @Input() loanDataHolder;
  @Input() loanHolder;
  @Input() calendarType;
  @Input() loanId;
  @Input() comment;
  @Input() formData;
  fiscalYearArray: Array<FiscalYear>;
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
  checkedData;
  proposalAllData: any;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  spinner = false;
  customerAllLoanList: Array<LoanDataHolder> = [];
  @Output() documents = new EventEmitter();

  constructor(private customerLoanService: LoanFormService,
              private combinedLoanService: CombinedLoanService,
              private fiscalYearService: FiscalYearService) {
    this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
  }

  ngOnInit() {
    console.log('load data holder::', this.loanDataHolder);
    this.getAllLoans(this.loanHolder.id);
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
    this.checkedData = JSON.parse(this.proposalData.checkedData);
    this.proposalAllData = JSON.parse(this.proposalData.data);
  }
  checkSiteVisitDocument(event: any) {
    this.siteVisitDocuments = event;
    this.documents.emit(this.siteVisitDocuments);
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
}
