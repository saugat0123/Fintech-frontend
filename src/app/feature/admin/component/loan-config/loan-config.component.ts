import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanConfig} from '../../modal/loan-config';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UpdateModalComponent} from '../../../../@theme/components';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {LoanConfigService} from './loan-config.service';
import {Router} from '@angular/router';
import {ProductUtils} from '../../service/product-mode.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';

@Component({
    selector: 'app-loan-config',
    templateUrl: './loan-config.component.html'
})
export class LoanConfigComponent implements OnInit {

    title = 'Loan Configuration';

    page = 1;

    dataList: Array<LoanConfig>;

    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();

    activeCount: number;
    inactiveCount: number;
    loans: number;
    modalTemplate: any;
    tName;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;

    constructor(
        private service: LoanConfigService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private router: Router
    ) {
    }

    static loadData(other: LoanConfigComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObjectD(other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;

                other.pageable = PaginationUtils.getPageable(response.detail);

                other.spinner = false;

            }, error => {

                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data, Please Contact Support!'));
                console.log(error);

                other.spinner = false;
            }
        );

    }

    ngOnInit() {

        this.breadcrumbService.notify(this.title);

        LoanConfigComponent.loadData(this);

        this.service.getStatus().subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.loans = response.detail.loans;

        });
    }

    changePage(page: number) {
        this.page = page;

        LoanConfigComponent.loadData(this);
    }

    onSearch() {
        LoanConfigComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };

        LoanConfigComponent.loadData(this);
    }

    edit(loanConfigId: number) {
        this.router.navigate(['home/admin/configLoan'], {queryParams: {id: loanConfigId}});
    }

    add() {
        this.router.navigate(['home/admin/configLoan']);
    }

    configureRole(loanConfigId: number) {
        this.router.navigate(['home/approval-role-hierarchy', 'LOAN_TYPE', loanConfigId]);
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
                LoanConfigComponent.loadData(this);
            }, dismiss => {
                LoanConfigComponent.loadData(this);
            }
        );
    }

    viewTemplate(e, x) {
        this.modalTemplate = e;
        this.tName = x;
        const div = document.getElementById('tempView');
        div.innerHTML = this.modalTemplate;
    }

}
