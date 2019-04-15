import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {Pageable} from '../../../../../shared-service/baseservice/common-pageable';

declare var $;

@Component({
    selector: 'app-ui',
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.css']
})
export class UIComponent implements OnInit {
    spinner = false;
    title: string;
    pageable: Pageable = new Pageable();
    search: any = {};
    globalMsg: any;
    loanTemplateList: any;
    comfirmLoanTemplateList = Array<Document>();
    currentApi: any;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService
    ) {

    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/loanTemplate/getAll';
        this.getTemplate();


    }

    getTemplate() {
        this.spinner = true;
        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.loanTemplateList = response.detail;
            this.spinner = false;

        }, error => {
            this.globalMsg = error.error.message;
            if (this.globalMsg == null) {
                this.globalMsg = 'Please check your network connection';
            }
            this.spinner = false;
            this.dataService.getGlobalMsg(this.globalMsg);
            $('.global-msgModal').modal('show');
        });

    }

    updateSelectTemplate(document) {
        const d: Document = document;
        this.comfirmLoanTemplateList.push(d);
        this.loanTemplateList.splice(this.loanTemplateList.indexOf(d), 1);
    }


    updateUnselectTemplate(document) {
        const d: Document = document;
        this.loanTemplateList.push(d);
        this.comfirmLoanTemplateList.splice(this.comfirmLoanTemplateList.indexOf(d), 1);
    }


}
