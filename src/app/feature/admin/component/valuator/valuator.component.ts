import {Component, DoCheck, OnInit} from '@angular/core';

import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {Valuator} from '../../modal/valuator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ValuatorFormComponent} from './valuator-form/valuator-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';


@Component({
    selector: 'app-valuator',
    templateUrl: './valuator.component.html'
})
export class ValuatorComponent implements OnInit, DoCheck {
    title = 'Valuator';
    breadcrumb = 'Valuator > List';
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

    addValuator() {
        this.dataService.setValuator(new Valuator());
        ModalUtils.resolve(this.modalService.open(ValuatorFormComponent).result, ValuatorComponent.loadData, this);
    }


    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/valuator');

        this.modalService.open(UpdateModalComponent);

    }

    openEdit(valuator: Valuator) {
        this.dataService.setValuator(valuator);
        ModalUtils.resolve(this.modalService.open(ValuatorFormComponent).result, ValuatorComponent.loadData, this);
    }


    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        ValuatorComponent.loadData(this);
    }

    onSearch() {
        this.dataService.setData(this.search);
        ValuatorComponent.loadData(this);
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }
}
