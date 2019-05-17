import {Component, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {LoanDataService} from '../../../service/loan-data.service';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonLocation} from '../../../../../@core/service/baseservice/common-location';


@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
    @Input() formValue: any;
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
        private commonLocation: CommonLocation,
        private loanDataService: LoanDataService
    ) {
    }

    // ngDoCheck() {
    //     this.onSubmit();
    // }


    ngOnInit() {
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
            }
        );
        this.basicInfo = this.formBuilder.group({
            title: [undefined],
            customerName: [undefined],
            customerId: [undefined],
            accountNo: [undefined],
            province: [undefined],
            district: [undefined],
            municipalitiesOrVDC: [undefined],
            telephone: [undefined],
            mobile: [undefined],
            email: [undefined],
            initialRelationDate: [undefined],
            citizenshipNumber: [undefined],
            citizenshipIssuedPlace: [undefined],
            citizenshipIssuedDate: [undefined]
        });
        if (this.loanDataService.getCustomer().customerName !== undefined) {
            this.customer = this.loanDataService.getCustomer();
            this.province = this.customer.province;
            this.getDistricts();
            this.district = this.customer.district;
            this.getMunicipalities();
            this.municipality = this.customer.municipalitiesOrVDC;
            console.log(this.customer);
            this.basicInfo = this.formBuilder.group({
                title: [this.customer.title],
                customerName: [this.customer.customerName],
                customerId: [this.customer.customerId],
                accountNo: [this.customer.accountNo],
                province: [this.province],
                district: [this.district],
                municipalitiesOrVDC: new FormControl(this.municipality),
                telephone: [this.customer.telephone],
                mobile: [this.customer.mobile],
                email: [this.customer.email],
                initialRelationDate: [this.customer.initialRelationDate],
                citizenshipNumber: [this.customer.citizenshipNumber],
                citizenshipIssuedPlace: [this.customer.issuedPlace],
                citizenshipIssuedDate: [this.customer.citizenshipIssuedDate]
            });
        }


    }

    getDistricts() {
        this.province = this.basicInfo.get('province').value;
        this.commonLocation.getDistrictByProvince(this.province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
            }
        );
    }

    getMunicipalities() {
        this.commonLocation.getMunicipalityVDCByDistrict(this.district).subscribe(
            (response: any) => {
                this.municipalitiesList = response.detail;
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
