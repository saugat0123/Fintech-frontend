import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {Document} from '../../modal/document';
import {LoanCycle} from '../../modal/loan-cycle';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentFormComponent} from './document-form/document-form.component';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {UpdateModalComponent} from '../../../../@theme/components';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {DocumentService} from './document.service';
import {Action} from '../../../../@core/Action';
import {ProductModeService, ProductUtils} from '../../service/product-mode.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {Router} from '@angular/router';

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
    showEligibility = false;

    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;


    constructor(
        private service: DocumentService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private router: Router,
        private productModeService: ProductModeService,
    ) {
    }

    static loadData(other: DocumentComponent) {
        other.spinner = true;
        other.service.getStatus().subscribe((response: any) => {
            other.activeCount = response.detail.active;
            other.inactiveCount = response.detail.inactive;
            other.documents = response.detail.documents;
        });
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
            other.dataList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
        }, error => {
            console.log(error);
            if (error.status === 403) {
                other.router.navigate(['/home/error']);
            }
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Documents'));
        });
        other.service.getAllLoanCycle().subscribe((response: any) => {
            other.loanCycleList = response.detail;
        });
        other.showEligibility = other.productModeService.isProductEnable('ELIGIBILITY');
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        DocumentComponent.loadData(this);
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
        const modalRef = this.modalService.open(DocumentFormComponent);
        modalRef.componentInstance.action = Action.UPDATE;
        modalRef.componentInstance.model = document;
        ModalUtils.resolve(modalRef.result, DocumentComponent.loadData, this);
    }

    addDocument() {
        const modalRef = this.modalService.open(DocumentFormComponent);
        modalRef.componentInstance.action = Action.ADD;
        modalRef.componentInstance.model = new Document();
        ModalUtils.resolve(modalRef.result, DocumentComponent.loadData, this);
    }


    onChange(data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        const modalRef = this.modalService.open(UpdateModalComponent, {size: 'lg'});
        modalRef.componentInstance.data = data;
        modalRef.componentInstance.service = this.service;
        modalRef.result.then(
            close => {
                DocumentComponent.loadData(this);
            }, dismiss => {
                DocumentComponent.loadData(this);
            }
        );
    }
}

