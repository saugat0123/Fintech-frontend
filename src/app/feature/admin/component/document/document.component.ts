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
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html'
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
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: any) {
        console.log('from static method', other);
        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, 1, 5).subscribe((response: any) => {
            other.dataList = response.detail.content;
            other.dataService.setDataList(other.dataList);
            other.commonPageService.setCurrentApi(other.currentApi);
            other.pageable = other.commonPageService.setPageable(response.detail);
            other.spinner = false;

        }, error => {
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Documents'));
        });

    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/document/get';
        DocumentComponent.loadData(this);

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
        DocumentComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        DocumentComponent.loadData(this);
    }


    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(document: Document) {
        this.dataService.setDocument(document);
        ModalUtils.resolve(this.modalService.open(AddDocumentComponent).result, DocumentComponent.loadData, this);
    }

    addDocument() {
        this.dataService.setDocument(new Document());
        ModalUtils.resolve(this.modalService.open(AddDocumentComponent).result, DocumentComponent.loadData, this);

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

}
