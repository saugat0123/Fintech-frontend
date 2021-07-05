import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Branch} from '../../modal/branch';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BranchFormComponent} from './branch-form/branch-form.component';

import {MunicipalityVdc} from '../../modal/municipality_VDC';


import {Province} from '../../modal/province';
import {District} from '../../modal/district';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {BranchService} from './branch.service';
import {PermissionService} from '../../../../@core/service/permission.service';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Action} from '../../../../@core/Action';

@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html'
})
export class BranchComponent implements OnInit {
    title = 'Branch';
    breadcrumb = 'Branch > List';
    dataList: Array<Branch> = new Array<Branch>();
    spinner = false;
    isFilterCollapsed = true;

    page = 1;

    pageable: Pageable = new Pageable();

    activeCount: number;
    inactiveCount: number;
    branches: number;
    branch: Branch = new Branch();

    permissions = [];
    viewBranch = false;
    addViewBranch = false;
    downloadCsv = false;
    editViewBranch = false;
    restApi = ApiConfig.URL;

    provinces: Province[];
    districts: District[];
    municipalities: MunicipalityVdc[];
    district: District = new District();
    province: Province = new Province();
    municipality: MunicipalityVdc = new MunicipalityVdc();

    filterForm: FormGroup;
    search: any = {
        name: undefined,
        provinceId: undefined,
        districtId: undefined,
        municipalityId: undefined
    };

    constructor(
        private service: BranchService,
        private permissionService: PermissionService,
        private location: AddressService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private formBuilder: FormBuilder
    ) {
    }

    static loadData(other: BranchComponent) {

        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);

                other.spinner = false;
            }, error => {

                console.log(error);

                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.buildFilterForm();
        this.breadcrumbService.notify(this.title);
        this.service.getStatus().subscribe((response: any) => {
            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.branches = response.detail.branches;
        });

        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });

        this.permissionService.getPermissionOf('BRANCH').subscribe((response: any) => {
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

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            name: undefined,
            provinceId: undefined,
            districtId: undefined,
            municipalityId: undefined
        });
    }

    changePage(page: number) {
        this.page = page;
        BranchComponent.loadData(this);
    }

    onSearch() {
        this.search.name = this.filterForm.get('name').value === null ? undefined :
            this.filterForm.get('name').value;
        this.search.provinceId = this.filterForm.get('provinceId').value === null ? undefined :
            this.filterForm.get('provinceId').value;
        this.search.districtId = this.filterForm.get('districtId').value === null ? undefined :
            this.filterForm.get('districtId').value;
        this.search.municipalityId = this.filterForm.get('municipalityId').value === null ? undefined :
            this.filterForm.get('municipalityId').value;
        console.log(this.search);
        BranchComponent.loadData(this);
    }

    edit(branch: Branch) {

        const modalRef = this.modalService.open(BranchFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = branch;
        modalRef.componentInstance.action = Action.UPDATE;

        ModalUtils.resolve(modalRef.result, BranchComponent.loadData, this);
    }

    add() {

        const modalRef = this.modalService.open(BranchFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = new Branch();
        modalRef.componentInstance.action = Action.ADD;

        ModalUtils.resolve(modalRef.result, BranchComponent.loadData, this);
    }

    onChange(data) {

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        event.preventDefault();

        const modalRef = this.modalService.open(UpdateModalComponent, {size: 'lg'});
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.service = this.service;
    }

    delete(allList) {
        allList.status = 'DELETED';
        this.onChange(allList);
    }


    clear() {
        this.districts = [];
        this.municipalities = [];
        this.buildFilterForm();
        this.isFilterCollapsed = true;
    }

    getCsv() {
        this.service.download(this.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = this.restApi + '/' + response.detail;
            link.download = this.restApi + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();
        });
    }


    getMunicipalities(districtId) {
        this.filterForm.controls['municipalityId'].setValue(null);
        this.district.id = districtId;
        this.location.getMunicipalityVDCByDistrict(this.district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
                this.municipalities.sort((a,b) => a.name.localeCompare(b.name));
            }
        );
    }

    getDistricts(provinceId) {
        this.province.id = provinceId;
        this.municipalities = [];
        this.filterForm.controls['districtId'].setValue(null);
        this.filterForm.controls['municipalityId'].setValue(null);

        this.location.getDistrictByProvince(this.province).subscribe(
            (response: any) => {
                this.districts = response.detail;
                this.districts.sort((a,b) => a.name.localeCompare(b.name));
            }
        );
    }

}
