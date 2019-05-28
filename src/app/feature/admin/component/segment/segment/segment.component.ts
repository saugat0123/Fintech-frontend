import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {Segment} from '../../../modal/segment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SegmentFormComponent} from './segment-form/segment-form.component';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {SegmentService} from './segment.service';
import {PermissionService} from '../../../../../@core/service/permission.service';


@Component({
    selector: 'app-segment',
    templateUrl: './segment.component.html'
})
export class SegmentComponent implements OnInit {

    title = 'Segment';
    breadcrumb = 'Nepse > List';

    page = 1;

    dataList: Array<Segment>;

    spinner = false;
    search: any = {};
    pageable: Pageable = new Pageable();
    activeCount: number;
    inactiveCount: number;
    segments: number;
    permissions = [];
    addViewSegment = false;
    viewSegment = false;
    editSegment = false;
    csvDownload = false;

    constructor(
        private service: SegmentService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: SegmentComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);
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

        SegmentComponent.loadData(this);

        this.service.getStatus().subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.segments = response.detail.segments;

        });
        this.permissionService.getPermissionOf('SEGMENT').subscribe((response: any) => {
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

    changePage(page: number) {
        this.page = page;

        SegmentComponent.loadData(this);
    }

    onSearch() {
        SegmentComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        SegmentComponent.loadData(this);
    }

    add() {
        const modelRef = this.modalService.open(SegmentFormComponent);
        modelRef.componentInstance.model = new Segment();

        ModalUtils.resolve(modelRef.result, SegmentComponent.loadData, this);
    }

    edit(segment: Segment) {

        const modelRef = this.modalService.open(SegmentFormComponent);
        modelRef.componentInstance.model = segment;

        ModalUtils.resolve(modelRef.result, SegmentComponent.loadData, this);
    }

}
