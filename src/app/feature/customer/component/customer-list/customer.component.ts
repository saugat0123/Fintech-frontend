import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanType} from '../../../loan/model/loanType';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerFormComponent} from '../customer-form/individual-form/customer-form.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CustomerInfoService} from '../../service/customer-info.service';
import {CustomerType} from '../../model/customerType';
import {CompanyFormComponent} from '../customer-form/company-form/company-form.component';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../admin/modal/roleType';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {NgxSpinnerService} from 'ngx-spinner';
import {District} from '../../../admin/modal/district';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {Branch} from '../../../admin/modal/branch';
import {RoleAccess} from '../../../admin/modal/role-access';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {CustomerGroupService} from '../../../admin/component/preference/services/customer-group.service';
import {CustomerGroup} from '../../../admin/modal/customer-group';
import {CompanyInfoService} from '../../../admin/service/company-info.service';
import {Province} from '../../../admin/modal/province';
import {JointFormComponent} from '../customer-form/joint-form/joint-form.component';
import {any} from 'codelyzer/util/function';


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
    isFilterCollapsed = true;
    filterForm: FormGroup;
    loanType = LoanType;
    customerType;
    currentRoleTypeMaker = false;
    allDistrict: Array<District> = Array<District>();
    branchList: Array<Branch> = new Array<Branch>();
    roleAccess: string;
    isMaker = false;

    accessSpecific: boolean;
    accessAll: boolean;
    showBranch = true;
    showBranchProvince = true;
    customerGroupList: Array<CustomerGroup>;
    provinces: Province[];
    onActionChangeSpinner = false;

    constructor(private customerService: CustomerService,
                private toastService: ToastService,
                private modalService: NgbModal,
                private dialogService: NbDialogService,
                private customerLoanService: LoanFormService,
                private router: Router,
                private formBuilder: FormBuilder,
                private customerInfoService: CustomerInfoService,
                private overlay: NgxSpinnerService,
                private commonLocation: AddressService,
                private branchService: BranchService,
                private customerGroupService: CustomerGroupService,
                private companyInfoService: CompanyInfoService,
                private location: AddressService,
    ) {
    }

    static loadData(other: CustomerComponent) {
        other.overlay.show();
        other.spinner = true;
        other.customerInfoService.getPaginationWithSearchObject(other.filterForm.value, other.page, 10).subscribe((response: any) => {
            other.customerList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
            other.overlay.hide();

        }, error => {
            console.error(error);
            other.overlay.hide();
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Customer!'));
            other.spinner = false;

        });
    }

    ngOnInit() {
        this.buildFilterForm();
        CustomerComponent.loadData(this);
        this.getAllDistrict();
        this.getBranch();
        this.getAllGroup();
        const roleType: string = LocalStorageUtil.getStorage().roleType;
        this.currentRoleTypeMaker = roleType === RoleType.MAKER;
        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            name: [undefined],
            customerType: [undefined],
            idRegPlace: [undefined],
            branchIds: [undefined],
            groupId: [undefined],
            provinceId: [undefined]
        });
    }

    private getAllDistrict() {
        this.commonLocation.getAllDistrict().subscribe((response: any) => {
            this.allDistrict = response.detail;
        });
    }

    private getAllGroup() {
        this.customerGroupService.getAll().subscribe((res: any) => {
            this.customerGroupList = res.detail;
        });
    }

    changePage(page: number) {
        this.page = page;
        CustomerComponent.loadData(this);
    }

    /* associate id is customer or company id*/
    customerProfile(associateId, id, customerType) {
        if (CustomerType[customerType] === CustomerType.INDIVIDUAL) {
            this.router.navigate(['/home/customer/profile/' + associateId], {
                queryParams: {
                    customerType: customerType,
                    customerInfoId: id
                }
            });
        } else if (CustomerType[customerType] === CustomerType.INSTITUTION) {
            this.router.navigate(['/home/customer/company-profile/' + associateId],
                {queryParams: {id: id, customerType: customerType, companyInfoId: associateId, customerInfoId: id}});
        }
    }

    onSearch() {
        CustomerComponent.loadData(this);
    }
    openChooseAcType(modal) {
        this.modalService.open(modal);
    }
    openJ

    getForm(chooseAcType) {
        this.onClose();
        if (CustomerType.INDIVIDUAL === CustomerType[this.customerType]) {
            this.openChooseAcType(chooseAcType);
        } else if (CustomerType.INSTITUTION === CustomerType[this.customerType]) {
            this.dialogService.open(CompanyFormComponent, {
                closeOnBackdropClick: true,
                closeOnEsc: false,
                hasBackdrop: false,
                hasScroll: true
            }).onClose.subscribe(res => CustomerComponent.loadData(this));
        }
    }

    openTemplate(template) {
        this.modalService.open(template);
    }
    onClose() {
        this.modalService.dismissAll();
    }

    clear() {
        this.buildFilterForm();
        CustomerComponent.loadData(this);

    }

    download() {
        this.overlay.show();
        this.customerInfoService.download(this.filterForm.value).subscribe((response: any) => {
            this.overlay.hide();
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = name;
            link.setAttribute('visibility', 'hidden');
            link.click();
        }, error => {
            this.overlay.hide();
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Download Customer!'));
        });

    }


    getBranch() {
        this.roleAccess = LocalStorageUtil.getStorage().roleAccess;
        if (LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
            this.isMaker = true;
        }
        if (this.roleAccess === RoleAccess.SPECIFIC) {
            this.accessSpecific = true;
        } else if (this.roleAccess === RoleAccess.ALL) {
            this.accessAll = true;
        }
        if (this.roleAccess === RoleAccess.OWN) {
            this.showBranch = false;
            this.showBranchProvince = false;
        }

        if (this.accessSpecific || this.accessAll) {
            this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
                this.branchList = response.detail;
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
            });
        }

    }

    editCustomer(model) {
        if (CustomerType.INDIVIDUAL === CustomerType[model.customerType]) {
            this.customerService.detail(model.associateId).subscribe((res: any) => {
                const detail = res.detail;
                this.dialogService.open(CustomerFormComponent, {
                    context: {
                        formValue: detail,
                        clientTypeInput: model.clientType,
                        customerIdInput: model.customerCode,
                        bankingRelationshipInput: model.bankingRelationship,
                        subSectorDetailCodeInput: model.subsectorDetail,
                        gender: model.gender,
                        maritalStatus: model.maritalStatus,
                        customerLegalDocumentAddress: model.customerLegalDocumentAddress
                    },
                    closeOnBackdropClick: false,
                    closeOnEsc: false,
                    hasBackdrop: false,
                    hasScroll: true
                    // tslint:disable-next-line:no-shadowed-variable
                }).onClose.subscribe((res: any) => CustomerComponent.loadData(this));
            }, error => this.toastService.show(new Alert(AlertType.ERROR, error.error.message)));

        } else if (CustomerType.INSTITUTION === CustomerType[model.customerType]) {
            this.companyInfoService.detail(model.associateId).subscribe((res: any) => {
                const detail = res.detail;
                this.dialogService.open(CompanyFormComponent, {
                    context: {
                        formValue: detail,
                        bankingRelationshipInput: model.bankingRelationship,
                        subSectorDetailCodeInput: model.subsectorDetail,
                        customerCode: model.customerCode,
                        clientTypeInput: model.clientType,
                    },
                    closeOnBackdropClick: false,
                    closeOnEsc: false,
                    hasBackdrop: false,
                    hasScroll: true
                    // tslint:disable-next-line:no-shadowed-variable
                }).onClose.subscribe(res => CustomerComponent.loadData(this));
            });
        }
    }

    changeAction(chooseJointNo: TemplateRef<any>) {
        this.onClose();
       this.modalService.open(chooseJointNo);
    }

    onCloseJoint() {
        this.onClose();
            this.dialogService.open(CustomerFormComponent, {
                closeOnBackdropClick: false,
                closeOnEsc: false,
                hasBackdrop: false,
                hasScroll: true
            }).onClose.subscribe(res => CustomerComponent.loadData(this));
    }

    onNextJointCustomer(val) {
        this.onClose();
        if (CustomerType.INDIVIDUAL === CustomerType[this.customerType]) {
            const context = {
                currentVal: val
            };
            if (val >= 2) {
                this.dialogService.open(JointFormComponent, {
                    context,
                    closeOnBackdropClick: false,
                    closeOnEsc: false,
                    hasBackdrop: false,
                    hasScroll: true
                }).onClose.subscribe(res => CustomerComponent.loadData(this));
            } else {
                this.toastService.show(new Alert(AlertType.ERROR, 'Please input the number greater or equal to 2'));
            }
        }
    }

}
