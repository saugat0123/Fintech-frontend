import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {Document} from '../../../../admin/modal/document';
import {User} from '../../../../admin/modal/user';
import {Security} from '../../../../admin/modal/security';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {ActivatedRoute} from '@angular/router';
import {LoanDocument} from '../../../../admin/modal/loan-document';
import {forEach} from '@angular/router/src/utils/collection';
import {of} from 'rxjs';

@Component({
    selector: 'app-dms-summary',
    templateUrl: './dms-summary.component.html',
    styleUrls: ['./dms-summary.component.css']
})
export class DmsSummaryComponent implements OnInit {
    dmsLoanFile: DmsLoanFile = new DmsLoanFile();
    loan: LoanConfig = new LoanConfig();
    loanType: string;
    index = 0;
    user: User = new User();
    security: string;
    securities: any = [];
    Security: typeof Security = Security;
    documents: [] = [];
    documentPaths: string[] = [];
    documentUrl: string;
    documentName=[];
    id: number;
    keys:any;
    constructor(private dataService: CommonDataService,
                private commonService: CommonService,
                private router: ActivatedRoute) {
    }

    ngOnInit() {
        this.id = this.router.snapshot.params['id'];
        console.log(this.id);
        this.commonService.getById('v1/dmsLoanFile/getById/' + this.id).subscribe(
            (response: any) => {
                console.log('from summary', response.detail);
                this.dmsLoanFile = response.detail;
                this.security = this.dmsLoanFile.security;
                this.securities = this.security.split(',');
                this.user = this.dataService.getUser();
                this.documents = this.dmsLoanFile.documentPathDocument;
                console.log(this.documents);
                // console.log(this.documents);
                // for(let document of this.documents){
                //     console.log(Object.keys(document));
                //     this.documentName.push(Object.keys(document));
                //     console.log(Object.values(document));
                //     console.log(this.documentName);
                // }
            }
        );

    }

    download(i) {
        // console.log(this.documentPath[2]);
        // console.log(i);
        this.documentUrl = this.documentPaths[i];
        // console.log(this.documentUrl);
        this.commonService.getByPost('v1/dmsLoanFile/download', this.documentUrl).subscribe(
            (response: any) => {
                console.log(response.detail);
            }
        );

    }
}
