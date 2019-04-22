import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {Pageable} from '../../../../../shared-service/baseservice/common-pageable';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {SubSegment} from '../../../modal/subSegment';
import {Segment} from '../../../modal/segment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddSubSegmentComponent} from '../add-sub-segment/add-sub-segment.component';
import {MsgModalComponent} from '../../../../../common/msg-modal/msg-modal.component';


@Component({
    selector: 'app-sub-segment',
    templateUrl: './sub-segment.component.html',
    styleUrls: ['./sub-segment.component.css']
})
export class SubSegmentComponent implements OnInit, DoCheck {

    title = 'Sub-Segment';
    breadcrumb = 'Sub-Segment > List';
    dataList: Array<SubSegment>;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    segment: Segment = new Segment();
    subSegments: number;
    permissions = [];
    addViewSubSegment = false;
    viewSubSegment = false;
    editSubSegment = false;
    csvDownload = false;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/subSegment/get';
        this.getPagination();
        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.subSegments = response.detail.subSegments;

        });
        this.commonService.getByPost('v1/permission/chkPerm', 'SUB SEGMENT').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD SUB-SEGMENT') {
                    this.addViewSubSegment = true;
                }
                if (this.permissions[i].type === 'VIEW SUB-SEGMENT') {
                    this.viewSubSegment = true;
                }
                if (this.permissions[i].type === 'EDIT SUB-SEGMENT') {
                    this.editSubSegment = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {
                    this.getPagination();
                    this.csvDownload = true;
                }
            }
        });
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    addSubSegment() {
        this.dataService.setSubSegment(new SubSegment());
        this.modalService.open(AddSubSegmentComponent);
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

    openEdit(subSegment: SubSegment, segment: Segment) {
        this.dataService.setSubSegment(subSegment);
        this.dataService.setSegment(segment);
        this.segment = this.dataService.getSegment();

        console.log(this.segment.segmentName);
        this.modalService.open(AddSubSegmentComponent);
    }

}
