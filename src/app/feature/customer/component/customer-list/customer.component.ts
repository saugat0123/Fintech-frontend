import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';

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

    constructor(private customerService: CustomerService,
                private toastService: ToastService,
                private router: Router) {
    }

    static loadData(other: CustomerComponent) {
        other.spinner = true;
        other.customerService.getCustomerList(other.search, other.page, 10).subscribe((response: any) => {
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
        CustomerComponent.loadData(this);
    }


    changePage(page: number) {
        this.page = page;
        CustomerComponent.loadData(this);
    }

    customerProfile(id) {

        this.router.navigate(['/home/customer/profile/' + id]);
    }


}
