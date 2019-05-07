import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Document} from '../../modal/document';

@Component({
    selector: 'app-loan-ui',
    templateUrl: './loan-ui.component.html',
    styleUrls: ['./loan-ui.component.css']
})
export class LoanUiComponent implements OnInit, DoCheck {
    templateList;
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    loanId: number;
    loanConfigApi: string;
    constructor(  private commonService: CommonService,
                  private dataService: CommonDataService) {

    }

    ngDoCheck(): void {

    }
    ngOnInit() {
        this.loanId = this.dataService.getData();
        this.loanConfigApi = 'v1/config/get/'+this.loanId;
        this.commonService.getByAll(this.loanConfigApi).subscribe((response: any) => {
            this.dataService.setInitialDocument(response.detail.initial);
            this.dataService.setRenewDocument(response.detail.renew);
            console.log(response.detail);
            this.templateList = response.detail.templateList;
            console.log('template', this.templateList);
        });

    }

}
