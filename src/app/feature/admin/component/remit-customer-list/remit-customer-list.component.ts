import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {CustomerService} from '../../../customer/service/customer.service';
import {Customer} from '../../modal/customer';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RemitCustomerService} from "./service/remit-customer.service";
import {BranchService} from "../branch/branch.service";


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
    user: any;
    branchList: any;
    selectedValue: any;

    constructor(private router: Router,
                public modalService: NgbModal, private dialogService: NbDialogService,
                private customerService: CustomerService,
                private remitCustomerService: RemitCustomerService,
                private toastService: NbToastrService,
                private branchService: BranchService
    ) {
    }

    ngOnInit(): void {
        this.branchService.getBranchAccessByCurrentUser().subscribe((res: any) => {
            this.branchList = res.detail;
        });
        this.user = LocalStorageUtil.getStorage();
        this.remitCustomerService.getRemitCustomerList().subscribe(res => {
            this.remitCustomerList = res.detail;
            if (this.user.roleType === 'COMMITTEE') {
                this.remitCustomerList = this.remitCustomerList.filter(remit => remit.shipped === 'BANK');
            }
            if (this.user.roleType === 'MAKER') {
                let dummyRemit = [];
                this.remitCustomerList.forEach(remit => {
                    if (remit.branch) {
                        if (remit.branch.id == this.user.branch) {
                            dummyRemit.push(remit);
                        }
                    }
                });
                this.remitCustomerList = dummyRemit;
            }
        });
        if (LocalStorageUtil.getStorage().username === 'SPADMIN' || LocalStorageUtil.getStorage().roleType === 'ADMIN') {
            this.transferDoc = true;
        }
    }

    addMember(event, data, template) {
        this.onBoardData = data;
        event.stopPropagation();
        this.modalService.open(template);
    }

    transferCustomer(event, data, template) {
        this.onBoardData = data;
        event.stopPropagation();
        this.modalService.open(template);
    }

    sendToBranch(event, data, template) {
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
        this.onBoardData.shipped = this.shipped;
        this.modalService.dismissAll();
        this.onBoardSpinner = true;
        this.remitCustomerService.saveRemitCustomer(this.onBoardData).subscribe((res) => {
            this.onBoardData.alreadyTransferred = true;
            this.onBoardSpinner = false;
            this.toastService.success('Successfully Transferred to ' + `${this.shipped}`);
        }, error => {
            this.onBoardSpinner = false;
            this.toastService.success('Failed to transfer to');
        });
    }

    customerTransferToBranch() {
        this.modalService.dismissAll();
        this.remitCustomerService.saveRemitCustomer(this.onBoardData).subscribe((res) => {
            this.onBoardData.sendToBranch = true;
            this.toastService.success('Successfully Send to branch');
        }, error => {
            this.toastService.success('Failed to send to branch');
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

    onBranchChange(branchList: any, branchId: any) {
        let bId = branchId.target.value;
        let branch = branchList.filter(b => b.id == bId);
        this.onBoardData.branch = branch[0];
    }

    onInstituitionChange(value: any) {
        this.shipped = value;
    }

}
