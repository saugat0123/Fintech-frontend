import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanType} from '../../../loan/model/loanType';

@Component({
    selector: 'app-customer-group-loan',
    templateUrl: './customer-group-loan.component.html',
    styleUrls: ['./customer-group-loan.component.scss']
})
export class CustomerGroupLoanComponent implements OnInit, OnChanges {
    @Input()
    formValue: Array<LoanDataHolder>;

    @Input()
    total: number;
    spinner = false;
    customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
    loanType = LoanType;


    constructor(private router: Router) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.customerGroupLoanList = this.formValue;


    }

    ngOnInit() {

    }

    onClick(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId,
                catalogue: true
            }
        });
    }

}
