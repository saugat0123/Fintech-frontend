import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {SubSector} from '../../../modal/sub-sector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SubSectorFormComponent} from './sub-sector-form/sub-sector-form.component';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';


@Component({
    selector: 'app-sub-sector',
    templateUrl: './sub-sector.component.html'
})
export class SubSectorComponent implements OnInit {

    page = 1;

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
        private commonService: CommonService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: SubSectorComponent) {

        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, other.page, 10).subscribe((response: any) => {
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

    changePage(page: number) {
        this.page = page;

        SubSectorComponent.loadData(this);
    }

    onChange(newValue, data) {

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        event.preventDefault();
        this.newValue = newValue;
        this.modalService.open(UpdateModalComponent);
    }

    add() {
        const modalRef = this.modalService.open(SubSectorFormComponent);
        modalRef.componentInstance.model = new SubSector();

        ModalUtils.resolve(modalRef.result, SubSectorComponent.loadData, this);
    }

    edit(subSector: SubSector) {

        const modalRef = this.modalService.open(SubSectorFormComponent);
        modalRef.componentInstance.model = subSector;

        ModalUtils.resolve(modalRef.result, SubSectorComponent.loadData, this);
    }


    onSearchChange(searchValue: string) {
        this.search = {
            'subSectorName': searchValue
        };

        SubSectorComponent.loadData(this);
    }

    onSearch() {
        SubSectorComponent.loadData(this);
    }
}
