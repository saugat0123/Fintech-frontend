import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {CustomerService} from '../../../service/customer.service';
import {ToastService} from '../../../../../@core/utils';
import {Customer} from '../../../../admin/modal/customer';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {LoanType} from '../../../../loan/model/loanType';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {FetchLoan} from '../../../model/fetchLoan';
import {LoanAmountType} from '../../../model/loanAmountType';
import {CustomerType} from '../../../model/customerType';
import {CustomerInfoService} from '../../../service/customer-info.service';
// @ts-ignore
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {NbAccordionItemComponent, NbDialogRef, NbDialogService} from '@nebular/theme';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {CustomerLoanApplyComponent} from '../../customer-loan-apply/customer-loan-apply.component';
import {CustomerListGroupComponent} from '../../customer-group-associate-loan-list/customer-list-group.component';
import {ProductUtils} from '../../../../admin/service/product-mode.service';
import {ProductUtilService} from '../../../../../@core/service/product-util.service';
import {environment} from '../../../../../../environments/environment';
import {MGroup} from '../../../model/mGroup';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {CompanyInfoService} from '../../../../admin/service/company-info.service';
import {CommonService} from '../../../../../@core/service/common.service';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {CustomerDocuments} from '../../../../loan/model/customerDocuments';
import {DocStatus} from '../../../../loan/model/docStatus';
import {ProposalComponent} from '../../../../loan-information-template/proposal/proposal.component';
import {SearchResultComponent} from '../../../../../@theme/components/header/header-form/searchResult.component';

