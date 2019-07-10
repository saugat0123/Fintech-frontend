import {Component, OnInit, ViewChild} from '@angular/core';
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
import {CompanyInfoComponent} from '../loan-main-template/company-info/company-info.component';
import {BasicInfoComponent} from '../loan-main-template/basic-info/basic-info.component';
import {DmsLoanFileComponent} from '../loan-main-template/dms-loan-file/dms-loan-file.component';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {DateService} from '../../../../@core/service/baseservice/date.service';
import {KycInfoComponent} from '../loan-main-template/kyc-info/kyc-info.component';
import {CustomerRelative} from '../../../admin/modal/customer-relative';
import {ProposalComponent} from '../loan-main-template/proposal/proposal.component';
import {Proposal} from '../../../admin/modal/proposal';
import {SiteVisitComponent} from '../loan-main-template/site-visit/site-visit.component';

@Component({
    selector: 'app-loan-form',
    templateUrl: './loan-form.component.html',
    styleUrls: ['./loan-form.component.css'],
})
export class LoanFormComponent implements OnInit {
    loanFile: DmsLoanFile;
    loanTitle: string;

    customerLoanId: number;
    templateList = [
        {
            active: false,
            name: null,
            templateUrl: null
        }
    ];

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
    submitDisable = false;
    loanDocument: LoanDataHolder;

    @ViewChild('basicInfo')
    basicInfo: BasicInfoComponent;

    @ViewChild('dmsLoanFile')
    dmsLoanFile: DmsLoanFileComponent;

    @ViewChild('entityInfo')
    entityInfo: CompanyInfoComponent;

    @ViewChild('kycInfo')
    kycInfo: KycInfoComponent;

    @ViewChild('proposalInfo')
    proposalDetail: ProposalComponent;

    @ViewChild('siteVisit')
    siteVisit: SiteVisitComponent;

    constructor(
        private dataService: CommonDataService,
        private loanDataService: LoanDataService,
        private dmsLoanService: DmsLoanService,
        private dateService: DateService,
        private loanFormService: LoanFormService,
        private activatedRoute: ActivatedRoute,
        private loanConfigService: LoanConfigService,
        private modalService: NgbModal,
        private router: Router,
        private breadcrumbService: BreadcrumbService
    ) {

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
                this.customerId = this.allId.customerId;
                if (this.customerId !== undefined) {
                    this.loanFormService.detail(this.customerId).subscribe(
                        (response: any) => {
                            this.loanFile = response.detail.dmsLoanFile;
                            this.loanDocument = response.detail;
                            this.loanDocument.id = response.detail.id;
                            this.submitDisable = false;
                        }
                    );
                } else {
                    this.loanDocument = new LoanDataHolder();
                    this.loanFile = new DmsLoanFile();
                }
            });

        this.dateService.getCurrentDateInNepali().subscribe((response: any) => {
            this.currentNepDate = response.detail.nepDateFormat;
        });

        this.populateTemplate();


    }


    populateTemplate() {
        this.loanConfigService.detail(this.id).subscribe((response: any) => {
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
        if (this.selectChild(this.selectedTab, true)) {
            return;
        }
        this.nxtParameter = this.loanDataService.getNext();
        this.selectTab(this.nxtParameter.index, this.nxtParameter.name);
    }

    prevTab() {
        this.previousParameter = this.loanDataService.getPrevious();
        this.selectTab(this.previousParameter.index, this.previousParameter.name);
    }

    save() {
        if (this.selectChild(this.selectedTab, true)) {
            return;
        }
        this.loanDocument.loan = this.loan;
        this.loanFormService.save(this.loanDocument).subscribe((response: any) => {
            this.loanDocument = response.detail;
            this.customerLoanId = this.loanDocument.id;
            this.loanDocument = new LoanDataHolder();
            this.router.navigate(['/home/loan/summary'], {queryParams: {loanConfigId: this.id, customerId: this.customerLoanId}});
        });
    }


    selectChild(name, action) {
        if (name === 'Customer Info' && action) {
            if (this.basicInfo.basicInfo.invalid) {
                this.basicInfo.submitted = true;
                return true;
            }
            this.basicInfo.onSubmit();
            this.loanDocument.customerInfo = this.basicInfo.basicInfo.value;
        }

        if (name === 'General' && action) {
            if (this.dmsLoanFile.loanForm.invalid) {
                this.dmsLoanFile.submitted = true;
                return true;
            }
            this.dmsLoanFile.onSubmit();
            this.loanDocument.dmsLoanFile = this.dmsLoanFile.loanFile;
            this.loanDocument.priority = this.dmsLoanFile.loanForm.get('priority').value;
        }

        if (name === 'Company Info' && action) {
            if (this.entityInfo.companyInfo.invalid) {
                this.entityInfo.submitted = true;
                return true;
            }
            this.entityInfo.onSubmit();
            this.loanDocument.entityInfo = this.entityInfo.entityInfo;
        }
        if (name === 'Kyc Info' && action) {
            this.kycInfo.onSubmit();
            const customerRelatives = this.kycInfo.kycInfo.value.otherRelatives as Array<CustomerRelative>;
            this.loanDocument.customerInfo.customerRelatives = customerRelatives;
        }

        if (name === 'Proposal' && action) {
            if (this.proposalDetail.proposalForm.invalid) {
                this.proposalDetail.submitted = true;
                return true;
            }
            this.proposalDetail.onSubmit();
            this.loanDocument.proposal = this.proposalDetail.proposalForm.value;
        }

        if (name === 'Site Visit' && action) {
            this.siteVisit.onSubmit();
            this.loanDocument.siteVisit = this.siteVisit.formValue;
        }
    }


    submitButton(event) {
        this.submitDisable = event;
    }

    loadProposal() {
        if (this.loanDocument.proposal === undefined) {
            return new Proposal();
        } else {
            return this.loanDocument.proposal;
        }
    }
}
