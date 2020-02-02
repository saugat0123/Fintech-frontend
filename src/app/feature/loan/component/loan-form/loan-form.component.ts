import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoanDataService} from '../../service/loan-data.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {NgbModal, NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {LoanDataHolder} from '../../model/loanData';
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
import {FinancialComponent} from '../loan-main-template/financial/financial.component';
import {CiclComponent} from '../loan-main-template/cicl/cicl.component';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {DatePipe} from '@angular/common';
import {CreditGradingComponent} from '../loan-main-template/credit-grading/credit-grading.component';
import {SiteVisitComponent} from '../loan-main-template/site-visit/site-visit.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {SecurityComponent} from '../loan-main-template/security/security.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerDocumentComponent} from '../loan-main-template/customer-document/customer-document.component';
import {DocStatus} from '../../model/docStatus';
import {CustomerService} from '../../../customer/service/customer.service';
import {ScrollNavigationService} from '../../../../@core/service/baseservice/scroll-navigation.service';
import {VehicleSecurityComponent} from '../loan-main-template/vehicle-security/vehicle-security.component';
import {ShareSecurityComponent} from '../loan-main-template/share-security/share-security.component';
import {GroupComponent} from '../loan-main-template/group/group.component';
import {LoanMainNepaliTemplateComponent} from '../loan-main-nepali-template/loan-main-nepali-template.component';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ProductUtils} from '../../../admin/service/product-mode.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NepaliTemplateDataHolder} from '../../model/nepali-template-data-holder';

@Component({
    selector: 'app-loan-form',
    templateUrl: './loan-form.component.html',
    styleUrls: ['./loan-form.component.css'],
})
export class LoanFormComponent implements OnInit {
    loanFile: DmsLoanFile;
    loanTitle: string;
    loading = true;

    totalTabCount = 0;
    nextTabId = 0;
    previousTabId = 0;

    customerLoanId: number;
    templateList = [
        {
            active: false,
            name: null,
            templateUrl: null
        }
    ];

    customerId: number;
    customerProfileId: number;
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

    // Priority options--
    dropdownPriorities = [
        {id: 'HIGH', name: 'High'},
        {id: 'MEDIUM', name: 'Medium'},
        {id: 'LOW', name: 'Low'},

    ];

    // Priority Form
    priorityForm: FormGroup;

    docStatusForm: FormGroup;

    nextButtonAction = false;

    loan: LoanConfig = new LoanConfig();
    currentNepDate;
    submitDisable = false;
    loanDocument: LoanDataHolder;

    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;

    docStatusMakerList = [];

    showDocStatusDropDown = true;

    @ViewChild('priorityFormNav', {static: false})
    priorityFormNav: ElementRef;

    @ViewChild('basicInfo', {static: false})
    basicInfo: BasicInfoComponent;

    @ViewChild('dmsLoanFile', {static: false})
    dmsLoanFile: DmsLoanFileComponent;

    @ViewChild('companyInfo', {static: false})
    companyInfoComponent: CompanyInfoComponent;

    @ViewChild('kycInfo', {static: false})
    kycInfo: KycInfoComponent;

    @ViewChild('proposalInfo', {static: false})
    proposalDetail: ProposalComponent;

    @ViewChild('cicl', {static: false})
    cicl: CiclComponent;

    @ViewChild('creditGrading', {static: false})
    creditGrading: CreditGradingComponent;

    @ViewChild('financial', {static: false})
    financial: FinancialComponent;

    @ViewChild('siteVisit', {static: false})
    siteVisit: SiteVisitComponent;

    @ViewChild('security', {static: false})
    security: SecurityComponent;

    @ViewChild('customerDocument', {static: false})
    customerDocument: CustomerDocumentComponent;
    @ViewChild('group', {static: false})
    group: GroupComponent;

    @ViewChild('vehicleSecurity', {static: false})
    vehicleSecurity: VehicleSecurityComponent;

    @ViewChild('shareSecurity', {static: false})
    shareSecurity: ShareSecurityComponent;

    constructor(
        private loanDataService: LoanDataService,
        private dmsLoanService: DmsLoanService,
        private dateService: DateService,
        private loanFormService: LoanFormService,
        private activatedRoute: ActivatedRoute,
        private loanConfigService: LoanConfigService,
        private modalService: NgbModal,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private customerService: CustomerService,
        private scrollNavService: ScrollNavigationService
    ) {

    }

    ngOnInit() {
        console.log('productUtils', this.productUtils);
        this.docStatusForMaker();
        this.buildPriorityForm();
        this.buildDocStatusForm();
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanId: null,
                    customerId: null,
                    loanCategory: null,
                    customerProfileId: null
                };

