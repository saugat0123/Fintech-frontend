import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {SubSector} from '../../../modal/sub-sector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddSubSectorComponent} from './add-sub-sector/add-sub-sector.component';
import {MsgModalComponent, UpdateModalComponent} from '../../../../../@theme/components';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';


@Component({
    selector: 'app-sub-sector',
    templateUrl: './sub-sector.component.html',
    styleUrls: ['./sub-sector.component.css']
})
export class SubSectorComponent implements OnInit, DoCheck {

    title = 'SubSector';
    breadcrumb = 'SubSector > List';
    dataList: Array<SubSector>;
    newValue: string;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    subSectors: number;
    permissions = [];
    addViewSubSector = false;
    viewSubSector = false;
    editSubSector = false;
    csvDownload = false;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/subSector/get';
        this.getPagination();

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.subSectors = response.detail.subSectors;
        });
        this.commonService.getByPost('v1/permission/chkPerm', 'SUBSECTOR').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD SUB-SECTOR') {
                    this.addViewSubSector = true;
                }
                if (this.permissions[i].type === 'VIEW SUB-SECTOR') {
                    this.viewSubSector = true;
                }
                if (this.permissions[i].type === 'EDIT SUB-SECTOR') {
                    this.editSubSector = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {
                    this.getPagination();
                    this.csvDownload = true;
                }
            }
        });
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

    addSubSector() {
        this.dataService.setSubSector(new SubSector());
        this.modalService.open(AddSubSectorComponent);
    }


    onChange(newValue, data) {

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }


        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/subSector');
        this.modalService.open(UpdateModalComponent);

    }

    openEdit(subSector: SubSector) {
        this.dataService.setSubSector(subSector);
        this.modalService.open(AddSubSectorComponent);

    }


    onSearchChange(searchValue: string) {
        this.search = {
            'subSectorName': searchValue
        };
        this.dataService.setData(this.search);
        this.getPagination();
    }

    onSearch() {
        this.dataService.setData(this.search);
        this.getPagination();
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }
}
