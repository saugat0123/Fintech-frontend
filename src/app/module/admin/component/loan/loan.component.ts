import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {ActivatedRoute} from '@angular/router';
import {LoanConfig} from '../../modal/loan-config';
import {Document} from '../../modal/document';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';

    @Component({
    selector: 'app-client-service',
    templateUrl: './loan.component.html',
    styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
    loanType: string;
    loanList: LoanConfig[] = [];
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    initialDocument: Document = new Document();
    renewDocument: Document = new Document();

    loan: LoanConfig = new LoanConfig();
    permissions = [];


    constructor(private commonService: CommonService,
                private dataService: CommonDataService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.initialDocuments = this.dataService.getInitialDocument();
        this.renewDocuments = this.dataService.getRenewDocument();


    }
    documentUploader(event, name:string, cycle:string){
        const file = event.target.files[0];
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        formdata.append('type', name);
        formdata.append('cycle', cycle);
        this.commonService.getByFilePost('v1/config/uploadFile', formdata).subscribe(
            (result:any) =>{
                this.renewDocument = result.detail;
            }
        );
    }

}
