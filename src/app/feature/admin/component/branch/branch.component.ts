import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {Branch} from '../../modal/branch';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BranchFormComponent} from './branch-form/branch-form.component';

import {MunicipalityVdc} from '../../modal/municipality_VDC';


import {Province} from '../../modal/province';
import {District} from '../../modal/district';
import {CommonLocation} from '../../../../@core/service/baseservice/common-location';
import {UpdateModalComponent} from '../../../../@theme/components';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html'
})
export class BranchComponent implements OnInit, DoCheck {
    title = 'Branch';
    breadcrumb = 'Branch > List';
    dataList: Array<Branch> = new Array<Branch>();
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    branches: number;
    newValue: string;
    branch: Branch = new Branch();


    permissions = [];
    viewBranch = false;
    addViewBranch = false;
    downloadCsv = false;
    editViewBranch = false;

    provinces: Province[];
    districts: District[];
    municipalities: MunicipalityVdc[];
    district: District = new District();
    province: Province = new Province();
    municipality: MunicipalityVdc = new MunicipalityVdc();

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private location: CommonLocation,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: any) {
        other.spinner = true;
        console.log(other);
        other.commonService.getByPostAllPageable(other.currentApi, other.search, 1, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                other.dataService.setDataList(other.dataList);
                other.commonPageService.setCurrentApi(other.currentApi);
                other.pageable = other.commonPageService.setPageable(response.detail);
                other.spinner = false;
            }, error => {

                console.log(error);

                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        console.log(this);
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/branch/get';

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {
            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.branches = response.detail.branches;
        });

        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });

        this.commonService.getByPost('v1/permission/chkPerm', 'BRANCH').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD BRANCH') {
                    this.addViewBranch = true;
                }
                if (this.permissions[i].type === 'VIEW BRANCH') {
                    BranchComponent.loadData(this);
                    this.viewBranch = true;
                }
                if (this.permissions[i].type === 'EDIT BRANCH') {
                    this.editViewBranch = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {
                    this.downloadCsv = true;
                }
            }
        });
    }

    onSearch() {
        console.log(this.search);
        this.dataService.setData(this.search);
        console.log(this);
        BranchComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        console.log(searchValue);
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        BranchComponent.loadData(this);

    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(branch: Branch) {
        this.dataService.setBranch(branch);
        ModalUtils.resolve(this.modalService.open(BranchFormComponent, {size: 'lg'}).result, BranchComponent.loadData, this);
    }

    addBranch() {
        this.dataService.setBranch(new Branch());

        ModalUtils.resolve(this.modalService.open(BranchFormComponent, {size: 'lg'}).result, BranchComponent.loadData, this);
    }


    onChange(newValue, data) {

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/branch');
        this.modalService.open(UpdateModalComponent);
    }

    delete(allList) {
        allList.status = 'DELETED';
        this.onChange(allList.status, allList);
    }


    clearSearch() {
        this.search = {};
    }

    getCsv() {
        this.commonService.saveOrEdit(this.search, 'v1/branch/csv').subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = response.detail;
            link.download = response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();
        });
    }


    getMunicipalities(districtId) {
        delete this.search['districtId'];
        delete this.search['municipalityId'];
        this.search.districtId = districtId.toString();
        this.district.id = districtId;
        this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
            }
        );

    }


    getDistricts(provinceId) {
        this.province.id = provinceId;
        delete this.search['districtId'];
        delete this.search['provinceId'];
        delete this.search['municipalityId'];

        if (provinceId !== 'All') {
            this.search.provinceId = provinceId.toString();
            this.location.getDistrictByProvince(this.province).subscribe(
                (response: any) => {
                    this.districts = response.detail;
                }
            );
        } else {
            this.districts = [];
            this.municipalities = [];

        }
    }

    getMunicipality(municipalityId) {
        this.search.municipalityId = municipalityId.toString();

    }
}
