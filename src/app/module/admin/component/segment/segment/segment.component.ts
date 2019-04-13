import {Component, DoCheck, OnInit} from '@angular/core';

import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {Pageable} from '../../../../../shared-service/baseservice/common-pageable';
import {Segment} from '../../../modal/segment';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddSegmentComponent} from "../add-segment/add-segment.component";

declare var $;

@Component({
    selector: 'app-segment',
    templateUrl: './segment.component.html',
    styleUrls: ['./segment.component.css']
})
export class SegmentComponent implements OnInit, DoCheck {

    title = 'Segment';
    breadcrumb = 'Nepse > List';
    dataList: Array<Segment>;

    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    segments: number;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService:NgbModal
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/segment/get';
        this.getPagination();
        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.segments = response.detail.segments;

        });
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    addSegment(){
        this.dataService.setSegment(new Segment())
        this.modalService.open(AddSegmentComponent);
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
    openEdit(segment: Segment) {
        this.dataService.setSegment(segment);
        this.modalService.open(AddSegmentComponent);
    }

}
