import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {SubSector} from '../../../modal/sub-sector';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddSubSectorComponent} from "./add-sub-sector/add-sub-sector.component";
import {UpdateModalComponent} from '../../../../../common/update-modal/update-modal.component';

declare var $;

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


    constructor(private dataService: CommonDataService,
                private commonService: CommonService,
                private commonPageService: CommonPageService,
                private modalService:NgbModal) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/subSector/get';
        this.getPagination();

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.subSectors = response.detail.subSectors;
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
                $('.global-msgModal').modal('show');
            }
        );
    }

    addSubSector(){
        this.dataService.setSubSector(new SubSector());
        this.modalService.open(AddSubSectorComponent);
    }


    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) { document.activeElement.blur(); }
        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/subSector');
        this.modalService.open(UpdateModalComponent);

    }

    openEdit(subSector: SubSector){
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
