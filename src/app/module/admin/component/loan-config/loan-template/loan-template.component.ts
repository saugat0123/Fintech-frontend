import {Component, DoCheck, OnInit} from '@angular/core';
import {Pageable} from '../../../../../shared-service/baseservice/common-pageable';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {LoanTemplate} from '../../../modal/template';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MsgModalComponent} from '../../../../../common/msg-modal/msg-modal.component';
import {TemplateAddModelComponent} from './template-add-model/template-add-model.component';
import {UpdateModalComponent} from '../../../../../common/update-modal/update-modal.component';

declare var $;

@Component({
    selector: 'app-loan-template',
    templateUrl: './loan-template.component.html',
    styleUrls: ['./loan-template.component.css']
})
export class LoanTemplateComponent implements OnInit, DoCheck {
    test = 'app-basic-info';
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
        private modalService: NgbModal
    ) {
    }


    ngOnInit() {

        this.dataService.changeTitle(this.title);
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
                this.globalMsg = error.error.message;
                if (this.globalMsg == null) {
                    this.globalMsg = 'Please check your network connection';
                }
                this.spinner = false;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.modalService.open(MsgModalComponent);
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
        if (document.activeElement instanceof HTMLElement) { document.activeElement.blur(); }
        event.preventDefault();
        this.dataService.setData(data);
        this.commonPageService.setCurrentApi('v1/loanTemplate');
        this.modalService.open(UpdateModalComponent);

    }


}
