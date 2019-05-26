import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {Sector} from '../../../modal/sector';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SectorFormComponent} from './sector-form/sector-form.component';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {SectorService} from './SectorService';
import {PermissionService} from '../../../../../@core/service/permission.service';

@Component({
    selector: 'app-sector',
    templateUrl: './sector.component.html'
})
export class SectorComponent implements OnInit {

    page = 1;

    title = 'Sector';
    breadcrumb = 'Sector > List';
    dataList: Array<Sector>;
    newValue: string;
    spinner = false;
    search: any = {};
    pageable: Pageable = new Pageable();
    activeCount: number;
    inactiveCount: number;
    sectors: number;
    permissions = [];
    addViewSector = false;
    viewSector = false;
    editSector = false;
    csvDownload = false;

    constructor(
        private service: SectorService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private toastService: ToastService) {
    }

    static loadData(other: SectorComponent) {
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
        SectorComponent.loadData(this);

        this.service.getStatus().subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.sectors = response.detail.sectors;
        });
        this.permissionService.getPermissionOf('SECTOR').subscribe((response: any) => {
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

    changePage(page: number) {
        this.page = page;

        SectorComponent.loadData(this);
    }


    add() {
        const modalRef = this.modalService.open(SectorFormComponent);
        modalRef.componentInstance.model = new Sector();

        ModalUtils.resolve(modalRef.result, SectorComponent.loadData, this);
    }

    edit(sector: Sector) {
        const modalRef = this.modalService.open(SectorFormComponent);
        modalRef.componentInstance.model = sector;

        ModalUtils.resolve(modalRef.result, SectorComponent.loadData, this);
    }


    onChange(newValue, data) {

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        event.preventDefault();
        this.newValue = newValue;
        this.modalService.open(UpdateModalComponent);
    }


    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        SectorComponent.loadData(this);
    }

    onSearch() {
        SectorComponent.loadData(this);
    }
}
