import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonLocation} from '../../../../../shared-service/baseservice/common-location';
import {LoanDataService} from '../../../service/loan-data.service';


@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit, DoCheck {
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

    ngDoCheck() {
        if (this.loanDataService.getNext() !== undefined) {
            this.onSubmit();
        }
    }

    ngOnInit() {
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                console.log(response.detail);
                this.provinceList = response.detail;
            }
        );
        this.basicInfo = this.formBuilder.group({
            title: [''],
            customerName: [''],
            customerId: [''],
            accountNo: [''],
            province: [''],
            district: [''],
            municipalitiesOrVDC: [''],
            telephone: [''],
            mobile: [''],
            email: [''],
            initialRelationDate: [''],
            citizenshipNumber: [''],
            citizenshipIssuedPlace: [''],
            citizenshipIssuedDate: ['']
        });
    }

    getDistricts() {
        console.log(this.province);
        this.commonLocation.getDistrictByProvince(this.province).subscribe(
            (response: any) => {
                console.log(response.detail);
                this.districtList = response.detail;
            }
        );
    }

    getMunicipalities() {
        console.log(this.district);
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
        this.commonDataService.setCustomer(this.customer);
        this.loanDataService.setLoanDocuments('basicInfo', this.commonDataService.getCustomer());
        // this.commonService.saveOrEdit(this.customer,'v1/basicInfo').subscribe();
        // this.router.navigate(['home/loan/kyc-info']);
    }


}
