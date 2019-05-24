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
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-loan-template',
    templateUrl: './loan-template.component.html',
    styleUrls: ['./loan-template.component.css']
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


    ngOnInit() {

        this.breadcrumbService.notify(this.title);

        this.currentApi = 'v1/loanTemplate/get';
        this.getPagination();

    }


    ngDoCheck(): void {
        this.dataList = this.dataService.getDataList();
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

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data'));
            }
        );

    }

    addTemplate() {
        this.dataService.setData(new LoanTemplate());

        this.modalService.open(TemplateAddModelComponent);
    }

    openEdit(loanTemplate: LoanTemplate) {
        this.dataService.setData(loanTemplate);
        this.modalService.open(TemplateAddModelComponent);
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
