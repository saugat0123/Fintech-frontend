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
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

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
    loanType: LoanType;

    district: District = new District();
    province: Province = new Province();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    districts: District[];
    provinces: Province[];
    municipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();

    validStartDate = true;
    validEndDate = true;
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();


    constructor(private customerService: CustomerService,
                private toastService: ToastService,
                private customerLoanService: LoanFormService,
                private router: Router,
                private formBuilder: FormBuilder,
                private location: AddressService,
                private loanConfigService: LoanConfigService
    ) {
    }

    static loadData(other: CustomerComponent) {
        other.spinner = true;
        other.customerLoanService.getCustomerFromCustomerLoan(other.customerService.search, other.page, 10).subscribe((response: any) => {
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

        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });

        /*fetches the LoanType*/
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load loan type'));
        });

        CustomerComponent.loadData(this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({

            companyName: [undefined],
            customerName: [undefined],
            provinceId: [undefined],
            districtId: [undefined],
            municipalityId: [undefined],
            startDate: [undefined],
            endDate: [undefined],
            loanConfigId: [undefined],
            loanCategory: [undefined],
            loanStatus: [undefined]
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
        this.customerService.search.customerName = ObjectUtil.isEmpty(this.filterForm.get('customerName').value) ?
            undefined : this.filterForm.get('customerName').value;
        this.customerService.search.provinceId = ObjectUtil.isEmpty(this.filterForm.get('provinceId').value) ?
            undefined : this.filterForm.get('provinceId').value;
        this.customerService.search.districtId = ObjectUtil.isEmpty(this.filterForm.get('districtId').value) ?
            undefined : this.filterForm.get('districtId').value;
        this.customerService.search.municipalityId = ObjectUtil.isEmpty(this.filterForm.get('municipalityId').value) ?
            undefined : this.filterForm.get('municipalityId').value;
        /*check if both the startDate and endDate exists*/
        if (!ObjectUtil.isEmpty(this.filterForm.get('startDate').value && this.filterForm.get('endDate').value)) {
            this.customerService.search.associatedDate = JSON.stringify({
                'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
                'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
            });
        }
        this.customerService.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loanConfigId').value) ?
            undefined : this.filterForm.get('loanConfigId').value;
        this.customerService.search.loanCategory = ObjectUtil.isEmpty(this.filterForm.get('loanCategory').value) ?
            undefined : this.filterForm.get('loanCategory').value;
        this.customerService.search.loanStatus = ObjectUtil.isEmpty(this.filterForm.get('loanStatus').value) ?
            undefined : this.filterForm.get('loanStatus').value;
        CustomerComponent.loadData(this);
        console.log(this.customerService.search);
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

    clear() {
        this.districts = [];
        this.municipalities = [];
        this.buildFilterForm();
        this.customerService.search.associatedDate = undefined;
        this.onSearch();
        this.isFilterCollapsed = true;
    }

}
