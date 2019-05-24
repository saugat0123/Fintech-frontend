import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../@core/service/baseservice/common-pagination-service';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfig} from '../../../modal/loan-config';
import {Document} from '../../../modal/document';
import {Router} from '@angular/router';
import {LoanTemplate} from '../../../modal/template';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


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
    comfirmLoanTemplateList = Array<LoanTemplate>();
    currentApi: any;
    loanConfig: LoanConfig = new LoanConfig();
    fundable: boolean;
    renewal: boolean;
    show = false;
    submitted: boolean;
    initialDocuemnt = Array<Document>();
    renewalDocuemnt = Array<Document>();
    eligibilityDocuments = Array<Document>();
    documentList = Array<Document>();

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private router: Router,
        private toastService: ToastService
    ) {

    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
        this.currentApi = 'v1/loanTemplate/getAll';
        this.getTemplate();
        this.commonService.getByAll('v1/document/getAll').subscribe((response: any) => {
            this.documentList = response.detail;
        });


    }

    getTemplate() {
        this.spinner = true;
        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.loanTemplateList = response.detail;
            this.spinner = false;

        }, error => {

            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Templates'));

            this.spinner = false;
        });

    }

    updateSelectTemplate(template) {
        const t: LoanTemplate = template;
        this.comfirmLoanTemplateList.push(t);
        this.loanTemplateList.splice(this.loanTemplateList.indexOf(t), 1);
    }


    updateUnselectTemplate(template) {
        const t: LoanTemplate = template;
        this.loanTemplateList.push(t);
        this.comfirmLoanTemplateList.splice(this.comfirmLoanTemplateList.indexOf(t), 1);
    }

    setFunableTrue() {
        this.fundable = true;
        console.log(this.fundable);
    }

    setFunableFalse() {
        this.fundable = false;
        console.log(this.fundable);
    }

    setRenewalTrue() {
        this.renewal = true;
        console.log(this.renewal);
    }

    setRenewalFalse() {
        this.renewal = false;
        console.log(this.renewal);
    }

    toggle() {
        this.show = !this.show;
    }

    updateInitialDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.initialDocuemnt.push(d);
            console.log(this.initialDocuemnt);
        } else {
            const index: number = this.initialDocuemnt.indexOf(d);
            if (index !== -1) {
                this.initialDocuemnt.splice(index, 1);
                console.log(this.initialDocuemnt);
            }
        }
    }

    updateRenewalDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.renewalDocuemnt.push(d);
            console.log(this.renewalDocuemnt);
        } else {
            const index: number = this.renewalDocuemnt.indexOf(d);
            if (index !== -1) {
                this.renewalDocuemnt.splice(index, 1);
                console.log(this.renewalDocuemnt);
            }
        }
    }

    updateEligibilityDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.eligibilityDocuments.push(d);
            console.log(this.eligibilityDocuments);
        } else {
            const index: number = this.eligibilityDocuments.indexOf(d);
            if (index !== -1) {
                this.eligibilityDocuments.splice(index, 1);
                console.log(this.eligibilityDocuments);
            }
        }
    }

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.loanConfig.isRenewable = this.renewal;
        this.loanConfig.isFundable = this.fundable;
        this.loanConfig.templateList = this.comfirmLoanTemplateList;
        this.loanConfig.initial = this.initialDocuemnt;
        this.loanConfig.renew = this.renewalDocuemnt;
        this.loanConfig.eligibilityDocuments = this.eligibilityDocuments;
        console.log(this.loanConfig);
        this.commonService.saveOrEdit(this.loanConfig, 'v1/config').subscribe(result => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Config!'));

                this.loanConfig = new LoanConfig();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/configLoan']));


            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Loan Config!'));

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/configLoan']));

            }
        );
    }

}
