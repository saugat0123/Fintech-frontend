import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Nepse} from '../../modal/nepse';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NepseFormComponent} from './nepse-form/nepse-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-nepse',
    templateUrl: './nepse.component.html'
})
export class NepseComponent implements OnInit, DoCheck {

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
    viewNepse = false;
    addViewNepse = false;

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
        this.currentApi = 'v1/nepseCompany/get';

        NepseComponent.loadData(this);

        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.nepses = response.detail.nepses;

        });

        this.commonService.getByPost('v1/permission/chkPerm', 'Nepse Company').subscribe((response: any) => {
            this.permissions = response.detail;
            for (let i = 0; this.permissions.length > i; i++) {
                if (this.permissions[i].type === 'ADD NEPSE') {
                    this.addViewNepse = true;
                }
                if (this.permissions[i].type === 'VIEW NEPSE') {
                    NepseComponent.loadData(this);
                    this.viewNepse = true;
                }
            }
        });
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    onSearch() {
        this.dataService.setData(this.search);
        NepseComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        NepseComponent.loadData(this);
    }

    addNepse() {
        this.dataService.setNepse(new Nepse());
        ModalUtils.resolve(this.modalService.open(NepseFormComponent).result, NepseComponent.loadData, this);
    }

}
