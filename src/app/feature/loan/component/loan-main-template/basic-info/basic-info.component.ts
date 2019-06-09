import {Component, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {LoanDataService} from '../../../service/loan-data.service';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';


@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
    @Input() formValue: Customer;
    customer: Customer = new Customer();
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    basicInfo: FormGroup;

    provinceList: Province[] = [];
    districtList: District[] = [];
    municipalitiesList: MunicipalityVdc[] = [];
    province: Province = new Province();
    district: District = new District();
    municipality: MunicipalityVdc = new MunicipalityVdc();


    constructor(
        private commonService: CommonService,
        private commonDataService: CommonDataService,
        private router: Router,
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private loanDataService: LoanDataService
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
            title: [this.customer.title === undefined ? '' : this.customer.title, Validators.required],
            customerName: [this.customer.customerName === undefined ? '' : this.customer.customerName, Validators.required],
            customerId: [this.customer.customerId === undefined ? '' : this.customer.customerId, Validators.required],
            accountNo: [this.customer.accountNo === undefined ? '' : this.customer.accountNo, Validators.required],
            province: [this.customer.province === null ? '' : this.customer.province, Validators.required],
            district: [this.customer.district === null ? '' : this.customer.district, Validators.required],
            municipalitiesOrVDC: [this.customer.municipalitiesOrVDC === null ? '' : this.customer.municipalitiesOrVDC, Validators.required],
            telephone: [this.customer.telephone === undefined ? '' : this.customer.telephone, Validators.required],
            mobile: [this.customer.mobile === undefined ? '' : this.customer.mobile, Validators.required],
            email: [this.customer.email === undefined ? '' : this.customer.email, Validators.required],
            initialRelationDate: [this.customer.initialRelationDate === undefined ? '' :
                this.customer.initialRelationDate, Validators.required],
            citizenshipNumber: [this.customer.citizenshipNumber === undefined ? '' : this.customer.citizenshipNumber, Validators.required],
            citizenshipIssuedPlace: [this.customer.issuedPlace === undefined ? '' : this.customer.issuedPlace, Validators.required],
            citizenshipIssuedDate: [this.customer.citizenshipIssuedDate === undefined ? '' :
                this.customer.citizenshipIssuedDate, Validators.required],
        });
        /*if (this.formValue !== undefined) {
            this.loanDataService.setCustomer(this.formValue);
        }*/
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
                    if (this.customer.municipalitiesOrVDC !== undefined && municipality.id === this.customer.municipalitiesOrVDC.id) {
                        this.basicInfo.controls.municipalitiesOrVDC.setValue(municipality);
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
        this.customer.municipalitiesOrVDC = this.basicInfo.get('municipalitiesOrVDC').value;
        this.customer.telephone = this.basicInfo.get('telephone').value;
        this.customer.mobile = this.basicInfo.get('mobile').value;
        this.customer.email = this.basicInfo.get('email').value;
        this.customer.initialRelationDate = this.basicInfo.get('initialRelationDate').value;
        this.customer.citizenshipNumber = this.basicInfo.get('citizenshipNumber').value;
        this.customer.issuedPlace = this.basicInfo.get('citizenshipIssuedPlace').value;
        this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
        this.loanDataService.setCustomer(this.customer);

        console.log('running state');
    }
}
