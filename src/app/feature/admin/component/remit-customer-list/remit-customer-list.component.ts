import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {CustomerService} from '../../../customer/service/customer.service';
import {Customer} from '../../modal/customer';
import {LocalStorageUtil} from "../../../../@core/utils/local-storage-util";
import {RoleType} from "../../modal/roleType";



@Component({
    selector: 'app-remit-customer-component',
    templateUrl: './remit-customer-list.component.html',
    styleUrls: ['./remit-customer-list.component.scss']
})
export class RemitCustomerListComponent implements OnInit {

    onBoardData;
    onBoardSpinner = false;
    selectedId: any;
    selectedIdData: any;
    transferDoc: any;

    constructor(private router: Router,
                public modalService: NgbModal,   private dialogService: NbDialogService,
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
        {id: 2, customerName: 'Test 2', phoneNo: '12345', email: 'test2@gmail.com', loanAmount: '2345', address:{
            country: 'Nepal',
                State: '3',
                District: 'Bhaktapur',
                Municpality: 'Suryabinayak',
                WardNo: '5'
            }, citizenshipNumber: '12345'},
        {id: 3, customerName: 'Test 3', phoneNo: '12345', email: 'test3@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '12345'},
        {id: 4, customerName: 'Test 4', phoneNo: '12345', email: 'test4@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '12345'},
        {id: 5, customerName: 'Test 5', phoneNo: '12345', email: 'test5@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '12345'},
        {id: 6, customerName: 'Test 6', phoneNo: '12345', email: 'test6@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '2222'},
        {id: 7, customerName: 'Test 7', phoneNo: '12345', email: 'test7@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '333'},
        {id: 8, customerName: 'Test 8', phoneNo: '12345', email: 'test8@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '444'},
        {id: 9, customerName: 'Test 9', phoneNo: '12345', email: 'test9@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '555'},
        // tslint:disable-next-line:max-line-length
        {id: 10, customerName: 'Test 10', phoneNo: '12345', email: 'test10@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '666'},
        {id: 11, customerName: 'Test 11', phoneNo: '12345', email: 'test11@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '777'},
        {id: 12, customerName: 'Test 12', phoneNo: '12345', email: 'test12@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '888'},
        {id: 13, customerName: 'Test 13', phoneNo: '12345', email: 'test13@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '999'},
        {id: 14, customerName: 'Test 14', phoneNo: '12345', email: 'test14@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '100'},
        {id: 15, customerName: 'Test 15', phoneNo: '12345', email: 'test15@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '101'},
        {id: 16, customerName: 'Test 16', phoneNo: '12345', email: 'test15@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '102'},
        {id: 17, customerName: 'Test 17', phoneNo: '12345', email: 'test15@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '103'},
        {id: 18, customerName: 'Test 18', phoneNo: '12345', email: 'test18@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '104'},
        {id: 19, customerName: 'Test 19', phoneNo: '12345', email: 'test19@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '105'},
        {id: 20, customerName: 'Test 20', phoneNo: '12345', email: 'test20@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '106'},
        {id: 21, customerName: 'Test 21', phoneNo: '12345', email: 'test21@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '107'},
        {id: 22, customerName: 'Test 22', phoneNo: '12345', email: 'test22@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '108'},
        {id: 23, customerName: 'Test 23', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '109'},
        {id: 24, customerName: 'Test 23', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '110'},
        {id: 25, customerName: 'Test 23', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '111'},
        {id: 26, customerName: 'Test 26', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '112'},
        {id: 27, customerName: 'Test 27', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '113'},
        {id: 28, customerName: 'Test 28', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '114'},
        {id: 29, customerName: 'Test 29', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '115'},
        {id: 30, customerName: 'Test 30', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '116'},
        {id: 31, customerName: 'Test 31', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '117'},
        {id: 32, customerName: 'Test 32', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '118'},
        {id: 33, customerName: 'Test 33', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '119'},
        {id: 34, customerName: 'Test 34', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '120'},
        {id: 35, customerName: 'Test 35', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '121'},
        {id: 36, customerName: 'Test 36', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '122'},
        {id: 37, customerName: 'Test 37', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '123'},
        {id: 38, customerName: 'Test 38', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '124'},
        {id: 39, customerName: 'Test 39', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '125'},
        {id: 40, customerName: 'Test 40', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '126'},
        {id: 41, customerName: 'Test 41', phoneNo: '12345', email: 'test23@gmail.com', loanAmount: '2345', address: 'Test', citizenshipNumber: '127'},
    ];


    ngOnInit(): void {
        console.log('customer list', this.customerList);
        if (LocalStorageUtil.getStorage().username === 'SPADMIN' || LocalStorageUtil.getStorage().roleType === 'ADMIN') {
            this.transferDoc = true;
            console.log('transfer doc',this.transferDoc);
            console.log('user', LocalStorageUtil.getStorage().username);
        }
    }

    addMember(event, data, template) {
        this.onBoardData = data;
        console.log('on board data', data);
        event.stopPropagation();
        this.modalService.open(template);

    }

    transferCustomer(event,data,template){
        console.log('transfer customer');
        this.onBoardData = data;
        console.log('on board data', data);
        event.stopPropagation();
        this.modalService.open(template);
    }

    viewData(event, Id, data, template) {
        this.selectedId = Id;
        this.selectedIdData = data;
        event.stopPropagation();
        this.dialogService.open(template,{
            closeOnBackdropClick: false,
            closeOnEsc: false,
            hasBackdrop: false,
            hasScroll: true
        });
        console.log('selected ID', this.selectedId);
        console.log('selected data', this.selectedIdData);
    }

    onBoardMember() {
        console.log('onboard data', this.onBoardData);
        console.log('member onboarded');
        this.modalService.dismissAll();
        this.onBoardSpinner = true;
        let customer: Customer;
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

    customerTransferToInstituition(){
        console.log('inside customer transfer');
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
