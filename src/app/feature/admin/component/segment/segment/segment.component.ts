import {Component, DoCheck, OnInit} from '@angular/core';

import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {Segment} from '../../../modal/segment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SegmentFormComponent} from './segment-form/segment-form.component';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-segment',
    templateUrl: './segment.component.html'
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
    permissions = [];
    addViewSegment = false;
    viewSegment = false;
    editSegment = false;
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

                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/segment/get';

        SegmentComponent.loadData(this);

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.segments = response.detail.segments;

        });
        this.commonService.getByPost('v1/permission/chkPerm', 'SEGMENT').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD SEGMENT') {
                    this.addViewSegment = true;
                }
                if (this.permissions[i].type === 'VIEW SEGMENT') {
                    this.viewSegment = true;
                }
                if (this.permissions[i].type === 'EDIT SEGMENT') {
                    this.editSegment = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {
                    SegmentComponent.loadData(this);
                    this.csvDownload = true;
                }
            }
        });
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    onSearch() {
        this.dataService.setData(this.search);
        SegmentComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        SegmentComponent.loadData(this);
    }

    addSegment() {
        this.dataService.setSegment(new Segment());
        ModalUtils.resolve(this.modalService.open(SegmentFormComponent).result, SegmentComponent.loadData, this);
    }

    openEdit(segment: Segment) {
        this.dataService.setSegment(segment);
        ModalUtils.resolve(this.modalService.open(SegmentFormComponent).result, SegmentComponent.loadData, this);
    }

}
