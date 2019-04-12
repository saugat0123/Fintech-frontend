import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Document} from '../../../../modal/document';
import {LoanCycle} from '../../../../modal/loan-cycle';

declare var $;

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, DoCheck {

    title = 'Document';
    breadcrumb = 'Document > List';
    dataList: any;
    loanCycleList: Array<LoanCycle>;
    spinner: boolean = false;
    globalMsg;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: any;
    activeCount: any;
    inactiveCount: any;
    documents: any;
    newValue: any;
    data: any;


    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService
    ) {
    }

    ngOnInit() {

        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/document/get';
        this.getPagination();

        this.commonService.getByAll(this.currentApi + '/getStatusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.documents = response.detail.documents;
        });
        this.commonService.getByAll('v1/document/lifeCycle').subscribe((response: any) => {

            this.loanCycleList = response.detail;
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

    openEdit(document: Document) {
        this.dataService.setDocument(document);
        $('.add-document').modal('show');
    }

    addDocument() {
        this.dataService.setDocument(new Document());
        $('.add-document').modal('show');
    }

    onChange(newValue, data) {
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/document');
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
        });

    }

}
