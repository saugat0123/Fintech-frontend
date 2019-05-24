import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {SubSegment} from '../../../modal/subSegment';
import {Segment} from '../../../modal/segment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SubSegmentFormComponent} from './sub-segment-form/sub-segment-form.component';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-sub-segment',
    templateUrl: './sub-segment.component.html'
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
        this.currentApi = 'v1/subSegment/get';
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
                    SubSegmentComponent.loadData(this);
                    this.viewSubSegment = true;
                }
                if (this.permissions[i].type === 'EDIT SUB-SEGMENT') {
                    this.editSubSegment = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {

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
        SubSegmentComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        SubSegmentComponent.loadData(this);
    }

    addSubSegment() {
        this.dataService.setSubSegment(new SubSegment());
        ModalUtils.resolve(this.modalService.open(SubSegmentFormComponent).result, SubSegmentComponent.loadData, this);
    }

    openEdit(subSegment: SubSegment, segment: Segment) {
        this.dataService.setSubSegment(subSegment);
        this.dataService.setSegment(segment);
        this.segment = this.dataService.getSegment();

        ModalUtils.resolve(this.modalService.open(SubSegmentFormComponent).result, SubSegmentComponent.loadData, this);
    }

}
