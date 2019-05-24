import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {SubSector} from '../../../modal/sub-sector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SubSectorFormComponent} from './sub-sector-form/sub-sector-form.component';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-sub-sector',
    templateUrl: './sub-sector.component.html'
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
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: any) {

        other.spinner = true;
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
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/subSector/get';

        SubSectorComponent.loadData(this);

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
                    SubSectorComponent.loadData(this);
                    this.csvDownload = true;
                }
            }
        });
    }

    addSubSector() {
        this.dataService.setSubSector(new SubSector());
        ModalUtils.resolve(this.modalService.open(SubSectorFormComponent).result, SubSectorComponent.loadData, this);
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
        ModalUtils.resolve(this.modalService.open(SubSectorFormComponent).result, SubSectorComponent.loadData, this);
    }


    onSearchChange(searchValue: string) {
        this.search = {
            'subSectorName': searchValue
        };
        this.dataService.setData(this.search);
        SubSectorComponent.loadData(this);
    }

    onSearch() {
        this.dataService.setData(this.search);
        SubSectorComponent.loadData(this);
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }
}
