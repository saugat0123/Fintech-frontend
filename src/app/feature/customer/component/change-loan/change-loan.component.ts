import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {CustomerType} from '../../model/customerType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastService} from '../../../../@core/utils';
import {Status} from '../../../../@core/Status';
import {LoginPopUp} from '../../../../@core/login-popup/login-pop-up';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

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
                private modalService: NgbModal,
                private loanFormService: LoanFormService,
                private spinnerService: NgxSpinnerService,
                private toastService: ToastService) {
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
                // tslint:disable-next-line:max-line-length
                this.loanList = response.detail.filter((f) => f.loanTag === 'MICRO_LOAN' && f.status === Status.ACTIVE && f.id !== this.currentLoanConfigId);

            } else {
                // tslint:disable-next-line:max-line-length
                this.loanList = response.detail.filter((f) => f.loanTag !== 'MICRO_LOAN' && f.status === Status.ACTIVE && f.id !== this.currentLoanConfigId);
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


    submit(template) {
        if (this.changeLoanForm.invalid) {
            return;
        }
        const ref = this.modalService.open(LoginPopUp);
        let isAuthorized = false;
        ref.componentInstance.returnAuthorizedState.subscribe((receivedEntry) => {
            isAuthorized = receivedEntry;
            if (isAuthorized) {
                this.modalService.dismissAll();
                this.spinnerService.show();
                const loanConfigID = this.changeLoanForm.get('loanId').value;
                // tslint:disable-next-line:max-line-length
                this.loanFormService.changeLoanConfigByCustomerLoanIdAndLoanConfigID(this.customerLoanId, loanConfigID).subscribe((res: any) => {
                    this.spinnerService.hide();
                    this.router.navigate(['/home/loan/loanForm'], {
                        queryParams: {
                            loanId: loanConfigID,
                            customerId: this.customerLoanId,
                            loanCategory: this.customerType
                        }
                    });
                    setTimeout(() => {
                        this.openTemplate(template);
                    }, 2000);
                }, error => {
                    this.spinnerService.hide();
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Switch Loan'));

                });
            }
        });

    }

    close() {
        this.modalService.dismissAll();
    }

    openTemplate(template) {
        this.modalService.open(template);
    }

}
