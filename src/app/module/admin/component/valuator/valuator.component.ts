import {Component, DoCheck, OnInit} from '@angular/core';

import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Valuator} from '../../modal/valuator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddValuatorComponent} from './add-valuator/add-valuator.component';
import {UpdateModalComponent} from '../../../../common/update-modal/update-modal.component';
import {MsgModalComponent} from '../../../../common/msg-modal/msg-modal.component';


@Component({
    selector: 'app-valuator',
    templateUrl: './valuator.component.html',
    styleUrls: ['./valuator.component.css']
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


    constructor(private dataService: CommonDataService,
                private commonService: CommonService,
                private commonPageService: CommonPageService,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/valuator/get';
        this.getPagination();

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.valuators = response.detail.valuators;
        });
    }

    getPagination() {

        this.spinner = true;
        this.commonService.getByPostAllPageable(this.currentApi, this.search, 1, 10).subscribe((response: any) => {
                this.dataList = response.detail.content;
                this.dataService.setDataList(this.dataList);
                this.commonPageService.setCurrentApi(this.currentApi);
                this.pageable = this.commonPageService.setPageable(response.detail);

                this.spinner = false;

            }, error => {
                this.globalMsg = error.error.message;
                if (this.globalMsg == null) {
                    this.globalMsg = 'Please check your network connection';
                }
                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.modalService.open(MsgModalComponent);

            }
        );
    }

    addValuator() {
        this.dataService.setValuator(new Valuator());
        this.modalService.open(AddValuatorComponent);
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
        this.modalService.open(AddValuatorComponent);
    }


    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        this.getPagination();
    }

    onSearch() {
        this.dataService.setData(this.search);
        this.getPagination();
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }
}
