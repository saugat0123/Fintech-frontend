import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanConfig} from '../../modal/loan-config';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddLoanComponent} from './add-loan/add-loan.component';
import {UpdateModalComponent} from '../../../../@theme/components';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {LoanConfigService} from './loan-config.service';

@Component({
    selector: 'app-loan-config',
    templateUrl: './loan-config.component.html'
})
export class LoanConfigComponent implements OnInit {

    title = 'Loan Configuration';

    page = 1;

    dataList: Array<LoanConfig>;

    newValue: any;
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();

    activeCount: number;
    inactiveCount: number;
    loans: number;
    modalTemplate: any;
    tName;

    constructor(
        private service: LoanConfigService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: LoanConfigComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
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

    edit(loanConfig: any) {

        const modalRef = this.modalService.open(AddLoanComponent);
        modalRef.componentInstance.model = loanConfig;

        ModalUtils.resolve(modalRef.result, LoanConfigComponent.loadData, this);
    }

    add() {
        const modalRef = this.modalService.open(AddLoanComponent);
        modalRef.componentInstance.model = new LoanConfig();

        ModalUtils.resolve(modalRef.result, LoanConfigComponent.loadData, this);
    }


    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.newValue = newValue;
        this.modalService.open(UpdateModalComponent);

    }

    viewTemplate(e, x) {
        this.modalTemplate = e;
        this.tName = x;
        const div = document.getElementById('tempView');
        div.innerHTML = this.modalTemplate;
    }

}
