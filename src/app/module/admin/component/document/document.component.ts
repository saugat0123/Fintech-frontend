import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {Document} from '../../modal/document';
import {LoanCycle} from '../../modal/loan-cycle';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddDocumentComponent} from './add-document/add-document.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {MsgModalComponent, UpdateModalComponent} from '../../../../@theme/components';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, DoCheck {

    title = 'Document';
    breadcrumb = 'Document > List';
    dataList: Array<Document>;
    loanCycleList: Array<LoanCycle>;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    documents: number;
    newValue: string;


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
        this.modalService.open(AddDocumentComponent);
    }

    addDocument() {
        this.dataService.setDocument(new Document());
        this.modalService.open(AddDocumentComponent);

    }


    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/document');
        this.modalService.open(UpdateModalComponent);

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
        });

    }

}
