import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanType} from '../../../loan/model/loanType';
import {CustomerService} from '../../service/customer.service';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {Customer} from '../../../admin/modal/customer';
import {CustomerRelative} from '../../../admin/modal/customer-relative';
import {LoanAmountType} from '../../model/loanAmountType';
import {FetchLoan} from '../../model/fetchLoan';


@Component({
    selector: 'app-customer-group-loan',
    templateUrl: './customer-group-loan.component.html',
    styleUrls: ['./customer-group-loan.component.scss']
})
export class CustomerGroupLoanComponent implements OnInit, OnChanges {
    @Input()
    formValue: Customer;
    customer: Customer;

    @Input()
    fetchType: FetchLoan;

    @Output() messageToEmit: EventEmitter<LoanAmountType> = new EventEmitter();

    fetchLoan = FetchLoan;
    @Input()
    total: number;
    spinner = false;
    customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
    loanAssociatedByKYC: Array<LoanDataHolder> = Array<LoanDataHolder>();
    loanAssociatedByGuarantor: Array<LoanDataHolder> = Array<LoanDataHolder>();
    loanType = LoanType;
    totalLoanProposedAmount = 0;
    totalProposedAmountByKYC = 0;
    totalProposalAmount = 0;
    totalProposedAmountByGuarantor = 0;


    constructor(private router: Router,
                private customerService: CustomerService,
                private customerLoanService: LoanFormService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initial();

    }

    ngOnInit() {
        this.initial();
    }

    getCustomerLoans() {
        this.spinner = true;
        this.customerLoanService.getLoansByCustomerIdCustomerProfileLoan(this.customer.id).subscribe((res: any) => {
            this.customerGroupLoanList = res.detail;
            this.spinner = false;
            this.customerGroupLoanList.forEach(l => {
                    if (l.proposal) {
                        this.totalLoanProposedAmount = this.totalLoanProposedAmount + l.proposal.proposedLimit;
                    }
                }
            );
            const loanAmountType = new LoanAmountType();
            loanAmountType.type = this.fetchLoan.CUSTOMER_LOAN;
            loanAmountType.value = this.totalLoanProposedAmount;
            this.messageToEmit.emit(loanAmountType);
        });
    }


    getLoanOfCustomerAssociatedToByKYCAndSecurity() {
        this.spinner = true;
        const customerRelative = new CustomerRelative();
        customerRelative.customerRelativeName = this.customer.customerName;
        customerRelative.citizenshipNumber = this.customer.citizenshipNumber;
        customerRelative.citizenshipIssuedDate = this.customer.citizenshipIssuedDate;
        this.customerLoanService.getLoanByCustomerKyc(customerRelative).subscribe((res: any) => {
            this.customerGroupLoanList = res.detail;
            this.spinner = false;
            this.customerGroupLoanList.forEach((l) => {
                if (l.proposal) {
                    this.totalProposedAmountByKYC = this.totalProposedAmountByKYC + l.proposal.proposedLimit;
                }

            });
            const loanAmountType = new LoanAmountType();
            loanAmountType.type = this.fetchLoan.CUSTOMER_AS_KYC;
            loanAmountType.value = this.totalProposedAmountByKYC;
            this.messageToEmit.emit(loanAmountType);
        });
    }

    onClick(loanConfigId: number, customerId: number) {
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId,
                catalogue: true
            }
        });
    }

    initial() {
        this.customer = this.formValue;
        if (this.fetchType === this.fetchLoan.CUSTOMER_LOAN) {
            if (this.customer.id !== undefined) {
                this.getCustomerLoans();
            }
        }
        if (this.fetchType === this.fetchLoan.CUSTOMER_AS_KYC) {
            if (this.customer.id !== undefined) {
                this.getLoanOfCustomerAssociatedToByKYCAndSecurity();
            }
        }
    }

}
