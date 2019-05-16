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
    documentUrls = [];
    documentUrl: string;
    documentNames = [];
    documentName: string;
    id: number;

    constructor(private dataService: CommonDataService,
                private commonService: CommonService,
                private router: ActivatedRoute) {

    }

    ngOnInit() {
        this.id = this.router.snapshot.params['id'];
        this.commonService.getById('v1/dmsLoanFile/getById/' + this.id).subscribe(
            (response: any) => {
                this.dmsLoanFile = response.detail;
                this.security = this.dmsLoanFile.security;
                this.securities = this.security.split(',');
                this.user = this.dataService.getUser();
                this.documents = this.dmsLoanFile.documentPathMaps;
                for (const document of this.documents) {
                    this.documentNames.push(Object.keys(document));
                    this.documentUrls.push(Object.values(document));
                }
            }
        );
    }

    download(i) {
        this.documentUrl = this.documentUrls[i];
        this.documentName = this.documentNames[i];
        this.commonService.getByPath('v1/dmsLoanFile/download', this.documentUrl).subscribe(
            (response: any) => {
                const newBlob = new Blob([response], {type: 'application/txt'});
                const downloadUrl = window.URL.createObjectURL(response);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = this.documentName + '.jpg';
                link.click();
            },
            error1 => {
                console.log('Error downloading the file');
            }
        );
    }
}

