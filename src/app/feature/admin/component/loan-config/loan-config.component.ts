import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../@core/service/baseservice/common-pagination-service';
import {LoanConfig} from '../../modal/loan-config';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddLoanComponent} from './add-loan/add-loan.component';
import {UpdateModalComponent} from '../../../../@theme/components';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
    selector: 'app-loan-config',
    templateUrl: './loan-config.component.html'
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
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: any) {
        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, 1, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;
                other.dataService.setDataList(other.dataList);
                other.commonPageService.setCurrentApi(other.currentApi);
                other.pageable = other.commonPageService.setPageable(response.detail);

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

        this.currentApi = 'v1/config/get';
        LoanConfigComponent.loadData(this);
        this.commonService.getByAll(this.currentApi + '/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.loans = response.detail.loans;

        });


    }

    onSearch() {
        this.dataService.setData(this.search);
        LoanConfigComponent.loadData(this);
    }

    onSearchChange(searchValue: string) {
        this.search = {
            'name': searchValue
        };
        this.dataService.setData(this.search);
        LoanConfigComponent.loadData(this);
    }

    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    openEdit(loanConfig: any) {
        this.dataService.setData(loanConfig);
        ModalUtils.resolve(this.modalService.open(AddLoanComponent).result, LoanConfigComponent.loadData, this);
    }

    addLoanConfig() {

        this.dataService.setData(new Object);
        ModalUtils.resolve(this.modalService.open(AddLoanComponent).result, LoanConfigComponent.loadData, this);
    }


    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.newValue = newValue;
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/config');
        this.modalService.open(UpdateModalComponent);

    }

    viewTemplate(e, x) {
        this.modalTemplate = e;
        this.tName = x;
        const div = document.getElementById('tempView');
        div.innerHTML = this.modalTemplate;
    }

}
