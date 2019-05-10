import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../../shared-service/baseservice/common-pagination-service';
import {Pageable} from '../../../../../shared-service/baseservice/common-pageable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MsgModalComponent} from '../../../../../common/msg-modal/msg-modal.component';
import {LoanConfig} from '../../../modal/loan-config';
import {Document} from '../../../modal/document';
import { Router} from '@angular/router';
import {LoanTemplate} from '../../../modal/template';


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
    documentList = Array<Document>();

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private modalService: NgbModal,
        private router: Router
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
            this.globalMsg = error.error.message;
            if (this.globalMsg == null) {
                this.globalMsg = 'Please check your network connection';
            }
            this.spinner = false;
            this.dataService.getGlobalMsg(this.globalMsg);
            this.modalService.open(MsgModalComponent);
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

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.loanConfig.isRenewable = this.renewal;
        this.loanConfig.isFundable = this.fundable;
        this.loanConfig.templateList = this.comfirmLoanTemplateList;
        this.loanConfig.initial = this.initialDocuemnt;
        this.loanConfig.renew = this.renewalDocuemnt;
        console.log(this.loanConfig);
        this.commonService.saveOrEdit(this.loanConfig, 'v1/config').subscribe(result => {

                if (this.loanConfig.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED LOAN CONFIG';
                }
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.loanConfig = new LoanConfig();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/ui']));


            }, error => {


                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/ui']));

            }
        );
    }

}
