import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {Customer} from '../../../../admin/modal/customer';
import {Applicant} from '../model/applicant';
import {LoanNepali} from '../model/loanNepali';

@Component({
    selector: 'app-birth-mark-letter-nepali',
    templateUrl: './birth-mark-letter-nepali.component.html',
    styleUrls: ['./birth-mark-letter-nepali.component.scss']
})
export class BirthMarkLetterNepaliComponent implements OnInit {
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
