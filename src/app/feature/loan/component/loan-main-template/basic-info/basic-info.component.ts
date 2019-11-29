import {Component, Input, OnInit} from '@angular/core';

import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Customer} from '../../../../admin/modal/customer';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {Occupation} from '../../../../admin/modal/occupation';
import {IncomeSource} from '../../../../admin/modal/incomeSource';
import {CustomerService} from '../../../../admin/service/customer.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';


@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
    @Input() formValue: Customer;

    basicInfo: FormGroup;
    submitted = false;

    customerDetailField = {
        showFormField: false,
        isOldCustomer: false
    };
    customerSearchData = {
        customerId: undefined
    };
    customer: Customer = new Customer();
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    relativesList: FormArray;

    occupations = Occupation.enumObject();
    incomeSources = IncomeSource.enumObject();

    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private customerService: CustomerService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.getProvince();
        this.formMaker();
        if (this.formValue !== undefined) {
            if (this.formValue.customerId !== undefined) {
                this.customerDetailField.showFormField = true;
            }
            this.customer = this.formValue;
            this.formMaker();
            this.setRelatives(this.customer.customerRelatives);
        } else {
            this.createRelativesArray();
        }
    }

    addRelatives() {
        (this.basicInfo.get('customerRelatives') as FormArray).push(
            this.formBuilder.group({
                customerRelation: [undefined, Validators.required],
                customerRelativeName: [undefined, Validators.compose([Validators.required])],
                citizenshipNumber: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedPlace: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedDate: [undefined, Validators.compose([Validators.required, DateValidator.isValidBefore])]
            })
        );
    }

    removeRelatives(i) {
        (this.basicInfo.get('customerRelatives') as FormArray).removeAt(i);
    }

    get basicInfoControls() {
        return this.basicInfo.controls;
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

    searchByCustomerId() {
        const tempId = this.basicInfo.get('customerId').value;
        this.customerDetailField.showFormField = true;
        if (tempId) {
            this.customerSearchData.customerId = this.basicInfo.get('customerId').value;
            this.customerService.getByCustomerId(this.customerSearchData.customerId).subscribe((customerResponse: any) => {
                if (customerResponse.detail === undefined) {
                    this.getProvince();
                    this.customerDetailField.isOldCustomer = false;
                    this.toastService.show(new Alert(AlertType.INFO, 'No Customer Found under provided Customer Id.'));
                    this.customer = new Customer();
                    this.customer.customerId = tempId;
                    this.formMaker();
                    this.createRelativesArray();
                } else {
                    this.getProvince();
                    this.customer = customerResponse.detail;
                    this.formMaker();
                    this.setRelatives(this.customer.customerRelatives);
                }
            });
        } else {
            this.customer = new Customer();
            this.formMaker();
            this.createRelativesArray();
            this.toastService.show(new Alert(AlertType.INFO, 'No Customer Found under provided Customer Id.'));
        }
    }

    onSubmit() {
        this.customer.title = this.basicInfo.get('title').value;
        this.customer.customerName = this.basicInfo.get('customerName').value;
        this.customer.customerId = this.basicInfo.get('customerId').value;
        this.customer.accountNo = this.basicInfo.get('accountNo').value;
        this.customer.province = this.basicInfo.get('province').value;
        this.customer.district = this.basicInfo.get('district').value;
        this.customer.municipalities = this.basicInfo.get('municipalities').value;
        this.customer.street = this.basicInfo.get('street').value;
        this.customer.wardNumber = this.basicInfo.get('wardNumber').value;
        this.customer.contactNumber = this.basicInfo.get('contactNumber').value;
        this.customer.email = this.basicInfo.get('email').value;
        this.customer.dob = this.basicInfo.get('dob').value;
        this.customer.initialRelationDate = this.basicInfo.get('initialRelationDate').value;
        this.customer.citizenshipNumber = this.basicInfo.get('citizenshipNumber').value;
        this.customer.citizenshipIssuedPlace = this.basicInfo.get('citizenshipIssuedPlace').value;
        this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
        this.customer.occupation = this.basicInfo.get('occupation').value;
        this.customer.incomeSource = this.basicInfo.get('incomeSource').value;
        const rawFromValue = this.basicInfo.getRawValue();
        this.customer.customerRelatives = rawFromValue.customerRelatives;
    }

    getProvince() {
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.provinceList.forEach((province: Province) => {
                    if (this.customer !== undefined && this.customer.customerId) {
                        if (!ObjectUtil.isEmpty(this.customer.province)) {
                            if (province.id === this.customer.province.id) {
                                this.basicInfo.controls.province.setValue(province);
                                this.getDistricts(province);
                            }
                        }
                    }
                });
            }
        );
    }

    formMaker() {
        this.basicInfo = this.formBuilder.group({
            // title not used in ui
            title: [this.customer.title === undefined ? undefined : this.customer.title],
            customerName: [this.customer.customerName === undefined ? undefined : this.customer.customerName, Validators.required],
            customerId: [this.customer.customerId === undefined ? undefined : this.customer.customerId, Validators.required],
            accountNo: [this.customer.accountNo === undefined ? undefined : this.customer.accountNo, Validators.required],
            province: [this.customer.province === null ? undefined : this.customer.province, Validators.required],
            district: [this.customer.district === null ? undefined : this.customer.district, Validators.required],
            municipalities: [this.customer.municipalities === null ? undefined : this.customer.municipalities, Validators.required],
            street: [this.customer.street === null ? undefined : this.customer.street, Validators.required],
            wardNumber: [this.customer.wardNumber === null ? undefined : this.customer.wardNumber, Validators.required],
            contactNumber: [this.customer.contactNumber === undefined ? undefined : this.customer.contactNumber, Validators.required],
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
            dob: [ObjectUtil.isEmpty(this.customer.dob ) ? undefined :
                new Date(this.customer.dob), [ Validators.required, DateValidator.isValidBefore]],
            occupation: [this.customer.occupation === undefined ? undefined : this.customer.occupation, [Validators.required]],
            incomeSource: [this.customer.incomeSource === undefined ? undefined : this.customer.incomeSource, [Validators.required]],
            customerRelatives: this.formBuilder.array([])
        });
    }

    createRelativesArray() {
        const relation = ['Grand Father', 'Father', 'Spouse'];
        relation.forEach((customerRelation) => {
            (this.basicInfo.get('customerRelatives') as FormArray).push(this.formBuilder.group({
                customerRelation: [{value: customerRelation, disabled: true}],
                customerRelativeName: [undefined, Validators.compose([Validators.required])],
                citizenshipNumber: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedPlace: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedDate: [undefined, Validators.compose([Validators.required, DateValidator.isValidBefore])]
            }));
        });
    }

    setRelatives(currentData) {
        const relativesData = (this.basicInfo.get('customerRelatives') as FormArray);
        currentData.forEach((singleRelatives, index) => {
            const customerRelative = singleRelatives.customerRelation;
            // Increase index number with increase in static relatives---
            relativesData.push(this.formBuilder.group({
                customerRelation: (index > 2) ? [(customerRelative)] :
                    [({value: customerRelative, disabled: true}), Validators.required],
                customerRelativeName: [singleRelatives.customerRelativeName, Validators.required],
                citizenshipNumber: [singleRelatives.citizenshipNumber, Validators.required],
                citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace, Validators.required],
                citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
                    undefined : new Date(singleRelatives.citizenshipIssuedDate), [Validators.required, DateValidator.isValidBefore]]
            }));
        });
    }
}
