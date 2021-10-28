import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Proposal} from '../../admin/modal/proposal';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {CompanyInfo} from '../../admin/modal/company-info';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';

@Component({
    selector: 'app-gamma-detail-view',
    templateUrl: './gamma-detail-view.component.html',
    styleUrls: ['./gamma-detail-view.component.scss']
})
export class GammaDetailViewComponent implements OnInit {
    @Input() loanDataHolder;
    @Input() loanHolder;
    @Input() calendarType;
    @Input() loanId;
    @Input() comment;
    @Input() formData;
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
    proposalAllData;
    companyInfo = CompanyInfo;
    companyJsonData;
    individualJsonData;
    jointCustomerData: any;
    isJointCustomer = false;
    siteVisitDocuments: Array<SiteVisitDocument>;
    @Output() documents = new EventEmitter();

    constructor(private customerLoanService: LoanFormService,
                private combinedLoanService: CombinedLoanService,
                private fiscalYearService: FiscalYearService) {
        this.showCadDoc = this.productUtils.CAD_LITE_VERSION;
    }

    ngOnInit() {
        this.getAllLoans(this.loanDataHolder.loanHolder.id);
        this.fiscalYearService.getAll().subscribe(res => {
            this.fiscalYearArray = res.detail;
        });
        if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
            this.proposalData = this.loanDataHolder.proposal;
            this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)) {
            this.companyJsonData = JSON.parse(this.loanDataHolder.companyInfo.companyJsonData);
        }
        if (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
            this.individualJsonData = JSON.parse(this.loanDataHolder.customerInfo.individualJsonData);
            if (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo.jointInfo)) {
                this.jointCustomerData = JSON.parse(this.loanDataHolder.customerInfo.jointInfo);
                this.isJointCustomer = true;
            }
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
                if (this.customerAllLoanList.filter((l) => l.id === this.loanDataHolder.id).length < 1) {
                    this.customerAllLoanList.push(this.loanDataHolder);
                }
                if (this.loanDataHolder.documentStatus.toString() === 'APPROVED') {
                    this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.id === this.loanDataHolder.id);
                } else if (this.loanDataHolder.documentStatus.toString() === 'REJECTED') {
                    this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.documentStatus === 'REJECTED');
                } else {
                    this.customerAllLoanList = this.customerAllLoanList.filter((c: any) => c.currentStage.docAction !== 'APPROVED'
                        && c.documentStatus !== 'REJECTED');
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

}
