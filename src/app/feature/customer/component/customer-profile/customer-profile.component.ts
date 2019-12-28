import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../service/customer.service';
import {ToastService} from '../../../../@core/utils';
import {Customer} from '../../../admin/modal/customer';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanType} from '../../../loan/model/loanType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';

@Component({
    selector: 'app-customer-profile',
    templateUrl: './customer-profile.component.html',
    styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
    id: number;
    customer: Customer = new Customer();
    customerLoanList = [];
    loanType = LoanType;
    loanList = [];
    businessOrPersonal;
    loanId;
    spinner = false;

    applyForm = {
        loanId: undefined,
        loanCategory: undefined,
        customerProfileId: undefined
    };

    constructor(private route: ActivatedRoute,
                private customerService: CustomerService,
                private customerLoanService: LoanFormService,
                private toastService: ToastService,
                private router: Router,
                private modalService: NgbModal,
                private loanConfigService: LoanConfigService,) {
    }

    ngOnInit() {
        this.id = this.route.snapshot.params.id;
        this.customerService.detail(this.id).subscribe((res: any) => {
            this.customer = res.detail;
            console.log(this.customer);
        });
        this.getCustomerLoans();
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanList = response.detail;

        });

    }

    getCustomerLoans() {
        this.customerLoanService.getLoansByCustomerIdCustomerProfileLoan(this.id).subscribe((res: any) => {
            this.customerLoanList = res.detail;
        });
    }

    openSelectLoanTemplate(template: TemplateRef<any>) {
        this.modalService.open(template);

    }

    onClose() {
        this.modalService.dismissAll();
    }

    openLoanForm() {
        this.onClose();
        this.spinner = true;
        alert(this.applyForm.loanId);
        this.router.navigate(['/home/loan/loanForm'], {
            queryParams: {
                loanId: this.applyForm.loanId,
                customerId: null,
                loanCategory: this.applyForm.loanCategory,
                customerProfileId: this.id
            }
        });
    }


}
