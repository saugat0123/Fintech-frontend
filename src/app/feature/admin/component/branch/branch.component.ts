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

@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html'
})
export class BranchComponent implements OnInit {
    title = 'Branch';
    breadcrumb = 'Branch > List';
    dataList: Array<Branch> = new Array<Branch>();
    spinner = false;

    page = 1;

    search: any = {};
    pageable: Pageable = new Pageable();

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
        private service: BranchService,
        private permissionService: PermissionService,
        private location: AddressService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
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

        this.breadcrumbService.notify(this.title);

        this.service.getStatus().subscribe((response: any) => {
            console.log(response);
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

    changePage(page: number) {
        this.page = page;

        BranchComponent.loadData(this);
    }

    onSearch() {
        BranchComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        BranchComponent.loadData(this);
    }

    edit(branch: Branch) {

        const modalRef = this.modalService.open(BranchFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = branch;

        ModalUtils.resolve(modalRef.result, BranchComponent.loadData, this);
    }

    add() {

        const modalRef = this.modalService.open(BranchFormComponent, {size: 'lg'});

        modalRef.componentInstance.model = new Branch();

        ModalUtils.resolve(modalRef.result, BranchComponent.loadData, this);
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
        this.service.download(this.search).subscribe((response: any) => {
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
