import {Component, OnInit} from '@angular/core';
import {Navigation} from '../../model/navigation';
import {CustomerDataService} from '../../service/customer-data.service';

@Component({
    selector: 'app-customer-base',
    templateUrl: './customer-base.component.html',
    styleUrls: ['./customer-base.component.css']
})
export class CustomerBaseComponent implements OnInit {

    public navigations: Array<Navigation>;

    constructor(
        private customerDataService: CustomerDataService
    ) {
    }

    ngOnInit() {
        this.navigations = new Array<Navigation>(
            {id: 1, name: 'Existing Account Detail'},
            {id: 2, name: 'Account Type'},
            {id: 3, name: 'Applicant Personal Details'},
            {id: 4, name: 'Employment Details'},
            {id: 5, name: 'Joint Applicant'},
            {id: 6, name: 'Beneficiary Details'},
            {id: 7, name: 'Nominee Details'},
            {id: 8, name: 'Required Service'},
            {id: 9, name: 'Declarations'},
            {id: 10, name: 'Upload'}
        );
        this.customerDataService.totalNavsCount = this.navigations.length;
    }


}
