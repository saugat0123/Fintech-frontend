import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';

@Component({
    selector: 'app-all-template-details',
    templateUrl: './all-template-details.component.html',
    styleUrls: ['./all-template-details.component.scss']
})
export class AllTemplateDetailsComponent implements OnInit {
  customerLoanData: LoanDataHolder;

    constructor(private activatedRoute: ActivatedRoute,
                private customerLoanService: LoanFormService) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.customerLoanService.detail(params.customerId).subscribe(response => {
                this.customerLoanData = response.detail;
            });
        });
    }

}
