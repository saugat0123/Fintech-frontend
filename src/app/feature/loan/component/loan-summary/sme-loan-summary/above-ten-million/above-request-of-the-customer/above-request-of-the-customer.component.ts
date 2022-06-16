import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';

@Component({
    selector: 'app-above-request-of-the-customer',
    templateUrl: './above-request-of-the-customer.component.html',
    styleUrls: ['./above-request-of-the-customer.component.scss'],
})
export class AboveRequestOfTheCustomerComponent implements OnInit {
    @Input() customerAllLoanList: LoanDataHolder[];

    constructor() {
    }

    creditFacilities = ['.....', '.....', '.....', '.....'];

    ngOnInit() {
    }
}
