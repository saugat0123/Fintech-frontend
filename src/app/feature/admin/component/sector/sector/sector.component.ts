import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {Sector} from '../../../modal/sector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SectorFormComponent} from './sector-form/sector-form.component';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-sector',
    templateUrl: './sector.component.html'
})
export class SectorComponent implements OnInit, DoCheck {

    title = 'Sector';
    breadcrumb = 'Sector > List';
    dataList: Array<Sector>;
    newValue: string;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    sectors: number;
    permissions = [];
    addViewSector = false;
    viewSector = false;
    editSector = false;
    csvDownload = false;

    constructor(private dataService: CommonDataService,
                private commonService: CommonService,
                private commonPageService: CommonPageService,
                private modalService: NgbModal,
                private toastService: ToastService) {
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
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data'));

                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/sector/get';

        SectorComponent.loadData(this);

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.sectors = response.detail.sectors;
        });
        this.commonService.getByPost('v1/permission/chkPerm', 'SECTOR').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD SECTOR') {
                    this.addViewSector = true;
                }
                if (this.permissions[i].type === 'VIEW SECTOR') {
                    this.viewSector = true;
                }
                if (this.permissions[i].type === 'EDIT SECTOR') {
                    this.editSector = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {
                    SectorComponent.loadData(this);
                    this.csvDownload = true;
                }
            }
        });
    }


    addSector() {

        this.dataService.setSector(new Sector());

        ModalUtils.resolve(this.modalService.open(SectorFormComponent).result, SectorComponent.loadData, this);
    }


    onChange(newValue, data) {

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/sector');
        this.modalService.open(UpdateModalComponent);
    }

    openEdit(sector: Sector) {
        this.dataService.setSector(sector);
        ModalUtils.resolve(this.modalService.open(SectorFormComponent).result, SectorComponent.loadData, this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        SectorComponent.loadData(this);
    }

    onSearch() {
        this.dataService.setData(this.search);
        SectorComponent.loadData(this);
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }
}
