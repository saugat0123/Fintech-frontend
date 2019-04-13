import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {LoanConfig} from '../../modal/loan-config';

declare var $;

@Component({
    selector: 'app-loan-config',
    templateUrl: './loan-config.component.html',
    styleUrls: ['./loan-config.component.css']
})
export class LoanConfigComponent implements OnInit, DoCheck {

    title = 'Loan Configuration';

    dataList: Array<LoanConfig>;

    newValue: any;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    loans: number;
    modalTemplate: any;
    tName;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService
    ) {
    }

    ngOnInit() {

        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/config/get';
        this.getPagination();
        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.loans = response.detail.loans;

        });


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

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(loanConfig: any) {
        this.dataService.setData(loanConfig);
        $('.add-loan-config').modal('show');
    }

    addLoanConfig() {

        this.dataService.setData(new LoanConfig());
        $('.add-loan-config').modal('show');
    }


    onChange(newValue, data) {
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/config');
        $('.updateStatus').modal('show');

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
                $('.global-msgModal').modal('show');
            }
        );

    }

    viewTemplate(e, x) {
        this.modalTemplate = e;
        this.tName = x;
        const div = document.getElementById('tempView');
        div.innerHTML = this.modalTemplate;
        $('.view-template').modal('show');
    }

}
