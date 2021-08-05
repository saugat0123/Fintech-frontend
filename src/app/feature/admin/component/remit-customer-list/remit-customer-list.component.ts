import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'app-remit-customer-component',
    templateUrl: './remit-customer-list.component.html',
    styleUrls: ['./remit-customer-list.component.scss']
})
export class RemitCustomerListComponent implements OnInit {

    customerList = [{
        id: 1,
        name: 'Test 1',
        phoneNo: '12345',
        email: 'test@gmail.com',
        loanAmount: '2345',
        address: 'Test'
    },
        {id: 2, name: 'Test 2', phoneNo: '12345', email: 'test2@gmail.com', loanAmount: '2345', address: 'Test'},
        {id: 3, name: 'Test 3', phoneNo: '12345', email: 'test3@gmail.com', loanAmount: '2345', address: 'Test'},
        {id: 4, name: 'Test 4', phoneNo: '12345', email: 'test4@gmail.com', loanAmount: '2345', address: 'Test'},
        {id: 5, name: 'Test 5', phoneNo: '12345', email: 'test5@gmail.com', loanAmount: '2345', address: 'Test'}
    ];

    ngOnInit(): void {
        console.log('customer list', this.customerList);
    }
}
