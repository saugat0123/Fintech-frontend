import {Component, OnInit} from '@angular/core';

import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {Valuator} from '../../modal/valuator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValuatorFormComponent} from './valuator-form/valuator-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';


@Component({
    selector: 'app-valuator',
    templateUrl: './valuator.component.html'
})
export class ValuatorComponent implements OnInit {
    title = 'Valuator';
    breadcrumb = 'Valuator > List';

    page = 1;

    dataList: Array<Valuator>;
    newValue: string;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    valuators: number;
    permissions = [];
    addViewValuator = false;
    viewValuator = false;
    editValuator = false;
    csvDownload = false;

    constructor(
        private commonService: CommonService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: ValuatorComponent) {

        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, other.page, 10).subscribe((response: any) => {
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
        this.currentApi = 'v1/valuator/get';

        ValuatorComponent.loadData(this);

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.valuators = response.detail.valuators;
        });
        this.commonService.getByPost('v1/permission/chkPerm', 'VALUATOR').subscribe((response: any) => {
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
        const modalRef = this.modalService.open(ValuatorFormComponent);
        modalRef.componentInstance.model = new Valuator();

        ModalUtils.resolve(modalRef.result, ValuatorComponent.loadData, this);
    }

    edit(valuator: Valuator) {
        const modalRef = this.modalService.open(ValuatorFormComponent);
        modalRef.componentInstance.model = valuator;

        ModalUtils.resolve(modalRef.result, ValuatorComponent.loadData, this);
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

        ValuatorComponent.loadData(this);
    }

    onSearch() {

        ValuatorComponent.loadData(this);
    }

}
