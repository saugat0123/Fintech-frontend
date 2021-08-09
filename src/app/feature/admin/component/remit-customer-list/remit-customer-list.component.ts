import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NbToastrService} from '@nebular/theme';

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
                private toastService: NbToastrService,
    ) {
    }

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

    addMember(event, data, template) {
        this.onBoardData = data;
        console.log('on board data', data);
        event.stopPropagation();
        this.modalService.open(template);

    }

    onBoardMember() {
        console.log('member onboarded');
        this.modalService.dismissAll();
        // this.onBoardSpinner = true;
        // ((this.onBoardData.memberId, this.onBoardData.memId, this.onBoardData.fullName, this.onBoardData.branchId)).subscribe(() => {
            // this.getData();
            // this.onBoardSpinner = false;
            // this.toastService.success('Successfully Onboard Member', 'Member');
        // }, err => {
        //     this.onBoardSpinner = false;
        //     this.toastService.danger(('Already Onboard in System'), 'Member');
        //     throw err;
        // });
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
