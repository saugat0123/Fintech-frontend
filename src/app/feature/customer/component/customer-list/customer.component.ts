import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../service/customer.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanType} from '../../../loan/model/loanType';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {Province} from '../../../admin/modal/province';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';

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

    district: District = new District();
    province: Province = new Province();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    districts: District[];
    provinces: Province[];
    municipalities: MunicipalityVdc[];

    validStartDate = true;
    validEndDate = true;

    constructor(private customerService: CustomerService,
                private toastService: ToastService,
                private customerLoanService: LoanFormService,
                private router: Router,
                private formBuilder: FormBuilder,
                private location: AddressService
    ) {
    }

    static loadData(other: CustomerComponent) {
        other.spinner = true;
        other.customerLoanService.getCustomerFromCustomerLoan(other.filterForm.value, other.page, 10).subscribe((response: any) => {
            other.customerList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;

        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Customer!'));
            other.spinner = false;

        });

    }

    ngOnInit() {
        this.buildFilterForm();
        CustomerComponent.loadData(this);

        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({

            companyName: [undefined],
            customerName: [undefined],
            provinceId: [undefined],
            districtId: [undefined],
            municipalityId: [undefined],

            startDate: [undefined],
            endDate: [undefined]

        });
    }


    changePage(page: number) {
        this.page = page;
        CustomerComponent.loadData(this);
    }

    customerProfile(id) {

        this.router.navigate(['/home/customer/profile/' + id]);
    }

    onSearch() {
        CustomerComponent.loadData(this);

    }

    getCsv() {
    }

    getDistricts(provinceId) {
        this.province.id = provinceId;
        this.municipalities = [];
        this.filterForm.controls['districtId'].setValue(null);
        this.filterForm.controls['municipalityId'].setValue(null);

        this.location.getDistrictByProvince(this.province).subscribe(
            (response: any) => {
                this.districts = response.detail;
            }
        );
            console.log(this.districts);
    }

    getMunicipalities(districtId) {
        this.filterForm.controls['municipalityId'].setValue(null);
        this.district.id = districtId;
        this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
            }
        );
    }

    checkIfDateFiltration() {
        this.validStartDate = this.filterForm.get('startDate').valid;
        this.validEndDate = this.filterForm.get('endDate').valid;
    }


}
