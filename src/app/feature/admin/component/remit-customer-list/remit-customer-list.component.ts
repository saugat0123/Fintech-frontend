import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NbToastrService} from '@nebular/theme';
import {CustomerService} from "../../../customer/service/customer.service";
import {Customer} from "../../modal/customer";

@Component({
    selector: 'app-remit-customer-component',
    templateUrl: './remit-customer-list.component.html',
    styleUrls: ['./remit-customer-list.component.scss']
})
export class RemitCustomerListComponent implements OnInit {

    onBoardData;
    onBoardSpinner = false;



    constructor(private router: Router,
                public modalService: NgbModal,
                private customerService: CustomerService,
                private toastService: NbToastrService,
    ) {
    }

    customerList = [{
        id: 1,
        customerName: 'Test 1',
        phoneNo: '12345',
        email: 'test@gmail.com',
        loanAmount: '2345',
        address: 'Test',
        citizenshipNumber: '12345'
    },
        {id: 2, customerName: 'Test 2', phoneNo: '12345', email: 'test2@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '12345'},
        {id: 3, customerName: 'Test 3', phoneNo: '12345', email: 'test3@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '12345'},
        {id: 4, customerName: 'Test 4', phoneNo: '12345', email: 'test4@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '12345'},
        {id: 5, customerName: 'Test 5', phoneNo: '12345', email: 'test5@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '12345'}
    ];

    ngOnInit(): void {
        console.log('customer list', this.customerList);
    }

    addMember(event, data, template) {
        this.onBoardData = data;
        console.log('on board data', data);
        event.stopPropagation();
        this.modalService.open(template);

    }

    onBoardMember() {
        console.log('onboard data', this.onBoardData);
        console.log('member onboarded');
        this.modalService.dismissAll();
        this.onBoardSpinner = true;
        let customer : Customer;
        this.customerService.onBoardRemitCustoer(this.onBoardData).subscribe(() => {
            // this.getData();
            this.onBoardSpinner = false;
            this.toastService.success('Successfully Onboard Remit Customer', 'Customer');
        }, err => {
            this.onBoardSpinner = false;
            this.toastService.danger(('Already Onboard in System'), 'Customer');
            throw err;
        });
    }

    customerProfile(associateId, id, customerType) {
            this.router.navigate(['/home/customer/profile/' + associateId], {
                queryParams: {
                    customerType: customerType,
                    customerInfoId: id
                }
            });
    }
}
