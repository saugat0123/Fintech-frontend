import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Document} from '../../modal/document';
import {LoanCycle} from '../../modal/loan-cycle';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddDocumentComponent} from './add-document/add-document.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {DocumentService} from './document.service';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html'
})
export class DocumentComponent implements OnInit {

    page = 1;

    title = 'Document';
    breadcrumb = 'Document > List';
    dataList: Array<Document>;
    loanCycleList: Array<LoanCycle> = new Array<LoanCycle>();
    spinner = false;

    search: any = {};
    pageable: Pageable = new Pageable();
    activeCount: number;
    inactiveCount: number;
    documents: number;
    newValue: string;


    constructor(
        private service: DocumentService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: DocumentComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
            other.dataList = response.detail.content;

            other.pageable = PaginationUtils.getPageable(response.detail);

            other.spinner = false;

        }, error => {

            console.log(error);

            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Documents'));
        });

    }

    ngOnInit() {

        this.breadcrumbService.notify(this.title);
        DocumentComponent.loadData(this);

        this.service.getStatus().subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.documents = response.detail.documents;
        });

        this.service.getAllLoanCycle().subscribe((response: any) => {

            this.loanCycleList = response.detail;
        });
    }

    changePage(page: number) {
        this.page = page;

        DocumentComponent.loadData(this);
    }

    onSearch() {
        DocumentComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        DocumentComponent.loadData(this);
    }

    openEdit(document: Document) {
        const modalRef = this.modalService.open(AddDocumentComponent);
        modalRef.componentInstance.model = document;

        ModalUtils.resolve(modalRef.result, DocumentComponent.loadData, this);
    }

    addDocument() {
        const modalRef = this.modalService.open(AddDocumentComponent);
        modalRef.componentInstance.model = new Document();

        ModalUtils.resolve(modalRef.result, DocumentComponent.loadData, this);
    }


    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.newValue = newValue;
        this.modalService.open(UpdateModalComponent);
    }
}

