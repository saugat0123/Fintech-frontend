import {Component, OnInit} from '@angular/core';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {User} from '../../../../admin/modal/user';
import {Security} from '../../../../admin/modal/security';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../../@core/service/user.service';
import {DmsLoanService} from '../dms-loan-file/dms-loan-service';

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
    loanConfigId: number;

    constructor(private userService: UserService,
                private router: ActivatedRoute,
                private dmsLoanService: DmsLoanService,
                private route: Router) {

    }

    ngOnInit() {
        this.id = this.router.snapshot.params['id'];
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
        this.dmsLoanService.detail(this.id).subscribe(
            (response: any) => {
                this.dmsLoanFile = response.detail;
                this.loanConfigId = response.detail.loanConfig.id;
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
        this.dmsLoanService.downloadDocument(this.documentUrl).subscribe(
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

    onEdit() {
        this.route.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanConfigId, customerId: this.id}});
    }
}

