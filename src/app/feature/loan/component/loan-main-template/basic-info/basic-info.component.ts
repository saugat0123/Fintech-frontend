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
import {Address} from '../../../model/address';

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
    districts: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    municipalities:  Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    addresslist: Array<Address> = new Array<Address>();

    occupations = Occupation.enumObject();
    incomeSources = IncomeSource.enumObject();

    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private customerService: CustomerService,
        private toastService: ToastService,
    ) {
    }

    def(val) {
        console.log('Formvalue of customer:', val);
    }

    ngOnInit() {
        this.def(this.formValue);
        this.getProvince();
        this.formMaker();
        if (this.formValue !== undefined || null) {
            if (this.formValue.customerId !== undefined || null) {
                this.customerDetailField.showFormField = true;
            }
            this.customer = this.formValue;
            this.formMaker();
            this.setRelatives(this.customer.customerRelatives);
        } else {
            this.createRelativesArray();
        }
    }
    logs(message: string, rel) {
        console.log(message, rel);
    }

    getRelatives() {
        return (this.basicInfo.value.customerRelatives as FormArray);
    }
    RelativesFormGroup(): FormGroup {
        this.addresslist.push(new Address());
           return  this.formBuilder.group({
                customerRelation: [undefined, Validators.required],
                customerRelativeName: [undefined, Validators.compose([Validators.required])],
                citizenshipNumber: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedPlace: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedDate: [undefined, Validators.compose([Validators.required, DateValidator.isValidBefore])],
                province: [undefined, Validators.compose([Validators.required])],
                district: [undefined, Validators.compose([Validators.required])],
                municipalities: [undefined, Validators.compose([Validators.required])]
            });
    }

    addRelatives() {
        this.addresslist.push(new Address());
        (<FormArray>this.basicInfo.get('customerRelatives')).push(this.RelativesFormGroup());
    }

    removeRelatives(i) {
        this.logs('Delete: ', i);
        (this.basicInfo.get('customerRelatives') as FormArray).removeAt(i);
        this.addresslist.splice(i, 1);
    }

    get basicInfoControls() {
        return this.basicInfo.controls;
    }

    getDistricts(province: Province) {
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.districtList.forEach((district) => {
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
                this.municipalitiesList.forEach((municipality) => {
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
                    console.log(this.customer.customerRelatives);
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
        this.customer = new Customer();
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
        this.customer.customerRelatives = new Array<CustomerRelative>();

        let proprietorsIndex = 0;
        while (proprietorsIndex < this.getRelatives().length) {
            const customerRelative = new CustomerRelative();
            customerRelative.customerRelation = this.getRelatives()[proprietorsIndex].customerRelation;
            customerRelative.citizenshipNumber = this.getRelatives()[proprietorsIndex].citizenshipNumber;
            customerRelative.citizenshipIssuedDate = this.getRelatives()[proprietorsIndex].citizenshipIssuedDate;
            const province = new Province();
            province.id = this.getRelatives()[proprietorsIndex].province;
            customerRelative.province = province;
            const district = new District();
            district.id = this.getRelatives()[proprietorsIndex].district;
            customerRelative.district = district;
            const municipalityVdc = new MunicipalityVdc();
            municipalityVdc.id = this.getRelatives()[proprietorsIndex].municipalities;
            customerRelative.municipalities = municipalityVdc;
            proprietorsIndex++;
            this.customer.customerRelatives.push(customerRelative);
        }
    }

    getProvince() {
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.provinceList.forEach((province: Province, index) => {
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
            customerRelatives: this.formBuilder.array([
            ]),

        });
    }

    createRelativesArray() {
        this.addresslist.push(new Address());
            (this.basicInfo.get('customerRelatives') as FormArray).push(this.formBuilder.group({
                customerRelation: [undefined, Validators.compose([Validators.required])],
                customerRelativeName: [undefined, Validators.compose([Validators.required])],
                citizenshipNumber: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedPlace: [undefined, Validators.compose([Validators.required])],
                citizenshipIssuedDate: [undefined, Validators.compose([Validators.required, DateValidator.isValidBefore])],
                province: [undefined, Validators.compose([Validators.required])],
                municipalities: [undefined, Validators.compose([Validators.required])],
                district: [undefined, Validators.compose([Validators.required])]

            }));
        }

    setRelatives(currentData: Array<CustomerRelative>): FormArray {
        console.log(currentData, 'ppp');
        const relativesData = (this.basicInfo.get('customerRelatives') as FormArray);
        this.addresslist = new Array<Address>(currentData.length);
        console.log('address value from setRelatives:', this.addresslist);
        let relativeIndex = 0;
        currentData.forEach((singleRelatives, index) => {
            console.log(singleRelatives);
            this.addresslist[relativeIndex] = new Address();
                if (singleRelatives.province.id !== null) {
                    this.Districts(singleRelatives.province.id, relativeIndex);
                    if (singleRelatives.district.id !== null) {
                        this.Municipalities(singleRelatives.district.id, relativeIndex);
                    }
                }
            relativeIndex ++;
            const customerRelative = singleRelatives.customerRelation;
            // Increase index number with increase in static relatives---
            relativesData.push(this.formBuilder.group({
                customerRelation: (index > 2) ? [(customerRelative)] :
                    [({value: customerRelative, disabled: true}), Validators.required],
                customerRelativeName: [singleRelatives.customerRelativeName, Validators.required],
                citizenshipNumber: [singleRelatives.citizenshipNumber, Validators.required],
                citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace, Validators.required],
                citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
                    undefined : new Date(singleRelatives.citizenshipIssuedDate), [Validators.required, DateValidator.isValidBefore]],
                province:  [singleRelatives.province , [Validators.required]],
                municipalities: [singleRelatives.municipalities, [Validators.required]],
                district: [singleRelatives.district, [Validators.required]]
            }));
        });
        return relativesData;
    }

    Districts(provinceId: number, index: number) {
        const province = new Province();
        province.id = provinceId;
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                console.log('response: ', response.detail);
                this.districts = response.detail;
                console.log('districts:', this.districts);
                this.addresslist[index].districtList = this.districts;
            }
        );
        console.log('index:', index);
        console.log('province.id: ', province.id, 'and ProvinceId: ', provinceId);
        // console.log('districts:', this.districts);
        console.log('address:', this.addresslist[index]);
        console.log('districtList: ', this.addresslist[index].districtList );

    }
    Municipalities(districtId: number, index: number) {
        const district = new District();
        district.id = districtId;
        this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
                this.addresslist[index].municipalityVdcList = this.municipalities;
            }
        );

    }

    reviewed(point) {
        console.log('povision clicked: ', point);
    }


}
