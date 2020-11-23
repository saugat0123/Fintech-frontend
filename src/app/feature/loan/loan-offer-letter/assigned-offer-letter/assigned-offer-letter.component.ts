import {Component, Input, OnInit} from '@angular/core';
import {CustomerOfferLetter} from '../../model/customer-offer-letter';
import {LoanDataHolder} from '../../model/loanData';
import {Router} from '@angular/router';

@Component({
    selector: 'app-assigned-offer-letter',
    templateUrl: './assigned-offer-letter.component.html',
    styleUrls: ['./assigned-offer-letter.component.scss']
})
export class AssignedOfferLetterComponent implements OnInit {

    @Input()
    customerOfferLetterList: Array<CustomerOfferLetter>;
    @Input()
    toggleArray: { toggled: boolean }[];

    @Input()
    branchView: boolean;
    constructor(  private router: Router) {
    }

    ngOnInit() {
   }

    generateOfferLetter(customerLoan: LoanDataHolder) {
        this.router.navigate(['/home/cad-document'],
            {
                queryParams: {
                    customerId: customerLoan.id,
                    branchId: customerLoan.branch.id
                }
            });
    }

}
