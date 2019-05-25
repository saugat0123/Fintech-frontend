import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {LoanTemplate} from '../../../modal/template';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {TemplateAddModelComponent} from './template-add-model/template-add-model.component';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';


@Component({
    selector: 'app-loan-template',
    templateUrl: './loan-template.component.html'
})
export class LoanTemplateComponent implements OnInit {

    page = 1;

    title = 'Template';
    spinner = false;
    globalMsg: string;
    search: any = {};
    pageable: Pageable = new Pageable();
    currentApi: string;
    activeCount: number;
    inactiveCount: number;
    dataList: Array<LoanTemplate>;


    constructor(
        private commonService: CommonService,
        private modalService: NgbModal,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: LoanTemplateComponent) {
        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, other.page, 10).subscribe((response: any) => {
                other.dataList = response.detail.content;

                other.pageable = PaginationUtils.getPageable(response.detail);

                other.spinner = false;

            }, error => {

                console.log(error);

                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data'));
            }
        );
    }


    ngOnInit() {

        this.breadcrumbService.notify(this.title);

        this.currentApi = 'v1/loanTemplate/get';

        LoanTemplateComponent.loadData(this);

    }

    changePage(page: number) {
        this.page = page;

        LoanTemplateComponent.loadData(this);
    }

    add() {

        const modelRef = this.modalService.open(TemplateAddModelComponent);
        modelRef.componentInstance.model = new LoanTemplate();

        ModalUtils.resolve(this.modalService.open(TemplateAddModelComponent).result, LoanTemplateComponent.loadData, this);
    }

    edit(loanTemplate: LoanTemplate) {
        const modelRef = this.modalService.open(TemplateAddModelComponent);
        modelRef.componentInstance.model = loanTemplate;

        ModalUtils.resolve(modelRef.result, LoanTemplateComponent.loadData, this);
    }

    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        event.preventDefault();

        this.modalService.open(UpdateModalComponent);
    }
}
