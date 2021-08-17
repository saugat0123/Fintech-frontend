import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {CustomerService} from '../../../customer/service/customer.service';
import {Customer} from '../../modal/customer';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RoleType} from '../../modal/roleType';
import {RemitCustomerService} from "./service/remit-customer.service";


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
    remitCustomerList: any;
    searchObj = {};
    shipped: any;

    constructor(private router: Router,
                public modalService: NgbModal, private dialogService: NbDialogService,
                private customerService: CustomerService,
                private remitCustomerService: RemitCustomerService,
                private toastService: NbToastrService,
    ) {
    }

    ngOnInit(): void {
        this.remitCustomerService.getRemitCustomerList().subscribe(res => {
            this.remitCustomerList = res.detail;
            console.log('remit customer list', this.remitCustomerList);
        });
        if (LocalStorageUtil.getStorage().username === 'SPADMIN' || LocalStorageUtil.getStorage().roleType === 'ADMIN') {
            this.transferDoc = true;
        }
    }

    addMember(event, data, template) {
        this.onBoardData = data;
        console.log('on board data', data);
        event.stopPropagation();
        this.modalService.open(template);
    }

    transferCustomer(event, data, template) {
        console.log('event', event);
        console.log('data', data);
        console.log('template', template);
        this.onBoardData = data;
        event.stopPropagation();
        this.modalService.open(template);
    }

    viewData(event, Id, data, template) {
        this.selectedId = Id;
        this.selectedIdData = data;
        event.stopPropagation();
        this.dialogService.open(template, {
            closeOnBackdropClick: false,
            closeOnEsc: false,
            hasBackdrop: false,
            hasScroll: true
        });
    }

    onBoardMember() {
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

    customerTransferToInstituition() {
        console.log('inside customer transfer');
        this.onBoardData.shipped = this.shipped;
        console.log('customer final data', this.onBoardData);
        this.modalService.dismissAll();
        this.onBoardSpinner = true;
        this.remitCustomerService.saveRemitCustomer(this.onBoardData).subscribe((res) => {
            console.log('api called', res);
            this.onBoardSpinner = false;
            this.toastService.success('Successfully Transferred to ' + `${this.shipped}`);
        }, error => {
            this.onBoardSpinner = false;
            this.toastService.success('Failed to transfer to');
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

    onChange(value: any) {
        this.shipped = value;
        console.log('on change value', this.shipped);
    }
}
