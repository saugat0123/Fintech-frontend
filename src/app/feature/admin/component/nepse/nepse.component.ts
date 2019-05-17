import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Nepse} from '../../modal/nepse';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddNepseComponent} from './add-nepse/add-nepse.component';
import {MsgModalComponent} from '../../../../@theme/components';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';

@Component({
    selector: 'app-nepse',
    templateUrl: './nepse.component.html',
    styleUrls: ['./nepse.component.css']
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
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/nepseCompany/get';
        this.getPagination();
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
                    this.getPagination();
                    this.viewNepse = true;
                }
            }
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

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    onSearch() {
        this.dataService.setData(this.search);
        this.getPagination();
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        this.getPagination();
    }

    addNepse() {
        this.dataService.setNepse(new Nepse());
        this.modalService.open(AddNepseComponent);
    }

}
