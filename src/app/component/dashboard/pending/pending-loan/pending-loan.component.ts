import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';
import {CatalogueSearch, CatalogueService} from '../../../../feature/admin/component/catalogue/catalogue.service';
import {DocStatus} from '../../../../feature/loan/model/docStatus';
import {CustomerOfferLetterService} from '../../../../feature/loan/service/customer-offer-letter.service';
import {ProductUtils} from '../../../../feature/admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {CreditAdministrationService} from '../../../../feature/credit-administration/service/credit-administration.service';
import {PendingSearch, PendingService} from '../pending.service';
import {search} from 'ionicons/icons';
import {LoanType} from '../../../../feature/loan/model/loanType';


@Component({
    selector: 'app-pending-loan',
    templateUrl: './pending-loan.component.html',
    styleUrls: ['./pending-loan.component.css']
})
export class PendingLoanComponent implements OnInit {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    closedCount: number;
    initCount: number;
    postApprovalDocStat;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    renewedLoanCount: number;
    closureLoanCount: number;
    enhancedLoanCount: number;
    partialSettleLoanCount: number;
    newLoanCount: number;
    fullSettlementLoanCount: number;
    renewWithEnhancementLoanCount: number;


    constructor(
        private router: Router,
        private loanFormService: LoanFormService,
        private catalogueService: CatalogueService,
        private customerOfferLetterService: CustomerOfferLetterService,
        private pendingService: PendingService,
    ) {
    }

    ngOnInit() {

        this.getPostApprovalDocStat();
        this.loanFormService.getStatus().subscribe(
            (response: any) => {
                this.pendingCount = response.detail.pending;
                this.approvedCount = response.detail.Approved;
                this.rejectedCount = response.detail.Rejected;
                this.closedCount = response.detail.Closed;
                this.initCount = response.detail.initial;
            }
        );
        this.loanFormService.getpendingLoansCount().subscribe(res =>{
            this.newLoanCount = res.detail.newLoan;
            this.enhancedLoanCount = res.detail.enhancedLoan;
            this.partialSettleLoanCount = res.detail.partialSettleLoan;
            this.closureLoanCount = res.detail.closureLoan;
            this.renewedLoanCount = res.detail.renewedLoan;
            this.renewWithEnhancementLoanCount = res.detail.renewWithEnhancement;
            this.fullSettlementLoanCount = res.detail.fullSettleLoan;



        })
    }

    resolveToCatalogue(status: string) {
        const search: CatalogueSearch = new CatalogueSearch();
        if (status === 'approved') {
            search.documentStatus = DocStatus.value(DocStatus.APPROVED);
        } else if (status === 'rejected') {
            search.documentStatus = DocStatus.value(DocStatus.REJECTED);
        } else if (status === 'closed') {
            search.documentStatus = DocStatus.value(DocStatus.CLOSED);
        }
        this.catalogueService.search = search;
        this.router.navigate(['/home/admin/catalogue'], {
            queryParams: {
                redirect: true,
                search: search.documentStatus
            }
        });
    }
    getPendingNewLoan(loanType: any) {
        const Search: PendingSearch = new PendingSearch();

        if(loanType === 'NEW_LOAN'){
            Search.loanType === LoanType.NEW_LOAN
        }else if(loanType === 'RENEWED_LOAN'){
            Search.loanType === LoanType.RENEWED_LOAN
        }else if(loanType === 'CLOSURE_LOAN'){
            Search.loanType === LoanType.CLOSURE_LOAN
        }else if(loanType === 'ENHANCED_LOAN'){
            Search.loanType === LoanType.ENHANCED_LOAN
        }else if(loanType === 'PARTIAL_SETTLEMENT_LOAN'){
            Search.loanType === LoanType.PARTIAL_SETTLEMENT_LOAN
        }else if(loanType === 'FULL_SETTLEMENT_LOAN'){
            Search.loanType === LoanType.FULL_SETTLEMENT_LOAN
        }else if(loanType === 'RENEW_WITH_ENHANCEMENT'){
            Search.loanType === LoanType.RENEW_WITH_ENHANCEMENT
        }
        this.pendingService.search = Search;
        this.router.navigate(['/home/status/PENDING'], {
            queryParams: {
                search: Search.loanType,
                type: loanType
            }
        });


    }


    getPostApprovalDocStat() {
        this.customerOfferLetterService.getPostApprovedDocStat().subscribe((res: any) => {
            this.postApprovalDocStat = res.detail;
        });
    }
}
