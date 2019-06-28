import { Component, OnInit } from '@angular/core';
import {Applicant} from '../model/applicant';
import {Customer} from '../../../../admin/modal/customer';
import {LoanNepali} from '../model/loanNepali';
import {LoanDataHolder} from '../../../model/loanData';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan-form/service/loan-form.service';

@Component({
  selector: 'app-success-offer-letter',
  templateUrl: './success-offer-letter.component.html',
  styleUrls: ['./success-offer-letter.component.scss']
})
export class SuccessOfferLetterComponent implements OnInit {
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