@Component({
    selector: 'app-customer-profile',
    templateUrl: './customer-profile.component.html',
    styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit, AfterContentInit {
    @ViewChild('customerListGroupComponent', {static: false})
    public customerListGroupComponent: CustomerListGroupComponent;

    @ViewChild('mGroupAccordion', {static: false})
    public mGroupAccordion: NbAccordionItemComponent;

    associateId: number;
    customerInfoId: number;
    customer: Customer = new Customer();
    loanType = LoanType;
    spinner = false;
    formData: FormData = new FormData();
    restUrl = ApiConfig.URL;
    mySubscription: any;
    isEdited = false;
    basicForm: FormGroup;
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

    totalProposedAmountByGuarantor = 0;
    totalProposedAmountByGroup = 0;
    proposeAmountOfGroup = 0;
    totalGroupAmount = 0;
    totalProposalAmount = 0;
    totalLoanProposedAmount = 0;
    fetchLoan = FetchLoan;
    paramProp: any;
    filterLoanCat = CustomerType.INSTITUTION;
    isIndividual = false;
    customerInfo: CustomerInfoData;
    maker = false;
    profilePic;
    isRemarkEdited = false;
    json = JSON;
    sbsGroupEnabled = environment.SBS_GROUP;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    crgLambdaDisabled = environment.disableCrgLambda;
    isEditable = false;
    jointInfo = [];
    isJointInfo = false;
    customerType: CustomerType;
    nonMicroLoanList = [];
    microLoanList = [];
    loanList = [];
    loanTypeList = LoanType.value();
    multipleSelectedLoanType = [];
    selectedLoanType;
    facilityType;

    docStatusMakerList = [];
    loan = new LoanDataHolder();
    customerLoans: LoanDataHolder [];
    documentSpinner = false;
    approvedLoanList;
    pendingLoanList;
    dialogRef: NbDialogRef<any>;
    imageUrl: string;



    constructor(private route: ActivatedRoute,
                private customerService: CustomerService,
                private customerInfoService: CustomerInfoService,
                private customerLoanService: LoanFormService,
                private toastService: ToastService,
                private router: Router,
                private modalService: NgbModal,
                private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private commonLocation: AddressService,
                private activatedRoute: ActivatedRoute,
                private dialogService: NbDialogService,
                private utilService: ProductUtilService,
                private companyInfoService: CompanyInfoService,
                public service: CommonService,
                private config: NgbModalConfig

    ) {
        config.backdrop = 'static';
        config.keyboard = false;
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }

    ngOnInit() {
        this.docStatusForMaker();
        this.associateId = this.route.snapshot.params.id;
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.paramProp = {
                    customerType: null,
                    customerInfoId: null
                };
                this.paramProp = paramsValue;
                this.customerType = this.paramProp.customerType;
                console.log(this.customerType);
                this.customerInfoId = this.paramProp.customerInfoId;
                this.getCustomerInfo();
            });
        if (CustomerType.INDIVIDUAL === CustomerType[this.paramProp.customerType]) {
            this.filterLoanCat = CustomerType.INDIVIDUAL;
            this.isIndividual = true;
        }
        this.customerService.detail(this.associateId).subscribe((res: any) => {
            this.customer = res.detail;
            if (!ObjectUtil.isEmpty(this.customer.jointInfo)) {
                const jointCustomerInfo = JSON.parse(this.customer.jointInfo);
                this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
                this.isJointInfo = true;
            }
            this.customerBasicFormBuilder();
            this.getProvince();
            this.setRelatives(this.customer.customerRelatives);
        });
        this.utilService.getProductUtil().then(r =>
            this.productUtils = r);
        this.getCustomerLoans();

        this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((response: any) => {
            this.loanList = response.detail;
            this.nonMicroLoanList = this.loanList;
            this.spinner = false;
        }, (err) => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.DANGER, '!!OPPS Something Went Wrong'));
            // this.activeModal.dismiss();
        });
        this.sliceLoan();
        this.selectedLoanType = this.multipleSelectedLoanType[0]['key'];
        this.getCustomerLoans();
    }

    ngAfterContentInit(): void {

        const roleType = LocalStorageUtil.getStorage().roleType;
        if (roleType === 'MAKER') {
            this.maker = true;

        }
    }

    docStatusForMaker() {
        DocStatus.values().forEach((value) => {
            if (value === DocStatus.value(DocStatus.DISCUSSION) ||
                value === DocStatus.value(DocStatus.DOCUMENTATION) ||
                value === DocStatus.value(DocStatus.VALUATION) ||
                value === DocStatus.value(DocStatus.UNDER_REVIEW)) {
                this.docStatusMakerList.push(value);
            }
        });
    }
    getCustomerInfo() {
        this.spinner = true;
        this.customerInfoService.detail(this.customerInfoId).subscribe((res: any) => {
            this.customerInfo = res.detail;
            if (!ObjectUtil.isEmpty(this.customerInfo.profilePic)) {
                this.imageUrl = `${ApiConfig.URL}/${this.customerInfo.profilePic}?${Math.floor(Math.random() * 100) + 1}`;
            }
            this.isEditableCustomerData();
            this.spinner = false;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load customer information'));
            this.spinner = false;
        });
    }

    public refreshCustomerInfo(): void {
        this.customerInfo = undefined;
        this.getCustomerInfo();
        this.modalService.dismissAll();
        this.selectedLoanType = null;
        this.facilityType = null;
        this.getCustomerLoans();
    }

    getProvince() {
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.provinceList.forEach((province: Province) => {
                    if (this.customer !== undefined) {
                        if (!ObjectUtil.isEmpty(this.customer.province)) {
                            if (province.id === this.customer.province.id) {
                                this.basicForm.controls.province.setValue(province);
                                this.getDistricts(province);
                            }
                        }
                    }
                });
            }
        );
    }


    openSingleSelectLoanTemplate() {
        const modalRef = this.modalService.open(CustomerLoanApplyComponent, {size: 'lg'});
        modalRef.componentInstance.customerType = this.filterLoanCat;
        modalRef.componentInstance.paramProp = this.paramProp;
        modalRef.componentInstance.associateId = this.associateId;
        modalRef.componentInstance.customerInfo = this.customerInfo;
        modalRef.componentInstance.singleOrCombine = 'Single';
        modalRef.result.then(close => {
            if (close) {
                this.refreshCustomerInfo();
            }
        });
    }

    openCombineSelectLoanTemplate() {
        const modalRef = this.modalService.open(CustomerLoanApplyComponent, {size: 'lg'});
        modalRef.componentInstance.customerType = this.filterLoanCat;
        modalRef.componentInstance.paramProp = this.paramProp;
        modalRef.componentInstance.associateId = this.associateId;
        modalRef.componentInstance.customerInfo = this.customerInfo;
        modalRef.componentInstance.singleOrCombine = 'Combine';
        modalRef.result.then(close => {
            if (close) {
                this.refreshCustomerInfo();
            }
        });
    }


    onClick(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId,
                catalogue: true
            }
        });
    }

    editCustomer(val) {
        this.isEdited = val === 1;
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

    onClose() {
        this.modalService.dismissAll();
    }

    customerBasicFormBuilder() {
        this.basicForm = this.formBuilder.group({
            id: [this.customer.id === undefined ? undefined : this.customer.id],
            profilePic: [this.customer.profilePic === undefined ? undefined : this.customer.profilePic],
            customerName: [this.customer.customerName === undefined ? undefined : this.customer.customerName, Validators.required],
            province: [this.customer.province === null ? undefined : this.customer.province, Validators.required],
            district: [this.customer.district === null ? undefined : this.customer.district, Validators.required],
            municipalities: [this.customer.municipalities === null ? undefined : this.customer.municipalities, Validators.required],
            street: [this.customer.street === null ? undefined : this.customer.street, Validators.required],
            wardNumber: [this.customer.wardNumber === null ? undefined : this.customer.wardNumber, Validators.required],
            contactNumber: [this.customer.contactNumber === undefined ? undefined : this.customer.contactNumber, Validators.required],
            email: [this.customer.email === undefined ? undefined : this.customer.email, Validators.required],
            maritalStatus: [ObjectUtil.isEmpty(this.customer.maritalStatus) ? undefined : this.customer.maritalStatus, Validators.required],
            gender: [this.customer.gender === undefined ? undefined : this.customer.gender, Validators.required],
            netWorth: [this.customer.netWorth === undefined ? undefined : this.customer.netWorth, Validators.required],
            // bankingRelationship: [this.customerInfo.bankingRelationship === undefined ? undefined : this.customerInfo.bankingRelationship, Validators.required],
            // initial Relation Date not used in ui
            initialRelationDate: [this.customer.initialRelationDate === undefined ? undefined :
                new Date(this.customer.initialRelationDate)],
            citizenshipNumber: [this.customer.citizenshipNumber === undefined ? undefined : this.customer.citizenshipNumber
                , Validators.required],
            citizenshipIssuedPlace: [this.customer.citizenshipIssuedPlace === undefined ? undefined : this.customer.citizenshipIssuedPlace,
                Validators.required],
            citizenshipIssuedDate: [ObjectUtil.isEmpty(this.customer.citizenshipIssuedDate) ? undefined :
                new Date(this.customer.citizenshipIssuedDate), [Validators.required, DateValidator.isValidBefore]],
            dob: [ObjectUtil.isEmpty(this.customer.dob) ? undefined :
                new Date(this.customer.dob), [Validators.required, DateValidator.isValidBefore]],
            occupation: [this.customer.occupation === undefined ? undefined : this.customer.occupation, [Validators.required]],
            incomeSource: [this.customer.incomeSource === undefined ? undefined : this.customer.incomeSource, [Validators.required]],
            customerRelatives: this.formBuilder.array([]),
            version: [this.customer.version === undefined ? undefined : this.customer.version],
            otherOccupation: [this.customer.otherOccupation === undefined ? undefined : this.customer.otherOccupation],
            otherIncome: [this.customer.otherIncome === undefined ? undefined : this.customer.otherIncome],
            introduction: [this.customer.introduction === undefined ? undefined : this.customer.introduction, [Validators.required]],
            withinLimitRemarks: [this.customer.withinLimitRemarks === undefined ? undefined : this.customer.withinLimitRemarks]
        });
    }

    createRelativesArray() {
        const relation = ['Grand Father', 'Father'];
        relation.forEach((customerRelation) => {
            (this.basicForm.get('customerRelatives') as FormArray).push(this.formBuilder.group({
                customerRelation: [{value: customerRelation, disabled: true}],
                customerRelativeName: [undefined, Validators.compose([Validators.required])],
                citizenshipNumber: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedPlace: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedDate: [undefined, Validators.compose([Validators.required, DateValidator.isValidBefore])]
            }));
        });
    }

    setRelatives(currentData) {
        const relativesData = (this.basicForm.get('customerRelatives') as FormArray);
        currentData.forEach((singleRelatives, index) => {
            const customerRelative = singleRelatives.customerRelation;
            // Increase index number with increase in static relatives---
            relativesData.push(this.formBuilder.group({
                customerRelation: [singleRelatives.customerRelation],
                customerRelativeName: [singleRelatives.customerRelativeName],
                citizenshipNumber: [singleRelatives.citizenshipNumber],
                citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace],
                citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
                    undefined : new Date(singleRelatives.citizenshipIssuedDate), [Validators.required, DateValidator.isValidBefore]]
            }));
        });
    }

    getDistricts(province: Province) {
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.districtList.forEach(district => {
                    if (!ObjectUtil.isEmpty(this.customer.district) && district.id === this.customer.district.id) {
                        this.basicForm.controls.district.setValue(district);
                        this.getMunicipalities(district);
                    }
                });
            }
        );
    }

    getMunicipalities(district: District) {
        this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalitiesList = response.detail;
                this.municipalitiesList.forEach(municipality => {
                    if (!ObjectUtil.isEmpty(this.customer.municipalities) && municipality.id === this.customer.municipalities.id) {
                        this.basicForm.controls.municipalities.setValue(municipality);
                    }
                });
            }
        );

    }

    saveBasic() {
        this.customer.withinLimitRemarks = this.basicForm.get('withinLimitRemarks').value;
        this.customer.clientType = this.customerInfo.clientType;
        this.customer.customerCode = this.customerInfo.customerCode;
        this.customer.subsectorDetail = this.customerInfo.subsectorDetail;
        this.customer.gender = this.customerInfo.gender;
        this.customer.maritalStatus = this.customerInfo.maritalStatus;
        this.customer.customerLegalDocumentAddress = this.customerInfo.customerLegalDocumentAddress;
        // this.customer.bankingRelationship = this.customerInfo.bankingRelationship;
        this.customerService.save(this.customer).subscribe((res: any) => {
            this.customer = res.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
            this.isEdited = false;
            this.isRemarkEdited = false;
            this.customerBasicFormBuilder();
            this.getProvince();
            this.setRelatives(this.customer.customerRelatives);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

    checkKycLoan(customerRelative: CustomerRelative) {

        this.customerService.getCustomerIdOfRelative(customerRelative).subscribe((response: any) => {
            this.customer = response.detail;
            if (this.customer !== null) {
                this.router.navigate(['/home/customer/profile/' + this.customer.id]);
                this.associateId = this.customer.id;
            }
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
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
        this.totalGroupAmount = this.totalProposedAmountByGuarantor + this.totalProposedAmountByGroup;
        this.totalProposalAmount = this.totalProposedAmountByGuarantor +
            this.totalLoanProposedAmount + this.proposeAmountOfGroup;
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
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY Added Group'));
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
            this.customerLoanService.isCustomerEditable(this.customerInfoId).subscribe((res: any) => {
                this.isEditable = res.detail;
            });
        }

    }

    setWithin(event) {
        this.customer.withinLimitRemarks = event.target.value;
        // this.customer.bankingRelationship = this.customerInfo.bankingRelationship;
        this.customer.clientType = this.customerInfo.clientType;
        this.customer.maritalStatus = this.customerInfo.maritalStatus;
        this.customer.gender = this.customerInfo.gender;
        this.customer.customerCode = this.customerInfo.customerCode;
    }

    sliceLoan() {
        this.loanTypeList.forEach((val) => {
            if (val.key === 'CLOSURE_LOAN' || val.key === 'PARTIAL_SETTLEMENT_LOAN' || val.key === 'FULL_SETTLEMENT_LOAN'
                || val.key === 'RELEASE_AND_REPLACEMENT' || val.key === 'PARTIAL_RELEASE_OF_COLLATERAL'
                || val.key === 'INTEREST_RATE_REVISION') {
                return true;
            }
            this.multipleSelectedLoanType.push(val);

        });
        console.log('multipleSelectedLoanType', this.multipleSelectedLoanType);
    }

    applyLoans(proposal) {
        this.loan = new LoanDataHolder();
        // this.loan.approvingLevel = this.loanForm.get('approvingLevel').value;
        // this.loan.creditRisk = this.loanForm.get('creditRisk').value;
        this.loan.documentStatus = DocStatus.UNDER_REVIEW;
        this.loan.loanType = this.selectedLoanType;
        const loanConfig = this.facilityType;
        this.loan.loan = loanConfig;
        this.loan.loanHolder = this.customerInfo;
        // loan.loanType = LoanType.
        if (!ObjectUtil.isEmpty(this.customer)) {
                // @ts-ignore
            this.loan.customerInfo = this.getCustomerInfos(this.customer.id);

        }
        const context = {
            loan: this.loan,
            fromProfile: true,
            customerInfo: this.customerInfo,
            loanType: this.selectedLoanType,
        };
       // this.dialogRef = this.dialogService.open(ProposalComponent, {
       //     context,
       //      closeOnBackdropClick: false,
       //      hasBackdrop: false,
       //      hasScroll: true
       //  });
        // dialogRef.onClose.subscribe((res: any) => {
        //     console.log('emit data', res);
        // });
        // const modalRef = this.modalService.open(ProposalComponent, {backdrop: 'static', scrollable: true, size: 'xl', keyboard: true});
        // modalRef.componentInstance.loan = this.loan;
        // modalRef.componentInstance.fromProfile = true;
        // modalRef.componentInstance.customerInfo = this.customerInfo;
        // modalRef.componentInstance.loanType = this.selectedLoanType;
        this.modalService.open(proposal, {
            size: 'xl',
            windowClass: 'modal-holder',
            scrollable: true,
        });


        // this.router.navigate(['/home/loan-information-template/proposal'], {
        //     queryParams: {
        //         loan: this.loan,
        //         fromProfile: true,
        //         customerInfo: this.customerInfo,
        //         loanType: this.selectedLoanType,
        //     }
        // });
    }

    getCustomerInfos(id) {
        this.customerService.detail(id).subscribe((res: any) => {
            return  res.detail;
        });
    }


    saveLoan(loan: LoanDataHolder, document: Array<CustomerDocuments>, i: number, ix: number) {
        this.documentSpinner = true;
        loan.customerDocument = document;
        this.customerLoanService.save(loan).subscribe((res => {
            this.pendingLoanList[i][ix] = res.detail;
            this.documentSpinner = false;
        }));
    }

    close() {
        this.modalService.dismissAll();
    }
    private managedArray(array) {
        let newArray = [];
        const returnArray = [];
        array.forEach((g, i) => {
            newArray.push(g);
            if ((i + 1) % 2 === 0) {
                if (newArray.length > 0) {
                    returnArray.push(newArray);
                }
                newArray = [];
            }
            if (i === array.length - 1) {
                if (newArray.length > 0) {
                    returnArray.push(newArray);
                }
                newArray = [];
            }
        });
        return returnArray;
    }
    getCustomerLoans() {
        this.modalService.dismissAll();
        this.customerLoanService.getLoansByLoanHolderId(this.customerInfoId).subscribe((res: any) => {
            this.customerLoans = [];
            this.customerLoans = res.detail;
            const approved = this.customerLoans.filter((d) => d.documentStatus.toString() === 'APPROVED');
            this.approvedLoanList = this.managedArray(approved);
            const array = this.customerLoans.filter((d) => (d.documentStatus.toString() === 'UNDER_REVIEW' || d.documentStatus.toString() === 'PENDING' || d.documentStatus.toString() === 'DISCUSSION'));
            this.pendingLoanList = this.managedArray(array);
        });
    }
}
