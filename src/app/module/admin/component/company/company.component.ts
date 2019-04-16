import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Company} from '../../modal/company';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddCompanyComponent} from './add-company/add-company.component';
import {MsgModalComponent} from '../../../../common/msg-modal/msg-modal.component';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, DoCheck {

    title = 'Company';
    breadcrumb = 'Company > List';
    dataList: Array<Company>;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    companys: number;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService : NgbModal
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/company/get';
        this.getPagination();
        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.companys = response.detail.companys;

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

    addCompany() {
        this.dataService.setCompany(new Company());
        this.modalService.open(AddCompanyComponent);
    }

    openEdit(company: Company) {
        this.dataService.setCompany(company);
        this.modalService.open(AddCompanyComponent);
    }

}
