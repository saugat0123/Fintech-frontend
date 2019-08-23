import {Component, Input, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Customer} from '../../../../admin/modal/customer';
import {DateValidator} from '../../../../../@core/validator/date-validator';


@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
    @Input() formValue: Customer;

    basicInfo: FormGroup;
    submitted = false;

    customer: Customer = new Customer();
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService
    ) {
    }

    ngOnInit() {

        if (this.formValue !== undefined) {
            this.customer = this.formValue;
        }
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.provinceList.forEach(province => {
                    if (this.customer !== undefined) {
                        if (this.customer.province !== undefined && province.id === this.customer.province.id) {
                            this.basicInfo.controls.province.setValue(province);
                            this.getDistricts(province);
                        }
                    }
                });
            }
        );
        this.basicInfo = this.formBuilder.group({
            // title not used in ui
            title: [this.customer.title === undefined ? '' : this.customer.title],
            customerName: [this.customer.customerName === undefined ? '' : this.customer.customerName, Validators.required],
            customerId: [this.customer.customerId === undefined ? '' : this.customer.customerId, Validators.required],
            accountNo: [this.customer.accountNo === undefined ? '' : this.customer.accountNo, Validators.required],
            province: [this.customer.province === null ? '' : this.customer.province, Validators.required],
            district: [this.customer.district === null ? '' : this.customer.district, Validators.required],
            municipalities: [this.customer.municipalities === null ? '' : this.customer.municipalities, Validators.required],
            street: [this.customer.street === null ? '' : this.customer.street, Validators.required],
            wardNumber: [this.customer.wardNumber === null ? '' : this.customer.wardNumber, Validators.required],
            contactNumber: [this.customer.contactNumber === undefined ? '' : this.customer.contactNumber, Validators.required],
            email: [this.customer.email === undefined ? '' : this.customer.email, Validators.required],
            // initial Relation Date not used in ui
            initialRelationDate: [this.customer.initialRelationDate === undefined ? '' :
                this.customer.initialRelationDate],
            citizenshipNumber: [this.customer.citizenshipNumber === undefined ? '' : this.customer.citizenshipNumber
                , Validators.required],
            citizenshipIssuedPlace: [this.customer.citizenshipIssuedPlace === undefined ? '' : this.customer.citizenshipIssuedPlace,
                Validators.required],
            citizenshipIssuedDate: [this.customer.citizenshipIssuedDate === undefined ? '' :
                this.customer.citizenshipIssuedDate, [Validators.required, DateValidator.isValidBefore]],
            occupation: [this.customer.occupation === undefined ? '' : this.customer.occupation, [Validators.required]],
            incomeSource: [this.customer.incomeSource === undefined ? '' : this.customer.incomeSource, [Validators.required]],
        });
    }

    get basicInfoControls() {
        return this.basicInfo.controls;
    }

    getDistricts(province: Province) {
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.districtList.forEach(district => {
                    if (this.customer.district !== undefined && district.id === this.customer.district.id) {
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
                    if (this.customer.municipalities !== undefined && municipality.id === this.customer.municipalities.id) {
                        this.basicInfo.controls.municipalities.setValue(municipality);
                    }
                });
            }
        );

    }

    onSubmit() {
        this.customer.title = this.basicInfo.get('title').value;
        this.customer.customerName = this.basicInfo.get('customerName').value;
        this.customer.customerId = this.basicInfo.get('customerId').value;
        this.customer.accountNo = this.basicInfo.get('accountNo').value;
        this.customer.province = this.basicInfo.get('province').value;
        this.customer.district = this.basicInfo.get('district').value;
        this.customer.municipalities = this.basicInfo.get('municipalities').value;
        this.customer.contactNumber = this.basicInfo.get('contactNumber').value;
        this.customer.email = this.basicInfo.get('email').value;
        this.customer.initialRelationDate = this.basicInfo.get('initialRelationDate').value;
        this.customer.citizenshipNumber = this.basicInfo.get('citizenshipNumber').value;
        this.customer.citizenshipIssuedPlace = this.basicInfo.get('citizenshipIssuedPlace').value;
        this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
        this.customer.occupation = this.basicInfo.get('occupation').value;
        this.customer.incomeSource = this.basicInfo.get('incomeSource').value;
    }

}
