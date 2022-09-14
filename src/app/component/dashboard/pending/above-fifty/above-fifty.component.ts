import {Component, OnInit} from '@angular/core';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../../feature/loan/model/loanData';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ProposalCalculationUtils} from '../../../../feature/loan/component/loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../../@core/utils/constants/loan-data-key';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SafePipe} from '../../../../feature/memo/pipe/safe.pipe';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-above-fifty',
    templateUrl: './above-fifty.component.html',
    styleUrls: ['./above-fifty.component.scss']
})
export class AboveFiftyComponent implements OnInit {

    constructor(private loanFormService: LoanFormService,
                private router: Router, private modalService: NgbModal,
                private safePipe: SafePipe,
                private spinnerService: NgxSpinnerService) {
    }

    page = 1;
    loanHolderLoanList;
    loanHolderLoanListTemp;
    toggleArray = [];
    loanForCombine = [];
    pageable: Pageable = new Pageable();
    model = new LoanDataHolder();
    displayCombineLoanList: {
        customerInfoId: number,
        loanData: Array<LoanDataHolder>
    };

    static loadData(other: AboveFiftyComponent) {
        other.spinnerService.show();
        const url = other.router.url.split('/');
        other.loanFormService.getAbove(other.page, url[url.length - 1]).subscribe(
            (response: any) => {
                other.loanHolderLoanList = response.detail;
                other.loanHolderLoanListTemp = response.detail;
                other.loanHolderLoanList.forEach(() => other.toggleArray.push({toggled: false}));
                other.loanHolderLoanList.forEach((l) => other.loanForCombine.push(
                    {customerInfoId: l.customerInfo.id, loan: other.getLoansData(l.combineLoanList)}));
              other.spinnerService.hide();
              other.pageable = PaginationUtils.getPageable(response.detail);
            } , error => {
                console.log(error);
                other.spinnerService.hide();
            }
        );
    }

    ngOnInit() {
        AboveFiftyComponent.loadData(this);
    }

    totalCombinedProposed(value: LoanDataHolder[]): number {
        let totalCombinedLoan = 0;
        value.forEach(l => {
            totalCombinedLoan += l.proposal.proposedLimit;
        });
        return totalCombinedLoan;
    }

    public getLoansData(datas) {
        const finalOp = [];
       if (datas.length > 0) {
               let loanData = new LoanDataHolder();
               let name = '';
                   const loanDataList: Array<LoanDataHolder> = datas;
                   loanData = loanDataList[0];
                   // tslint:disable-next-line:max-line-lengthsss
                   loanData.proposal.proposedLimit = ProposalCalculationUtils.calculateTotalFromProposalList(LoanDataKey.PROPOSE_LIMIT, datas);
                   name = loanDataList.map(a => {
                       return a.loan;
                   }).map(b => {
                       return b.name;
                   }).join(',');
                   loanData.loan.name = name;
                   finalOp.push(datas);
       }
        return datas;
    }

    onClick(loanConfigId: number, customerId: number, customerInfoId: number) {
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId,
                customerInfoId: customerInfoId
            }
        });
    }

    openCommentModal(template, data: LoanDataHolder) {
        this.model = new LoanDataHolder();
        this.model = data;
        this.modalService.open(template, {
            size: 'xl',
            windowClass: 'loan-activity full-width modal'
        });
    }

    onClose() {
        this.modalService.dismissAll();
    }

    changePage(page: number) {
        this.page = page;
        AboveFiftyComponent.loadData(this);
    }

    combineLoanListDisplay(data, template, index, customerInfoId: number) {
        const list = this.loanHolderLoanListTemp[index].combineList;
        // const customerInfoId = this.loanHolderLoanListTemp[index].customerInfo;
        // this.displayCombineLoanList = [];
        this.displayCombineLoanList = {
            customerInfoId: null,
            loanData: new Array<LoanDataHolder>()
        };
        list.forEach(l => {
            const input: Map<number, Array<LoanDataHolder>> = l;
            Object.keys(input).forEach(key => {
                if (key.toString() === data.combinedLoan.id.toString()) {
                    this.displayCombineLoanList.customerInfoId = customerInfoId;
                    this.displayCombineLoanList.loanData = input[data.combinedLoan.id];
                }
            });
        });

        this.modalService.open(template, {
            size: 'xl',
            windowClass: 'loan-activity full-width modal',
        });
    }

    onClickLoan(loanConfigId: number, customerLoan: number, customerInfoId: number) {
        this.onClose();
        // this.modalService.dismissAll();
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerLoan,
                customerInfoId: customerInfoId
            }
        });
    }

    public customSafePipe(val) {
        return this.safePipe.transform(val);
    }
}
