import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {SubSegment} from '../../../modal/subSegment';
import {Segment} from '../../../modal/segment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SubSegmentFormComponent} from './sub-segment-form/sub-segment-form.component';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {SubSegmentService} from './sub-segment.service';
import {PermissionService} from '../../../../../@core/service/permission.service';


@Component({
    selector: 'app-sub-segment',
    templateUrl: './sub-segment.component.html'
})
export class SubSegmentComponent implements OnInit {

    title = 'Sub-Segment';
    breadcrumb = 'Sub-Segment > List';
    page = 1;

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
        private service: SubSegmentService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: SubSegmentComponent) {
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
        this.currentApi = 'v1/subSegment/get';
        this.service.getStatus().subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.subSegments = response.detail.subSegments;

        });
        this.permissionService.getPermissionOf('SUB SEGMENT').subscribe((response: any) => {
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

    changePage(page: number) {
        this.page = page;

        SubSegmentComponent.loadData(this);
    }

    onSearch() {
        SubSegmentComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        SubSegmentComponent.loadData(this);
    }

    addSubSegment() {
        const modalRef = this.modalService.open(SubSegmentFormComponent);
        modalRef.componentInstance.model = new SubSegment();

        ModalUtils.resolve(modalRef.result, SubSegmentComponent.loadData, this);
    }

    openEdit(subSegment: SubSegment, segment: Segment) {
        const modalRef = this.modalService.open(SubSegmentFormComponent);
        modalRef.componentInstance.model = subSegment;

        ModalUtils.resolve(modalRef.result, SubSegmentComponent.loadData, this);
    }

}
