import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CompanyInfoService} from '../../../../admin/service/company-info.service';
import {ToastService} from '../../../../../@core/utils';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CustomerInfoService} from '../../../service/customer-info.service';
import {CustomerType} from '../../../model/customerType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {NbAccordionItemComponent, NbDialogService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BusinessType} from '../../../../admin/modal/businessType';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {CustomerLoanApplyComponent} from '../../customer-loan-apply/customer-loan-apply.component';
import {FetchLoan} from '../../../model/fetchLoan';
import {LoanAmountType} from '../../../model/loanAmountType';
import {District} from '../../../../admin/modal/district';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {FormUtils} from '../../../../../@core/utils/form.utils';
import {ProductUtils} from '../../../../admin/service/product-mode.service';
import {ProductUtilService} from '../../../../../@core/service/product-util.service';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
import {MGroup} from '../../../model/mGroup';
import {environment} from '../../../../../../environments/environment';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';

@Component({
    selector: 'app-company-profile',
    templateUrl: './company-profile.component.html',
    styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, AfterContentInit {
    @ViewChild('mGroupAccordion', {static: false})
    public mGroupAccordion: NbAccordionItemComponent;

    companyInfo: CompanyInfo = new CompanyInfo();
    customerInfo: CustomerInfoData;
    customerInfoId;
    spinner = false;
    isEdited = false;
    paramProp: any;
    applyForm = {
        loanId: undefined,
        customerProfileId: undefined
    };
    loanList = [];
    filterLoanCat = CustomerType.INSTITUTION;
    companyForm: FormGroup;
    businessTypes = BusinessType.enumObject();

    restUrl = ApiConfig.URL;

    totalProposalAmount = 0;
    totalLoanProposedAmount = 0;
    proposeAmountOfGroup = 0;
    totalProposedAmountByGroup = 0;
    totalGroupAmount = 0;
    maker = false;
    fetchLoan = FetchLoan;
    formData: FormData = new FormData();
    allDistrict: Array<District> = Array<District>();
    profilePic;
    isRemarkEdited;
    companyLocationData;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    companyJsonData: CompanyJsonData = new CompanyJsonData();
    sbsGroupEnabled = environment.SBS_GROUP;
    megaGroupEnabled = environment.MEGA_GROUP;
    isEditable = false;

    constructor(private companyInfoService: CompanyInfoService,
                private customerInfoService: CustomerInfoService,
                private toastService: ToastService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private modalService: NgbModal,
                private loanConfigService: LoanConfigService,
                private dialogService: NbDialogService,
                private commonLocation: AddressService,
                private formBuilder: FormBuilder,
                private utilService: ProductUtilService,
                private loanFormService: LoanFormService) {
    }

    get form() {
        return this.companyForm.controls;
    }

    ngOnInit() {
        this.buildCompanyForm();
        this.getAllDistrict();
        this.activatedRoute.queryParams.subscribe((paramObject: Params) => {
            this.customerInfoId = paramObject.id;
            this.paramProp = paramObject;
            this.getCompanyInfo(this.paramProp.companyInfoId);
            this.getCustomerInfo(this.customerInfoId);
        });
        this.loanConfigService.getAllByLoanCategory(this.filterLoanCat).subscribe((response: any) => {
            this.loanList = response.detail;
        });

        this.utilService.getProductUtil().then(r =>
            this.productUtils = r);

    }

    editCustomer(val) {
        this.isEdited = val === 1;
    }

    setCompanyData(companyInfoData: CompanyInfo) {
        this.companyForm.patchValue(companyInfoData);
        this.form.address.setValue(companyInfoData.companyLocations.address);
        this.form.streetName.setValue(companyInfoData.companyLocations.streetName);
        this.form.houseNumber.setValue(companyInfoData.companyLocations.houseNumber);
        this.form.establishmentDate.setValue(new Date(companyInfoData.establishmentDate));
        this.form.withinLimitRemarks.setValue(companyInfoData.withinLimitRemarks);
    }

    getCompanyInfo(companyInfoId) {
        this.spinner = true;
        this.companyInfoService.detail(companyInfoId).subscribe((res: any) => {
            this.companyInfo = res.detail;
            if (FormUtils.isJson(this.companyInfo.companyLocations.address)) {
                this.companyLocationData = JSON.parse(this.companyInfo.companyLocations.address);
                this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
            }
            this.spinner = false;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
            this.spinner = false;
        });
    }

    getCustomerInfo(customerInfoId) {
        this.spinner = true;

        this.customerInfoService.detail(customerInfoId).subscribe((res: any) => {
            this.customerInfo = res.detail;
            console.log(res.detail);
            this.setCompanyData(this.companyInfo);
            this.spinner = false;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load customer information'));
            this.spinner = false;
        });
    }

    onClose() {
        this.modalService.dismissAll();
    }

    openLoanForm() {
        this.onClose();
        this.spinner = true;
        let loanCategory = 'INSTITUTION';
        if (CustomerType.INDIVIDUAL === CustomerType[this.paramProp.customerType]) {
            loanCategory = 'INDIVIDUAL';
        }
        this.router.navigate(['/home/loan/loanForm'], {
            queryParams: {
                loanId: this.applyForm.loanId,
                customerInfoId: this.paramProp.id,
                customerType: this.paramProp.customerType,
                customerProfileId: this.paramProp.companyInfoId,
                loanCategory: loanCategory
            }
        });
    }

    public refreshCustomerInfo(): void {
        this.customerInfo = undefined;
        this.getCustomerInfo(this.customerInfoId);
    }

    openSingleSelectLoanTemplate() {
        const modalRef = this.modalService.open(CustomerLoanApplyComponent, {size: 'lg'});
        modalRef.componentInstance.customerType = this.filterLoanCat;
        modalRef.componentInstance.paramProp = this.paramProp;
        modalRef.componentInstance.associateId = this.paramProp.companyInfoId;
        modalRef.componentInstance.customerInfo = this.customerInfo;
        modalRef.componentInstance.singleOrCombine = 'Single';

    }

    openCombineSelectLoanTemplate() {
        const modalRef = this.modalService.open(CustomerLoanApplyComponent, {size: 'lg'});
        modalRef.componentInstance.customerType = this.filterLoanCat;
        modalRef.componentInstance.paramProp = this.paramProp;
        modalRef.componentInstance.associateId = this.paramProp.companyInfoId;
        modalRef.componentInstance.customerInfo = this.customerInfo;
        modalRef.componentInstance.singleOrCombine = 'Combine';

    }

    ngAfterContentInit(): void {

        const roleType = LocalStorageUtil.getStorage().roleType;
        if (roleType === 'MAKER') {
            this.maker = true;
            this.isEditableCustomerData();
        }
    }
    buildCompanyForm() {
        this.companyForm = this.formBuilder.group({
            companyName: [undefined, Validators.required],
            registrationNumber: [undefined, Validators.required],
            establishmentDate: [undefined, Validators.required],
            address: [undefined, Validators.required],
            houseNumber: [undefined, Validators.required],
            streetName: [undefined, Validators.required],
            panNumber: [undefined, Validators.required],
            issuePlace: [undefined, Validators.required],
            email: [undefined, Validators.required],
            contactNum: [undefined, Validators.required],
            businessType: [undefined, Validators.required],
            withinLimitRemarks: [undefined]
        });
    }

    saveCompanyInfoDetail() {
        this.spinner = true;
        this.isEdited = false;
        this.isRemarkEdited = false;
        this.companyInfo.companyName = this.companyForm.get('companyName').value;
        this.companyInfo.registrationNumber = this.companyForm.get('registrationNumber').value;
        this.companyInfo.establishmentDate = this.companyForm.get('establishmentDate').value;
        this.companyInfo.companyLocations.address = this.companyForm.get('address').value;
        this.companyInfo.companyLocations.houseNumber = this.companyForm.get('houseNumber').value;
        this.companyInfo.companyLocations.streetName = this.companyForm.get('streetName').value;
        this.companyInfo.panNumber = this.companyForm.get('panNumber').value;
        this.companyInfo.issuePlace = this.companyForm.get('issuePlace').value;
        this.companyInfo.email = this.companyForm.get('email').value;
        this.companyInfo.contactNum = this.companyForm.get('contactNum').value;
        this.companyInfo.businessType = this.companyForm.get('businessType').value;
        this.companyInfo.withinLimitRemarks = this.companyForm.get('withinLimitRemarks').value;
        this.companyInfoService.save(this.companyInfo).subscribe(response => {
            this.companyInfo = response.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED COMPANY DETAIL'));
            this.spinner = false;
        }, res => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
        });
    }

    getTotalLoanAmount(value: LoanAmountType) {
        if (value.type === this.fetchLoan.CUSTOMER_LOAN) {
            this.totalLoanProposedAmount = value.value;
        }
        if (value.type === this.fetchLoan.CUSTOMER_AS_GROUP) {
            this.totalProposedAmountByGroup = value.value;
            this.proposeAmountOfGroup = value.value;
        }

        this.totalGroupAmount = this.totalProposedAmountByGroup;
        this.totalProposalAmount = this.totalLoanProposedAmount + this.proposeAmountOfGroup;
    }

    profileUploader(event, template) {
        this.profilePic = event.target.files[0];
        this.modalService.open(template);

    }

    confirmUpload() {
        this.modalService.dismissAll();
        this.formData.append('file', this.profilePic);
        this.formData.append('customerInfoId', this.customerInfo.id.toString());
        this.formData.append('name', this.customerInfo.name);
        this.formData.append('branch', this.customerInfo.branch.name);
        this.formData.append('customerType', this.customerInfo.customerType);
        this.customerInfoService.uploadFile(this.formData).subscribe((res: any) => {
            this.customerInfo.profilePic = res.detail;
            this.formData = new FormData();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Picture HAS BEEN UPLOADED'));
            this.refreshCustomerInfo();
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

    private getAllDistrict() {
        this.commonLocation.getAllDistrict().subscribe((response: any) => {
            this.allDistrict = response.detail;
        });
    }

    refreshGroup() {
        this.refreshCustomerInfo();
    }

    editRemark() {
        this.isRemarkEdited = true;
    }

    cbsGroupUpdate(event) {
        this.spinner = true;
        const customerInfo = new CustomerInfoData();
        customerInfo.id = this.customerInfoId;
        customerInfo.obligor = event;
        this.customerInfoService.updateCbsGroup(customerInfo).subscribe((res: any) => {
            this.refreshCustomerInfo();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Group Successfully Updated for Customer'));
            this.spinner = false;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            this.spinner = false;
        });
    }

    setMGroupData(mGroup: MGroup) {
        this.customerInfo.mgroupInfo = mGroup;
        this.mGroupAccordion.close();
    }

    isEditableCustomerData() {
        if (this.maker) {
        this.loanFormService.isCustomerEditable(this.customerInfoId).subscribe((res: any) => {
            this.isEditable = res.detail;
        }); }
    }
}