                this.allId = paramsValue;
                this.id = this.allId.loanId;
                this.loan.id = this.id;
                this.customerId = this.allId.customerId;
                if (this.allId.customerProfileId !== undefined) {
                    this.getCustomerInfo();
                }
                if (this.customerId !== undefined) {
                    this.loanFormService.detail(this.customerId).subscribe(
                        (response: any) => {
                            this.loanFile = response.detail.dmsLoanFile;
                            this.loanDocument = response.detail;
                            this.loanDocument.id = response.detail.id;
                            this.submitDisable = false;
                            this.priorityForm.get('priority').patchValue(this.loanDocument.priority);
                            if (this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.DISCUSSION) ||
                                this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.DOCUMENTATION) ||
                                this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.VALUATION) ||
                                this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.UNDER_REVIEW)) {
                                this.showDocStatusDropDown = true;
                            } else {
                                this.showDocStatusDropDown = false;
                            }
                            this.docStatusForm.get('documentStatus').patchValue(this.loanDocument.documentStatus);
                        }
                    );
                } else {
                    this.loanDocument = new LoanDataHolder();
                    this.loanFile = new DmsLoanFile();
                    this.docStatusForm.get('documentStatus').patchValue(DocStatus.value(DocStatus.DISCUSSION));
                }
            });
        this.dateService.getDateInNepali(this.datePipe.transform(new Date(), 'yyyy-MM-dd')).subscribe((response: any) => {
            this.currentNepDate = response.detail;
        });

        this.populateTemplate();
        this.loading = false;
    }

    docStatusForMaker() {
        DocStatus.values().forEach((value) => {
            if (value === DocStatus.value(DocStatus.DISCUSSION) ||
                value === DocStatus.value(DocStatus.DOCUMENTATION) ||
                value === DocStatus.value(DocStatus.VALUATION) ||
                value === DocStatus.value(DocStatus.UNDER_REVIEW)) {
                this.docStatusMakerList.push(value);
            }
        });
    }

    buildPriorityForm() {
        this.priorityForm = this.formBuilder.group({
            priority: [undefined, Validators.required]
        });
    }


    buildDocStatusForm() {
        this.docStatusForm = this.formBuilder.group({
            documentStatus: [undefined, Validators.required]
        });
    }

    populateTemplate() {
        this.loanConfigService.detail(this.id).subscribe((response: any) => {
            this.templateList = response.detail.templateList;

            // Splicing customer loan for Personal Type Loan--
            if (this.allId.loanCategory === 'PERSONAL_TYPE') {
                this.templateList.forEach((value, index) => {
                    if (value.name === 'Company Info') {
                        this.templateList.splice(index, 1);
                    }
                });
            }

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

                this.totalTabCount = this.templateList.length;
                this.nextTabId = 1;
            }
            if (this.templateList.length === 0) {
                this.toastService.show(new Alert(AlertType.INFO, 'NO FORM ARE AVAILABLE'));
                this.router.navigate(['/home/dashboard']);
            }
        });
    }

    tabChange(evt: NgbTabChangeEvent, tabSet: NgbTabset) {
        const selectedTabId = parseInt(evt.nextId, 10);
        this.nextTabId = selectedTabId + 1;
        this.previousTabId = selectedTabId - 1;

        tabSet.tabs.forEach(templateListMember => {
            if (Number(templateListMember.id) === Number(evt.activeId) && !this.nextButtonAction) {
                this.selectChild(templateListMember.title, true);
            }
            if (Number(templateListMember.id) === Number(evt.nextId)) {
                this.selectedTab = templateListMember.title;
            }
        });
        this.nextButtonAction = false;
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
        if (this.priorityForm.invalid) {
            this.scrollNavService.scrollNavigateTo(this.priorityFormNav);
            return;
        }
        this.nextButtonAction = true;
        this.spinner.show();
        if (this.selectChild(this.selectedTab, true)) {
            this.spinner.hide();
            this.nextButtonAction = false;
            return;
        } else {
            this.loanDocument.loan = this.loan;
            this.loanDocument.priority = this.priorityForm.get('priority').value;
            this.loanDocument.documentStatus = this.docStatusForm.get('documentStatus').value;
            this.loanDocument.loanCategory = this.allId.loanCategory;
            this.loanFormService.save(this.loanDocument).subscribe((response: any) => {
                this.loanDocument = response.detail;
                this.customerLoanId = this.loanDocument.id;
                this.loanDocument = new LoanDataHolder();
                this.router.navigate(['/home/loan/summary'], {queryParams: {loanConfigId: this.id, customerId: this.customerLoanId}})
                    .then(() => {
                        this.spinner.hide();
                    });
            }, error => {
                this.spinner.hide();
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, `Error saving customer: ${error.error.message}`));
            });
        }
    }

    nextButtonActionFxn(tabSet: NgbTabset) {
        this.nextButtonAction = true;
        tabSet.tabs.some(templateListMember => {
            if (Number(templateListMember.id) === Number(tabSet.activeId)) {
                if (this.selectChild(templateListMember.title, true)) {
                    this.nextButtonAction = false;
                    return true;
                } else {
                    tabSet.select(this.nextTabId.toString(10));
                    return true;
                }
            }
        });
    }

    selectChild(name, action) {
        if (name === 'Customer Info' && action) {
            if (this.basicInfo.basicInfo.invalid && this.nextButtonAction) {
                this.basicInfo.submitted = true;
                // TODO: Add Validations in Tabs
                return true;
            }
            this.basicInfo.onSubmit();
            this.loanDocument.customerInfo = this.basicInfo.customer;
        }

        if (name === 'General' && action) {
            if (this.dmsLoanFile.loanForm.invalid) {
                this.dmsLoanFile.customerFormField.showFormField = true;
                this.dmsLoanFile.companyFormField.showFormField = true;
                this.dmsLoanFile.submitted = true;
                // return true;
            }
            this.dmsLoanFile.onSubmit();
            this.loanDocument.dmsLoanFile = this.dmsLoanFile.loanDataHolder.dmsLoanFile;
            this.loanDocument.customerInfo = this.dmsLoanFile.loanDataHolder.customerInfo;
            this.loanDocument.companyInfo = this.dmsLoanFile.loanDataHolder.companyInfo;
            this.loanDocument.priority = this.dmsLoanFile.loanForm.get('priority').value;
        }

        if (name === 'Company Info' && action) {
            if (this.companyInfoComponent.companyInfoFormGroup.invalid && this.nextButtonAction) {
                this.companyInfoComponent.submitted = true;
                return true;
            }
            this.companyInfoComponent.onSubmit();
            this.loanDocument.companyInfo = this.companyInfoComponent.companyInfo;
        }
        if (name === 'Kyc Info' && action) {
            this.kycInfo.onSubmit();
            const customerRelatives = this.kycInfo.kycInfo.value.otherRelatives as Array<CustomerRelative>;
            this.loanDocument.customerInfo.customerRelatives = customerRelatives;
        }

        if (name === 'Proposal' && action) {
            if (this.proposalDetail.proposalForm.invalid && this.nextButtonAction) {
                this.proposalDetail.submitted = true;
                return true;
            }
            this.proposalDetail.onSubmit();
            this.loanDocument.proposal = this.proposalDetail.proposalData;
        }

        if (name === 'Customer Document' && action) {
            this.loanDocument.customerDocument = this.customerDocument.customerDocumentArray;
        }

        if (name === 'CICL' && action) {
            if (this.cicl.ciclForm.invalid || this.cicl.insuranceForm.invalid) {
                this.cicl.submitted = true;
                // return true;
            }
            this.cicl.onSubmit();
            this.loanDocument.ciclList = this.cicl.ciclList;
            this.loanDocument.ciclRemarks = this.cicl.ciclRemark;
            this.loanDocument.insurance = this.cicl.insurance;
        }

        if (name === 'Financial' && action) {
            this.financial.onSubmit();
            this.loanDocument.financial = this.financial.financialData;
        }

        if (name === 'Site Visit' && action) {
            this.siteVisit.onSubmit();
            this.loanDocument.siteVisit = this.siteVisit.siteVisitData;
        }
        if (name === 'Security' && action) {
            this.security.onSubmit();
            this.loanDocument.security = this.security.securityData;
        }
        if (name === 'Credit Risk Grading' && action) {
            this.creditGrading.onSubmit();
            this.loanDocument.creditRiskGrading = this.creditGrading.creditRiskData;
        }
        if (name === 'Group' && action) {
            this.group.onSubmit();
            this.loanDocument.group = this.group.modelData;
        }

        if (name === 'Vehicle Security' && action) {
            this.vehicleSecurity.onSubmit();
            this.loanDocument.vehicleSecurity = this.vehicleSecurity.vehicleSecurity;
        }
        if (name === 'Share Security' && action) {
            this.shareSecurity.onSubmit();
            this.loanDocument.shareSecurity = this.shareSecurity.shareSecurityData;
        }
        return false;

    }


    submitButton(event) {
        this.submitDisable = event;
    }

    loadProposal() {
        if (this.loanDocument.proposal === undefined) {
            return undefined;
        } else {
            return this.loanDocument.proposal;
        }
    }

    getCustomerInfo() {
        this.customerService.detail(this.id).subscribe((res: any) => {
            this.loanDocument.customerInfo = res.detail;
        });
    }

    nepaliFormTemplate() {
        this.selectChild('Customer Info', true);    // initializes customer in loan
        if (ObjectUtil.isEmpty(this.loanDocument.nepaliTemplates)) {
            this.loanDocument.nepaliTemplates = new Array<NepaliTemplateDataHolder>();
        }
        const modalRef = this.modalService.open(LoanMainNepaliTemplateComponent,
            {
                size: 'xl',
                backdrop: 'static'
            });
        modalRef.componentInstance.customerLoan = this.loanDocument;
        modalRef.result
            .then(
                close => {
                    if (close instanceof Map) {
                        this.loanDocument = (close as Map<string, any>).get('CustomerLoan');
                    }
                },
                dismiss => {
                    console.log(dismiss);
                }
            );
    }
}
