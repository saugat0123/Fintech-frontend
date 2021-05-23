import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {CustomerType} from '../../model/customerType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-change-loan',
    templateUrl: './change-loan.component.html',
    styleUrls: ['./change-loan.component.scss']
})
export class ChangeLoanComponent implements OnInit {
    spinner = false;

    @Input()
    customerType: CustomerType;

    @Input()
    currentLoanConfigId: number;

    @Input()
    isMicroCustomer: boolean;

    loanList = [];

    @Input()
    customerLoanId: number;

    changeLoanForm: FormGroup;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private modalService: NgbActiveModal,
                private loanFormService: LoanFormService) {
    }

    ngOnInit() {

        this.buildForm();
        this.fetchLoan();
    }


    fetchLoan() {
        this.spinner = true;
        this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((response: any) => {
            this.spinner = false;
            if (this.isMicroCustomer) {
                this.loanList = response.detail.filter((f) => f.loanTag === 'MICRO_LOAN');

            } else {
                this.loanList = response.detail.filter((f) => f.loanTag !== 'MICRO_LOAN');
            }
        }, error => {
            this.spinner = false;
        });
    }

    buildForm() {
        this.changeLoanForm = this.formBuilder.group({
            loanId: [undefined, [Validators.required]]
        });
    }


    submit() {

        console.log(this.changeLoanForm.value);

    }

    close() {
        this.modalService.close();
    }

}
