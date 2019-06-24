import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {Applicant} from './model/applicant';
import {LoanNepali} from './model/loanNepali';
import {Customer} from '../../../../admin/modal/customer';

@Component({
    selector: 'app-offer-letter-nepali',
    templateUrl: './offer-letter-nepali.component.html',
    styleUrls: ['./offer-letter-nepali.component.scss']
})
export class OfferLetterNepaliComponent implements OnInit {
    id;
    show = false;
    applicant: Applicant;
    applicantList: Array<Applicant> = new Array<Applicant>();
    list: Array<Customer> = new Array<Customer>();
    loanNepali: LoanNepali = new LoanNepali();
    loanDataHolder: LoanDataHolder = new LoanDataHolder();

    constructor(private activatedRoute: ActivatedRoute,
                private loanFormService: LoanFormService) {
    }

    ngOnInit() {
        this.id = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
        this.loanFormService.detail(this.id).subscribe((response: any) => {
            this.loanDataHolder = response.detail;
            this.list.push(response.detail.customerInfo);
            this.list.forEach((value => {
                const customer = new Applicant();
                this.applicantList.push(customer);
                this.loanNepali.applicants = this.applicantList;
            }));
            this.loanNepali.applicants = this.applicantList;
            console.log(this.applicantList);
        }, error => {
            const customer = new Applicant();
            this.applicantList.push(customer);
            this.loanNepali.applicants = this.applicantList;
        });
    }
    data() {
        this.show = !this.show;
    }

}
