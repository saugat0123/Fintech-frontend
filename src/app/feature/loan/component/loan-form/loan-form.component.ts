import {Component, OnInit} from '@angular/core';
import {LoanDataService} from '../../service/loan-data.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanDataHolder} from '../../model/loanData';
import {CommonDataService} from '../../../../@core/service/baseservice/common-dataService';
import {MsgModalComponent} from '../../../../@theme/components';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';

import {DmsLoanService} from '../loan-main-template/dms-loan-file/dms-loan-service';
import {DmsLoanFile} from '../../../admin/modal/dms-loan-file';
import {LoanFormService} from './service/loan-form.service';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanChildService} from './service/child.service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-loan-form',
    templateUrl: './loan-form.component.html',
    styleUrls: ['./loan-form.component.css'],
})
export class LoanFormComponent extends LoanChildService implements OnInit {

    loanFile: DmsLoanFile;
    loanTitle: string;

    customerLoanId: number;
    templateList = [{
        active: false,
        name: null,
        templateUrl: null
    }];
    customerId: number;
    id;
    selectedTab;
    nxtTab;
    previousTab;
    currentTab = {
        tabIndex: null,
        tabName: null
    };
    first = false;
    last = false;
    allId;
    nxtParameter = {
        url: null,
        name: null,
        index: null
    };
    previousParameter = {
        url: null,
        name: null,
        index: null
    };


    loan: LoanConfig = new LoanConfig();
    currentNepDate;
    submitEnable = false;

    constructor(
        private dataService: CommonDataService,
        private loanDataService: LoanDataService,
        private dmsLoanService: DmsLoanService,
        private loanFormService: LoanFormService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private datePipe: DatePipe
    ) {
        super();
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanId: null,
                    customerId: null
                };

                this.allId = paramsValue;
                this.id = this.allId.loanId;
                this.loan.id = this.id;
                // this.loanDataService.setLoan(this.loan);
                this.customerId = this.allId.customerId;
                if (this.customerId !== undefined) {
                    this.loanFormService.detail(this.customerId).subscribe(
                        (response: any) => {
                            this.loanFile = response.detail.dmsLoanFile;
                            console.log('asd', this.loanFile);
                            // this.loanDataService.setLoanDocuments(response.detail);
                            this.loanDocument.customerInfo = response.detail.customerInfo;
                            console.log('this.loan file document', this.loanDocument.customerInfo);
                        }
                    );
                } else {
                    this.loanDocument = new LoanDataHolder();
                    this.loanFile = new DmsLoanFile();
                }
            });

        this.loanFormService.getCurrentNepaliDate().subscribe((response: any) => {
            this.currentNepDate = response.detail.nepDateFormat;
        });

        this.populateTemplate();


    }


    populateTemplate() {
        this.loanFormService.getTemplates(this.id).subscribe((response: any) => {
            this.templateList = response.detail.templateList;
            this.loanTitle = response.detail.name;
            this.breadcrumbService.notify(response.detail.name);
            for (let i = 0; i < this.templateList.length; i++) {
                this.templateList[i].active = false;
            }
            if (this.templateList.length > 0) {
                this.templateList[0].active = true;
                this.selectTab(0, this.templateList[0].name);
                this.currentTab.tabName = this.templateList[0].name;
                this.selectedTab = this.templateList[0].name;
                this.first = true;
            }
            if (this.templateList.length === 0) {
                this.router.navigate(['/home/dashboard']);
                this.dataService.getGlobalMsg('NO FORM ARE AVAILABLE');
                this.modalService.open(MsgModalComponent);

            }
        });
    }

    selectTab(index, name) {
        for (let i = 0; i < this.templateList.length; i++) {
            this.templateList[i].active = false;
        }
        this.templateList[index].active = true;
        this.selectedTab = name;
        if (index !== 0) {
            this.loanDataService.setPrevious(index - 1, this.templateList[index - 1].templateUrl, this.templateList[index - 1].name);
            this.previousTab = this.templateList[index - 1].templateUrl;
            this.first = false;
        } else {
            this.first = true;

        }
        if (((index + 1) < this.templateList.length)) {
            this.loanDataService.setNext(index + 1, this.templateList[index + 1].templateUrl, this.templateList[index + 1].name);
            this.nxtTab = this.templateList[index + 1].templateUrl;
            this.last = false;
        } else {
            this.currentTab = {
                tabIndex: index,
                tabName: name
            };
            this.last = true;
        }
    }

    nextTab() {
        this.selectChild(this.selectedTab, true);
        this.nxtParameter = this.loanDataService.getNext();
        this.selectTab(this.nxtParameter.index, this.nxtParameter.name);

    }

    prevTab() {
        this.previousParameter = this.loanDataService.getPrevious();
        this.selectTab(this.previousParameter.index, this.previousParameter.name);
    }

    save() {
        this.submitEnable = false;
        this.selectChild(this.selectedTab, true);
        this.loanDocument.loan = this.loan;
        this.loanFormService.save(this.loanDocument).subscribe((response: any) => {
            this.loanDocument = response.detail;
            this.customerLoanId = this.loanDocument.id;
            this.loanDocument = new LoanDataHolder();
            this.router.navigate(['/home/loan/summary'], {queryParams: {loanConfigId: this.id, customerId: this.customerLoanId}});

        });
    }


}
