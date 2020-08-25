import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanType} from '../../../loan/model/loanType';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';

@Component({
    selector: 'app-customer-component',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

    page = 1;
    spinner = false;
    search = {};
    customerList = [];
    pageable: Pageable = new Pageable();
    isFilterCollapsed = true;
    filterForm: FormGroup;
    loanType = LoanType;

    constructor(private customerService: CustomerService,
                private toastService: ToastService,
                private customerLoanService: LoanFormService,
                private router: Router,
                private formBuilder: FormBuilder) {
    }

    static loadData(other: CustomerComponent) {
        other.spinner = true;
        other.customerLoanService.getCustomerFromCustomerLoan(other.filterForm.value, other.page, 10).subscribe((response: any) => {
            other.customerList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;

        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Customer!'));
            other.spinner = false;

        });

    }

    ngOnInit() {
        this.buildFilterForm();
        CustomerComponent.loadData(this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({

            companyName: [undefined],
            customerName: [undefined],
        });
    }


    changePage(page: number) {
        this.page = page;
        CustomerComponent.loadData(this);
    }

    customerProfile(id) {

        this.router.navigate(['/home/customer/profile/' + id]);
    }

    onSearch() {
        CustomerComponent.loadData(this);

    }

    getCsv() {
    }


}
