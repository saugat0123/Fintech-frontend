import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Nepse} from '../../modal/nepse';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NepseFormComponent} from './nepse-form/nepse-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {NepseService} from './nepse.service';
import {PermissionService} from '../../../../@core/service/permission.service';
import {Status} from '../../../../@core/Status';

@Component({
    selector: 'app-nepse',
    templateUrl: './nepse.component.html'
})
export class NepseComponent implements OnInit {

    page = 1;

    title = 'Nepse';
    breadcrumb = 'Nepse > List';
    dataList: Array<Nepse>;

    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    nepses: number;
    permissions = [];
    status = Status;

    constructor(
        private service: NepseService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: NepseComponent) {

        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;

            }, error => {

                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data'));
                other.spinner = false;
            }
        );

    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/nepseCompany/get';

        NepseComponent.loadData(this);

        this.service.getStatus().subscribe((response: any) => {
            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.nepses = response.detail.nepses;

        });
    }

    changePage(page: number) {
        this.page = page;

        NepseComponent.loadData(this);
    }

    onSearch() {
        NepseComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue,
        };

        NepseComponent.loadData(this);
    }

    add() {
        const modalRef = this.modalService.open(NepseFormComponent);
        modalRef.componentInstance.model = new Nepse();
        ModalUtils.resolve(modalRef.result, NepseComponent.loadData, this);
    }
}
