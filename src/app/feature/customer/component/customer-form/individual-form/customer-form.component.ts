import {Component, DoCheck, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Customer} from '../../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {CustomerService} from '../../../../admin/service/customer.service';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BlacklistService} from '../../../../admin/component/blacklist/blacklist.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerAssociateComponent} from '../../../../loan/component/loan-main-template/customer-associate/customer-associate.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {BankingRelationship} from '../../../../admin/modal/banking-relationship';
import {Pattern} from '../../../../../@core/utils/constants/pattern';
import {RelationshipList} from '../../../../loan/model/relationshipList';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {Gender} from '../../../../../@core/model/enum/gender';
import {MaritalStatus} from '../../../../../@core/model/enum/marital-status';
import {IndividualJsonData} from '../../../../admin/modal/IndividualJsonData';

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit, DoCheck {
    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private customerService: CustomerService,
        private toastService: ToastService,
        private modalService: NgbModal,
        private blackListService: BlacklistService,
        private dialogService: NbDialogService,
        protected ref: NbDialogRef<CustomerFormComponent>,
        private el: ElementRef
    ) {
    }

    get basicInfoControls() {
        return this.basicInfo.controls;
    }

    @Input() formValue: Customer = new Customer();
    @Input() clientTypeInput: any;
    @Input() customerIdInput: any;
    @Input() bankingRelationshipInput: any;
    @Input() subSectorDetailCodeInput: any;
    @Input() gender;
    @Input() maritalStatus;
    @Input() customerLegalDocumentAddress;
    calendarType = 'AD';
    @Output() blackListStatusEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    basicInfo: FormGroup;
    submitted = false;
    spinner = false;
    displayEngDate = true;
    formLabel: string;

    customerDetailField = {
        showFormField: false,
        isOldCustomer: false
    };
    customerSearchData = {
        citizenshipNumber: undefined
    };
    customer: Customer = new Customer();
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    temporaryDistrictList: Array<District> = Array<District>();
    temporaryMunicipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

    private isBlackListed: boolean;
    allDistrict: Array<District> = Array<District>();
    private customerList: Array<Customer> = new Array<Customer>();
    public showMatchingTable: boolean;
    tempFlag = {
        showOtherOccupation: false,
        showOtherIncomeSource: false,
        hideIncomeSource: false
    };

    bankingRelationshipList = BankingRelationship.enumObject();
    subSector = [];
    clientType = [];
    relationArray: RelationshipList = new RelationshipList();
    public genderPairs = EnumUtils.pairs(Gender);
    maritalStatusEnum = MaritalStatus;
    placeHolderForMaritalStatus = 'Marital Status :';
    individualJsonData: IndividualJsonData;

    ngOnInit() {
        this.getProvince();
        this.getAllDistrict();
        this.getClientType();
        this.getSubSector();
        this.formMaker();
        if (!ObjectUtil.isEmpty(this.formValue)) {
            if (!ObjectUtil.isEmpty(this.formValue.individualJsonData)) {
                this.individualJsonData = JSON.parse(this.formValue.individualJsonData);
            }
            this.customerDetailField.showFormField = true;
            this.customer = this.formValue;
            this.customer.clientType = this.clientTypeInput;
            this.customer.customerCode = this.customerIdInput;
            this.formMaker();
            this.setRelatives(this.customer.customerRelatives);
            this.setOccupationAndIncomeSourceAndParentInput(this.formValue);
            this.occupationChange();

        } else {
            this.createRelativesArray();
        }
    }

    addRelatives() {
        (this.basicInfo.get('customerRelatives') as FormArray).push(
            this.formBuilder.group({
                customerRelation: [undefined, Validators.required],
                customerRelativeName: [undefined, Validators.compose([Validators.required])],
                citizenshipNumber: [undefined],
                citizenshipIssuedPlace: [undefined],
                citizenshipIssuedDate: [undefined, DateValidator.isValidBefore],
                version: [0]
            })
        );
    }

    removeRelatives(i) {
        (this.basicInfo.get('customerRelatives') as FormArray).removeAt(i);
    }

    getDistricts(province: Province) {
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.districtList.forEach(district => {
                    if (!ObjectUtil.isEmpty(this.customer.district) && district.id === this.customer.district.id) {
                        this.basicInfo.controls.district.setValue(district);
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
                        this.basicInfo.controls.municipalities.setValue(municipality);
                    }
                });
            }
        );

    }

    getTemporaryDistricts(province: Province) {
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.temporaryDistrictList = response.detail;
                this.temporaryDistrictList.forEach(district => {
                    if (!ObjectUtil.isEmpty(this.customer.temporaryDistrict) && district.id === this.customer.temporaryDistrict.id) {
                        this.basicInfo.controls.temporaryDistrict.setValue(district);
                        this.getTemporaryMunicipalities(district);
                    }
                });
            }
        );
    }

    getTemporaryMunicipalities(district: District) {
        this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.temporaryMunicipalitiesList = response.detail;
                this.temporaryMunicipalitiesList.forEach(municipality => {
                    if (!ObjectUtil.isEmpty(this.customer.temporaryMunicipalities) &&
                        municipality.id === this.customer.temporaryMunicipalities.id) {
                        this.basicInfo.controls.temporaryMunicipalities.setValue(municipality);
                    }
                });
            }
        );

    }

    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }

    onSubmit() {
        this.submitted = true;
        this.spinner = true;
        const tempId = this.basicInfo.get('citizenshipNumber').value;
        this.blackListService.checkBlacklistByRef(tempId).subscribe((response: any) => {
            this.isBlackListed = response.detail;
            this.blackListStatusEmitter.emit(this.isBlackListed);
            if (this.isBlackListed) {
                this.customerDetailField.showFormField = false;
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.ERROR, 'Blacklisted Customer'));
                return;
            } else {
                if (this.basicInfo.invalid) {
                    this.toastService.show(new Alert(AlertType.WARNING, 'Check Validation'));
                    this.scrollToFirstInvalidControl();
                    this.spinner = false;
                    return;
                }
                {
                    this.customer.id = this.customer ? (this.customer.id ? this.customer.id : undefined) : undefined;
                    this.customer.customerName = this.basicInfo.get('customerName').value;
                    this.customer.customerCode = this.basicInfo.get('customerCode').value;
                    this.customer.province = this.basicInfo.get('province').value;
                    this.customer.district = this.basicInfo.get('district').value;
                    this.customer.municipalities = this.basicInfo.get('municipalities').value;
                    this.customer.street = this.basicInfo.get('street').value;
                    this.customer.wardNumber = this.basicInfo.get('wardNumber').value;
                    this.customer.temporaryProvince = this.basicInfo.get('temporaryProvince').value;
                    this.customer.temporaryDistrict = this.basicInfo.get('temporaryDistrict').value;
                    this.customer.temporaryMunicipalities = this.basicInfo.get('temporaryMunicipalities').value;
                    this.customer.temporaryStreet = this.basicInfo.get('temporaryStreet').value;
                    this.customer.temporaryWardNumber = this.basicInfo.get('temporaryWardNumber').value;
                    this.customer.contactNumber = this.basicInfo.get('contactNumber').value;
                    this.customer.landLineNumber = this.basicInfo.get('landLineNumber').value;
                    this.customer.email = this.basicInfo.get('email').value;
                    this.customer.dob = this.basicInfo.get('dob').value;
                    this.customer.initialRelationDate = this.basicInfo.get('initialRelationDate').value;
                    this.customer.citizenshipNumber = this.basicInfo.get('citizenshipNumber').value;
                    this.customer.citizenshipIssuedPlace = this.basicInfo.get('citizenshipIssuedPlace').value;
                    this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
                    this.customer.clientType = this.basicInfo.get('clientType').value;
                    this.customer.subsectorDetail = this.basicInfo.get('subsectorDetail').value;
                    this.customer.gender = this.basicInfo.get('gender').value;
                    this.customer.maritalStatus = this.basicInfo.get('maritalStatus').value;
                    this.customer.customerLegalDocumentAddress = this.basicInfo.get('customerLegalDocumentAddress').value;
                    const occupations = {
                        multipleOccupation: this.basicInfo.get('occupation').value,
                        otherOccupation: this.basicInfo.get('otherOccupation').value
                    };
                    const incomeSource = {
                        multipleIncome: this.basicInfo.get('incomeSource').value,
                        otherIncome: this.basicInfo.get('otherIncome').value
                    };
                    this.customer.occupation = JSON.stringify(occupations);
                    this.customer.incomeSource = JSON.stringify(incomeSource);
                    this.customer.introduction = this.basicInfo.get('introduction').value;
                    this.customer.version = this.basicInfo.get('version').value;
                    const rawFromValue = this.basicInfo.getRawValue();
                    this.customer.customerRelatives = rawFromValue.customerRelatives;

                    /** banking relation setting data from child **/
                    // possibly can have more field in banking relationship
                    this.customer.bankingRelationship = JSON.stringify(this.basicInfo.get('bankingRelationship').value);
                    this.customer.netWorth = this.basicInfo.get('netWorth').value;

                    /** Remaining static read-write only data*/
                    this.customer.individualJsonData = this.setIndividualJsonData();

                    this.customerService.save(this.customer).subscribe(res => {
                        this.spinner = false;
                        this.close();
                        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Customer Info'));
                    }, res => {
                        this.spinner = false;
                        this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
                    });
                }
            }
        });
    }

    getProvince() {
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.provinceList.forEach((province: Province) => {
                    if (this.customer !== undefined) {
                        if (!ObjectUtil.isEmpty(this.customer.province)) {
                            if (province.id === this.customer.province.id) {
                                this.basicInfo.controls.province.setValue(province);
                                this.getDistricts(province);
                            }
                        }
                        if (!ObjectUtil.isEmpty(this.customer.temporaryProvince)) {
                            if (province.id === this.customer.temporaryProvince.id) {
                                this.basicInfo.controls.temporaryProvince.setValue(province);
                                this.getTemporaryDistricts(province);
                            }
                        }
                    }
                });
            }
        );
    }

    formMaker() {
        this.basicInfo = this.formBuilder.group({
            customerName: [this.customer.customerName === undefined ? undefined : this.customer.customerName, Validators.required],
            customerCode: [this.customer.customerCode === undefined ? undefined : this.customer.customerCode],
            province: [this.customer.province === null ? undefined : this.customer.province, Validators.required],
            district: [this.customer.district === null ? undefined : this.customer.district, Validators.required],
            municipalities: [this.customer.municipalities === null ? undefined : this.customer.municipalities, Validators.required],
            street: [this.customer.street === null ? undefined : this.customer.street, Validators.required],
            wardNumber: [this.customer.wardNumber === null ? undefined : this.customer.wardNumber, Validators.required],
            contactNumber: [this.customer.contactNumber === undefined ? undefined : this.customer.contactNumber, [Validators.required,
                Validators.max(9999999999), Validators.min(1000000000)]],
            landLineNumber: [this.customer.landLineNumber === undefined ? undefined : this.customer.landLineNumber],
            email: [this.customer.email === undefined ? undefined : this.customer.email, Validators.required],
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
            version: [this.customer.version === undefined ? undefined : this.customer.version],
            otherOccupation: [this.customer.otherOccupation === undefined ? undefined : this.customer.otherOccupation],
            incomeSource: [this.customer.incomeSource === undefined ? undefined : this.customer.incomeSource, [Validators.required]],
            otherIncome: [this.customer.otherIncome === undefined ? undefined : this.customer.otherIncome],
            customerRelatives: this.formBuilder.array([]),
            introduction: [this.customer.introduction === undefined ? undefined : this.customer.introduction, [Validators.required]],
            securityRisk: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
                this.individualJsonData.securityRisk],
            incomeRisk: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
                this.individualJsonData.incomeRisk],
            successionRisk: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
                this.individualJsonData.successionRisk],
            bankingRelationship: [this.customer.bankingRelationship === undefined ?
                undefined : JSON.parse(this.customer.bankingRelationship), [Validators.required]],
            netWorth: [this.customer.netWorth === undefined ?
                undefined : this.customer.netWorth, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
            subsectorDetail: [this.customer.subsectorDetail === undefined ? undefined : this.customer.subsectorDetail],
            clientType: [this.customer.clientType === undefined ? undefined : this.customer.clientType],
            temporaryProvince: [this.customer.temporaryProvince === null ? undefined :
                this.customer.temporaryProvince, Validators.required],
            temporaryDistrict: [this.customer.temporaryDistrict === null ? undefined :
                this.customer.temporaryDistrict, Validators.required],
            temporaryMunicipalities: [this.customer.temporaryMunicipalities === null ? undefined :
                this.customer.temporaryMunicipalities, Validators.required],
            temporaryStreet: [this.customer.temporaryStreet === null ? undefined :
                this.customer.temporaryStreet, Validators.required],
            temporaryWardNumber: [this.customer.temporaryWardNumber === null ? undefined :
                this.customer.temporaryWardNumber, Validators.required],
            gender: [this.gender === null ? undefined :
                this.gender, Validators.required],
            maritalStatus: [this.maritalStatus === null ? undefined :
                this.maritalStatus, Validators.required],
            customerLegalDocumentAddress: [this.customerLegalDocumentAddress == null ? undefined :
                this.customerLegalDocumentAddress, Validators.required],

        });
    }

    setIndividualJsonData() {
        const individualJsonData = new IndividualJsonData();
        individualJsonData.incomeRisk = this.basicInfoControls.incomeRisk.value;
        individualJsonData.securityRisk = this.basicInfoControls.securityRisk.value;
        individualJsonData.successionRisk = this.basicInfoControls.successionRisk.value;
        return  JSON.stringify(individualJsonData);
    }

    createRelativesArray() {
        const relation = ['Grand Father', 'Father'];
        relation.forEach((customerRelation) => {
            (this.basicInfo.get('customerRelatives') as FormArray).push(this.formBuilder.group({
                customerRelation: [{value: customerRelation, disabled: true}],
                customerRelativeName: [undefined, Validators.required],
                citizenshipNumber: [undefined],
                citizenshipIssuedPlace: [undefined],
                citizenshipIssuedDate: [undefined, DateValidator.isValidBefore],
                version: [undefined]
            }));
        });
    }

    setRelatives(currentData) {
        const relativesData = (this.basicInfo.get('customerRelatives') as FormArray);
        if (!ObjectUtil.isEmpty(currentData)){
            currentData.forEach((singleRelatives, index) => {
                const customerRelative = singleRelatives.customerRelation;
                // Increase index number with increase in static relatives---
                relativesData.push(this.formBuilder.group({
                    customerRelation: (index > 1) ? [(customerRelative)] :
                        [({value: customerRelative, disabled: true}), Validators.required],
                    customerRelativeName: [singleRelatives.customerRelativeName, Validators.required],
                    version: [singleRelatives.version === undefined ? undefined : singleRelatives.version],
                    citizenshipNumber: [singleRelatives.citizenshipNumber],
                    citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace],
                    citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
                        undefined : new Date(singleRelatives.citizenshipIssuedDate), DateValidator.isValidBefore]
                }));
            });

        } else {
            this.createRelativesArray();
        }
    }

    checkCustomer() {
        const customerName = this.basicInfo.get('customerName').value;
        const citizenShipIssuedDate = this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
        const citizenShipNo = this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipNumber').value;
        const modalRef = this.modalService.open(CustomerAssociateComponent, {size: 'lg'});
        if (ObjectUtil.isEmpty(customerName) || ObjectUtil.isEmpty(citizenShipIssuedDate
            || ObjectUtil.isEmpty(citizenShipNo))) {
            modalRef.componentInstance.model = undefined;
        } else {
            modalRef.componentInstance.model = this.customer;
        }
    }

    private getAllDistrict() {
        this.commonLocation.getAllDistrict().subscribe((response: any) => {
            this.allDistrict = response.detail;
        });
    }

    onClick(i: number) {
        this.getProvince();
        this.showMatchingTable = false;
        this.customerDetailField.showFormField = true;
        this.customer = this.customerList[i];
        this.formMaker();
        this.setRelatives(this.customer.customerRelatives);
    }

    continueAsNew() {
        this.getProvince();
        this.customer = new Customer();
        this.customer.citizenshipNumber = this.basicInfoControls.citizenshipNumber.value;
        this.formMaker();
        this.createRelativesArray();
        this.customerDetailField.showFormField = true;
        this.showMatchingTable = false;
    }

    close() {
        this.ref.close();
    }

    occupationChange() {
        const isOtherSelected = this.basicInfo.get('occupation').value.includes('Other');
        if (isOtherSelected) {
            this.tempFlag.showOtherOccupation = true;
            this.basicInfo.get('otherOccupation').setValidators(Validators.required);
        } else {
            this.tempFlag.showOtherOccupation = false;
            this.basicInfo.get('otherOccupation').setValidators(null);
        }
        this.basicInfo.get('otherOccupation').updateValueAndValidity();
        const houseWifeSelected = !this.basicInfo.get('occupation').value.includes('House Wife') ?
            false : this.basicInfo.get('occupation').value.length <= 1;
        if (houseWifeSelected) {
            this.tempFlag.hideIncomeSource = true;
            this.basicInfo.get('incomeSource').clearValidators();
        }  else {
            this.tempFlag.hideIncomeSource = false;
            this.basicInfo.get('incomeSource').setValidators(Validators.required);
        }
        this.basicInfo.get('incomeSource').updateValueAndValidity();

    }
    ngDoCheck(): void {
        if (this.formValue.id == null) {
            this.formLabel = 'Add';
        } else {
            this.formLabel = 'Edit';
        }
    }

    onIncomeSourceChange() {
        const isOtherSourceSelected = this.basicInfo.get('incomeSource').value.includes('Other');
        if (isOtherSourceSelected) {
            this.tempFlag.showOtherIncomeSource = true;
            this.basicInfo.get('otherIncome').setValidators(Validators.required);
        } else {
            this.tempFlag.showOtherIncomeSource = false;
            this.basicInfo.get('otherIncome').setValidators(null);
        }
        this.basicInfo.get('otherIncome').updateValueAndValidity();
    }

    getClientType() {
        this.customerService.clientType().subscribe((res: any) => {
                console.log(res.detail);
                this.clientType = res.detail;
            }
            , error => {
                console.error(error);
            });
    }

    getSubSector() {
        this.customerService.subSector().subscribe((res: any) => {
                const response = res.detail;
                const sectorArray = [];
                Object.keys(res.detail).forEach(value => {
                    sectorArray.push({
                        key: value, value: response[value]
                    });
                });
                this.subSector = sectorArray;
            }
            , error => {
                console.error(error);
            });
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    setOccupationAndIncomeSourceAndParentInput(formValue) {
        if (!ObjectUtil.isEmpty(formValue.incomeSource)) {
            const incomeSource = JSON.parse(formValue.incomeSource);
            this.basicInfo.controls.incomeSource.patchValue(incomeSource.multipleIncome);
            this.basicInfo.controls.otherIncome.patchValue(incomeSource.otherIncome);
        }
        if (!ObjectUtil.isEmpty(formValue.occupation)) {
            const occupation = JSON.parse(formValue.occupation);
            this.basicInfo.controls.occupation.patchValue(occupation.multipleOccupation);
            this.basicInfo.controls.otherOccupation.patchValue(occupation.otherOccupation);
        }
        if (!ObjectUtil.isEmpty(this.bankingRelationshipInput)) {
            this.basicInfo.controls.bankingRelationship.patchValue(JSON.parse(this.bankingRelationshipInput));

        }
        if (!ObjectUtil.isEmpty(this.subSectorDetailCodeInput)) {
            this.basicInfo.controls.subsectorDetail.patchValue(this.subSectorDetailCodeInput);

        }

    }
    sameAsPermanent() {
        // if (ObjectUtil.isEmpty(this.basicInfo.get('municipalities').value)) {
        //     this.toastService.show(new Alert(AlertType.WARNING, 'Please fill Permanent Address Completely'));
        //     return true;
        // }
        this.basicInfo.get('temporaryProvince').patchValue(this.basicInfo.get('province').value);
        this.customer.temporaryDistrict = this.basicInfo.get('district').value;
        this.getTemporaryDistricts(this.basicInfo.get('temporaryProvince').value);
        this.customer.temporaryMunicipalities = this.basicInfo.get('municipalities').value;
        this.getTemporaryMunicipalities(this.basicInfo.get('municipalities').value);
        this.basicInfo.controls.temporaryStreet.setValue(this.basicInfo.get('street').value);
        this.basicInfo.controls.temporaryWardNumber.setValue(this.basicInfo.get('wardNumber').value);

    }

}
