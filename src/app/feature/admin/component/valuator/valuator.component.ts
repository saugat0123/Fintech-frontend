import {Component, OnInit} from '@angular/core';

import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Valuator} from '../../modal/valuator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValuatorFormComponent} from './valuator-form/valuator-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {ValuatorService} from './valuator.service';
import {PermissionService} from '../../../../@core/service/permission.service';
import {InactiveValuatorCommentComponent} from './inactive-valuator-comment/inactive-valuator-comment.component';

@Component({
    selector: 'app-valuator',
    templateUrl: './valuator.component.html'
})
export class ValuatorComponent implements OnInit {
    title = 'Valuator';
    breadcrumb = 'Valuator > List';

    page = 1;

    dataList: Array<Valuator>;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    activeCount: number;
    inactiveCount: number;
    valuators: number;
    permissions = [];
    addViewValuator = false;
    viewValuator = false;
    editValuator = false;
    csvDownload = false;

    constructor(
        private service: ValuatorService,
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: ValuatorComponent) {

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

        ValuatorComponent.loadData(this);

        this.service.getStatus().subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.valuators = response.detail.valuators;
        });
        this.permissionService.getPermissionOf('VALUATOR').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD VALUATOR') {
                    this.addViewValuator = true;
                }
                if (this.permissions[i].type === 'VIEW VALUATOR') {
                    this.viewValuator = true;
                }
                if (this.permissions[i].type === 'EDIT VALUATOR') {
                    this.editValuator = true;
                }
                if (this.permissions[i].type === 'DOWNLOAD CSV') {
                    ValuatorComponent.loadData(this);
                    this.csvDownload = true;
                }
            }
        });
    }

    changePage(page: number) {
        this.page = page;

        ValuatorComponent.loadData(this);
    }

    add() {
        const modalRef = this.modalService.open(ValuatorFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = new Valuator();

        ModalUtils.resolve(modalRef.result, ValuatorComponent.loadData, this);
    }

    edit(valuator: Valuator) {
        const modalRef = this.modalService.open(ValuatorFormComponent, {size: 'lg'});
        modalRef.componentInstance.model = valuator;

        ModalUtils.resolve(modalRef.result, ValuatorComponent.loadData, this);
    }


    onChange(data, event) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        event.preventDefault();

        const modalRef = this.modalService.open(UpdateModalComponent, {size: 'lg'});
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.service = this.service;
        modalRef.result.then(
            close => {
                ValuatorComponent.loadData(this);
            }, dismissMsg => {
                if (dismissMsg === 'openInactiveComment') {
                    const inactiveCommentModalRef = this.modalService.open(InactiveValuatorCommentComponent, {size: 'lg'});
                    inactiveCommentModalRef.componentInstance.data = data;
                    inactiveCommentModalRef.componentInstance.valuatorService = this.service;
                    inactiveCommentModalRef.result.then(
                        () => {
                            ValuatorComponent.loadData(this);
                        }, () => {
                            ValuatorComponent.loadData(this);
                        }
                    )
                }
              ValuatorComponent.loadData(this);
            }
        );
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        ValuatorComponent.loadData(this);
    }

    onSearch() {

        ValuatorComponent.loadData(this);
    }

  deleteValuator(valuatorId) {
    this.service.delete(valuatorId).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully deleted valuator'));
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to delete valuator'));
    })
  }
}
