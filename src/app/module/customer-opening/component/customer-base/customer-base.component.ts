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
            {id: 1, name: 'Account Details'},
            {id: 2, name: 'Applicant Personal Details'},
            {id: 3, name: 'Employment Details'},
            {id: 4, name: 'Joint Applicant'},
            {id: 5, name: 'Beneficiary Details'},
            {id: 6, name: 'Nominee Details'},
            {id: 7, name: 'Required Service'},
            {id: 8, name: 'Declarations'},
            {id: 9, name: 'Upload'}
        );
        this.customerDataService.totalNavsCount = this.navigations.length;
    }


}
