import {Component, Input, OnInit} from '@angular/core';
import {CustomerOfferLetter} from '../../model/customer-offer-letter';
import {Router} from "@angular/router";
import {LoanDataHolder} from "../../model/loanData";

@Component({
    selector: 'app-post-approval-form',
    templateUrl: './post-approval-form.component.html',
    styleUrls: ['./post-approval-form.component.scss']
})
export class PostApprovalFormComponent implements OnInit {

    @Input()
    customerOfferLetterList: Array<CustomerOfferLetter>;


    constructor(private router: Router,) {
    }

    ngOnInit() {
    }

    generateOfferLetter(customerLoan: LoanDataHolder) {
        this.router.navigate(['/home/loan/offer-letter'],
            {
                queryParams: {
                    customerId: customerLoan.id,
                }
            });
    }
}
