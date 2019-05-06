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
    index = 0;

    constructor(
        private customerDataService: CustomerDataService
    ) {
    }

    ngOnInit() {
        this.navigations = new Array<Navigation>(
            {id: ++this.index, name: 'Account Details'},
            {id: ++this.index, name: 'Applicant Personal Details'},
            {id: ++this.index, name: 'Employment Details'},
            {id: ++this.index, name: 'Beneficiary Details'},
            {id: ++this.index, name: 'Nominee Details'},
            {id: ++this.index, name: 'Required Service'},
            {id: ++this.index, name: 'Declarations'},
            {id: ++this.index, name: 'Upload'}
        );
        this.customerDataService.totalNavsCount = this.navigations.length;
    }


}
