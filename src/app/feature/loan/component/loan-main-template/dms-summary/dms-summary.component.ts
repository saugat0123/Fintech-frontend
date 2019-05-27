import {Component, OnInit} from '@angular/core';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {User} from '../../../../admin/modal/user';
import {Security} from '../../../../admin/modal/security';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {ActivatedRoute} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {UserService} from '../../../../../@core/service/user.service';

@Component({
    selector: 'app-dms-summary',
    templateUrl: './dms-summary.component.html',
    styleUrls: ['./dms-summary.component.css']
})
export class DmsSummaryComponent implements OnInit {
    dmsLoanFile: DmsLoanFile = new DmsLoanFile();
    loan: LoanConfig = new LoanConfig();
    loanConfig: string;
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
                private userService: UserService,
                private router: ActivatedRoute) {

    }

    ngOnInit() {
        this.id = this.router.snapshot.params['id'];
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
        this.commonService.getById('v1/dmsLoanFile/getById/' + this.id).subscribe(
            (response: any) => {
                this.dmsLoanFile = response.detail;
                console.log('dms',this.dmsLoanFile);
                this.security = this.dmsLoanFile.security;
                this.securities = this.security.split(',');
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
                console.log(error1);
                console.log('Error downloading the file');
            }
        );
    }
}

