import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Branch} from '../../modal/branch';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddModelComponent} from './add-model/add-model.component';
import {MunicipalityVdc} from '../../modal/municipality_VDC';
import {UpdateModalComponent} from '../../../../common/update-modal/update-modal.component';
import {MsgModalComponent} from '../../../../common/msg-modal/msg-modal.component';
import {Province} from '../../modal/province';
import {District} from '../../modal/district';
import {CommonLocation} from '../../../../shared-service/baseservice/common-location';
import {BreadcrumbService} from '../../../../common/breadcrum/breadcrumb.service';


declare var $;

@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html',
    styleUrls: ['./branch.component.css']
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
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
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
                    this.getPagination();
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
        this.dataService.setData(this.search);
        this.getPagination();
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        this.getPagination();
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(branch: Branch) {
        this.dataService.setBranch(branch);
        this.modalService.open(AddModelComponent);
    }

    addBranch() {
        this.dataService.setBranch(new Branch());
        this.modalService.open(AddModelComponent);
    }


    onChange(newValue, data) {
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

    getPagination() {
        this.spinner = true;
        this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
                this.dataList = response.detail.content;
                this.dataService.setDataList(this.dataList);
                this.commonPageService.setCurrentApi(this.currentApi);
                this.pageable = this.commonPageService.setPageable(response.detail);
                this.spinner = false;
            }, error => {
                this.globalMsg = error.error.message;
                if (this.globalMsg == null) {
                    this.globalMsg = 'Please check your network connection';
                }
                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.modalService.open(MsgModalComponent);
            }
        );
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
