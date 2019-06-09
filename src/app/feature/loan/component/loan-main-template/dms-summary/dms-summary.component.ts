import {Component, OnInit} from '@angular/core';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {User} from '../../../../admin/modal/user';
import {Security} from '../../../../admin/modal/security';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../../../../@core/service/user.service';
import {DmsLoanService} from '../dms-loan-file/dms-loan-service';
import {LoanDataHolder} from '../../../model/loanData';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';

@Component({
    selector: 'app-dms-summary',
    templateUrl: './dms-summary.component.html',
    styleUrls: ['./dms-summary.component.css']
})
export class DmsSummaryComponent implements OnInit {
    dmsLoanFile: DmsLoanFile = new DmsLoanFile();
    loanConfig: LoanConfig = new LoanConfig();
    loan: string;
    index = 0;
    user: User = new User();
    security: string;
    securities: any = [];
    Security: typeof Security = Security;
    documents: [] = [];
    documentUrls = [];
    documentUrl: string;
    documentNames = [];
    documentName: string;
    document: string;
    documentNamesSplit: string[] = [];
    id: number;
    loanData: any;
    customerInfo: any;
    loanDataHolder: LoanDataHolder = new LoanDataHolder();
    allId;
    customerId;
    loanConfigId;

    constructor(private userService: UserService,
                private router: ActivatedRoute,
                private loanFormService: LoanFormService,
                private dmsLoanService: DmsLoanService,
                private activatedRoute: ActivatedRoute,
                private loanConfigService: LoanConfigService) {

    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanConfigId: null,
                    customerId: null
                };
                this.allId = paramsValue;
                this.customerId = this.allId.customerId;
                this.loanConfigId = this.allId.loanConfigId;
            });
        this.id = this.router.snapshot.params['id'];
        this.loanConfigService.detail(this.loanConfigId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
            }
        );
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
        this.loanFormService.detail(this.customerId).subscribe(
            (response: any) => {
                this.loanDataHolder = response.detail;
                this.id = this.loanDataHolder.id;
                this.dmsLoanFile = this.loanDataHolder.dmsLoanFile;
                if (this.dmsLoanFile != null) {
                    this.security = this.dmsLoanFile.security;
                    this.securities = this.security.split(',');
                    this.documents = JSON.parse(this.dmsLoanFile.documentPath);
                    for (this.document of this.documents) {
                        this.documentNamesSplit = this.document.split(':');
                        this.documentNames.push(this.documentNamesSplit[0]);
                        this.documentUrls.push(this.documentNamesSplit[1]);
                    }
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
}

