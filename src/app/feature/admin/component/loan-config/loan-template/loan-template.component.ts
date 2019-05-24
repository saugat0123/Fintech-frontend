import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {LoanTemplate} from '../../../modal/template';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UpdateModalComponent} from '../../../../../@theme/components';
import {TemplateAddModelComponent} from './template-add-model/template-add-model.component';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {ModalUtils, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-loan-template',
    templateUrl: './loan-template.component.html'
})
export class LoanTemplateComponent implements OnInit, DoCheck {
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


    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
    }

    addTemplate() {
        this.dataService.setData(new LoanTemplate());

        ModalUtils.resolve(this.modalService.open(TemplateAddModelComponent).result, LoanTemplateComponent.loadData, this);
    }

    openEdit(loanTemplate: LoanTemplate) {
        this.dataService.setData(loanTemplate);
        ModalUtils.resolve(this.modalService.open(TemplateAddModelComponent).result, LoanTemplateComponent.loadData, this);
    }

    onChange(newValue, data) {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        event.preventDefault();
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/loanTemplate');
        this.modalService.open(UpdateModalComponent);

    }


}
