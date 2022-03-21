import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {ProposalComponent} from '../../../loan-information-template/proposal/proposal.component';
import {Proposal} from '../../../admin/modal/proposal';
import {CiclComponent} from '../../../loan-information-template/cicl/cicl.component';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {DatePipe} from '@angular/common';
import {CreditGradingComponent} from '../../../loan-information-template/credit-grading/credit-grading.component';
import {SiteVisitComponent} from '../../../loan-information-template/site-visit/site-visit.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {SecurityComponent} from '../../../loan-information-template/security/security.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerLoanDocumentComponent} from '../../../loan-information-template/customer-loan-document/customer-loan-document.component';
import {DocStatus} from '../../model/docStatus';
import {CustomerService} from '../../../customer/service/customer.service';
import {ScrollNavigationService} from '../../../../@core/service/baseservice/scroll-navigation.service';
import {GroupComponent} from '../loan-main-template/group/group.component';
import {LoanMainNepaliTemplateComponent} from '../loan-main-nepali-template/loan-main-nepali-template.component';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ProductUtils} from '../../../admin/service/product-mode.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NepaliTemplateDataHolder} from '../../model/nepali-template-data-holder';
import {Customer} from '../../../admin/modal/customer';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {ReportingInfoTaggingComponent} from '../../../reporting/component/reporting-info-tagging/reporting-info-tagging.component';
import {InsuranceComponent} from '../../../loan-information-template/insurance/insurance.component';
import {
    CreditRiskGradingAlphaComponent
} from '../../../loan-information-template/credit-risk-grading-alpha/credit-risk-grading-alpha.component';
import {CustomerInfoData} from '../../model/customerInfoData';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {FinancialComponent} from '../../../loan-information-template/financial/financial.component';
import {CompanyInfoService} from '../../../admin/service/company-info.service';
import {CustomerType} from '../../../customer/model/customerType';
import {GuarantorAdderComponent} from '../loan-main-template/guarantor-adder/guarantor-adder.component';
import {
    CreditRiskGradingGammaComponent
} from '../../../loan-information-template/credit-risk-grading-gamma/credit-risk-grading-gamma.component';
import {DefaultLoanTemplate} from '../../../../@core/utils/constants/default-loan-template';
import {LoanType} from '../../model/loanType';
import {CommonRoutingUtilsService} from '../../../../@core/utils/common-routing-utils.service';
import {
    CreditRiskGradingLambdaComponent
} from '../../../loan-information-template/credit-risk-grading-lambda/credit-risk-grading-lambda.component';
import {RiskGradingService} from '../../../credit-risk-grading/service/risk-grading.service';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {MicroProposalComponent} from '../../../micro-loan/form-component/micro-proposal/micro-proposal.component';
import {CrgMicroComponent} from '../../../loan-information-template/crg-micro/crg-micro.component';
import {MicroCustomerType} from '../../../../@core/model/enum/micro-customer-type';
import {ProductPaperChecklistComponent} from '../../../loan-information-template/product-paper-checklist/product-paper-checklist.component';
import {DomSanitizer} from '@angular/platform-browser';


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

    client = environment.client;
    clientName = Clients;

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

    // Priority options--
    dropdownPriorities = [
        {id: 'HIGH', name: 'High'},
        {id: 'MEDIUM', name: 'Medium'},
        {id: 'LOW', name: 'Low'},

    ];

    dropdownApprovalLevel = [
        {id: 'L1', name: 'L1'},
        {id: 'L2', name: 'L2'},
        {id: 'L3', name: 'L3'}
    ];

    // Priority Form
    priorityForm: FormGroup;

    approvingLevelForm: FormGroup;

    docStatusForm: FormGroup;
    loanTypeForm: FormGroup;
    creditRisk: FormGroup;
    nextButtonAction = false;

    loan: LoanConfig = new LoanConfig();
    currentNepDate;
    submitDisable = false;
    loanDataReady = false;
    loanDocument: LoanDataHolder;

    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;

    docStatusMakerList = [];

    calendarType: CalendarType = CalendarType.AD;

    showDocStatusDropDown = true;
    isBlackListed = false;

    @ViewChild('priorityFormNav', {static: false})
    priorityFormNav: ElementRef;

    @ViewChild('container', {static: false})
    container: ElementRef;

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

    @ViewChild('creditRiskGradingAlpha', {static: false})
    creditRiskGradingAlpha: CreditRiskGradingAlphaComponent;

    @ViewChild('creditRiskGradingLambda', {static: false})
    creditRiskGradingLambda: CreditRiskGradingLambdaComponent;

    @ViewChild('crgMicro', {static: false})
    crgMicro: CrgMicroComponent;

    @ViewChild('crgGamma', {static: false})
    crgGamma: CreditRiskGradingGammaComponent;

    @ViewChild('financial', {static: false})
    financial: FinancialComponent;

    @ViewChild('siteVisit', {static: false})
    siteVisit: SiteVisitComponent;

    @ViewChild('security', {static: false})
    security: SecurityComponent;

    @ViewChild('customerDocument', {static: false})
    customerDocument: CustomerLoanDocumentComponent;

    @ViewChild('group', {static: false})
    group: GroupComponent;

    @ViewChild('guarantor', {static: false})
    guarantorComponent: GuarantorAdderComponent;

    @ViewChild('reportingInfoTagging', {static: false})
    reportingInfoTaggingComponent: ReportingInfoTaggingComponent;

    @ViewChild('insurance', {static: false})
    insuranceComponent: InsuranceComponent;

    @ViewChild('microProposalInfo', {static: false})
    microProposalInfo: MicroProposalComponent;
    @ViewChild('productPaperChecklistComponent', {static: false})
    productPaperChecklistComponent: ProductPaperChecklistComponent;

    loanTag: string;
    loanHolder = new CustomerInfoData();
    loanTypeKeyValue = LoanType;
    loanType;
    checklistData;
    loans;
    paperChecklist;
    allIds = [];
    checklistChecked = false;


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
        private scrollNavService: ScrollNavigationService,
        private customerInfoService: CustomerInfoService,
        private companyInfoService: CompanyInfoService,
        private commonRoutingUtilsService: CommonRoutingUtilsService,
        protected riskQuestionService: RiskGradingService,
        private sanitized: DomSanitizer,
        private el: ElementRef,
        private changeDetectorRef: ChangeDetectorRef

    ) {
    }

    ngOnInit() {
        this.spinner.show();
        this.docStatusForMaker();
        this.buildPriorityForm();
        this.buildApprovingLevelForm();
        this.buildDocStatusForm();
        this.buildCreditRiskForm();

        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {
                    loanId: null,
                    customerId: null,
                    loanCategory: null,
                    customerProfileId: null,  // CustomerInfo->associateId
                    customerType: null,
                    customerInfoId: null,   // CustomerInfo->id
                    loanType: null
                };

                this.allId = paramsValue;
                this.id = this.allId.loanId;
                this.loan.id = this.id;
                this.customerId = this.allId.customerId;
                this.loanHolder.id = this.allId.customerInfoId;
                this.loanType = this.allId.loanType;

                if (!ObjectUtil.isEmpty(this.allId.customerProfileId)) {
                    if (CustomerType[this.allId.customerType] === CustomerType.INDIVIDUAL) {
                        this.getCustomerInfo(this.allId.customerProfileId);
                    } else {
                        this.getCompanyInfo(this.allId.customerProfileId);
                    }
                }
                if (!ObjectUtil.isEmpty(this.allId.customerInfoId)) {
                    this.getTemplateInfoFromCustomerInfo(this.allId.customerInfoId);
                }
                if (this.customerId !== undefined) {
                    this.loanFormService.detail(this.customerId).subscribe(
                        (response: any) => {
                            this.loanFile = response.detail.dmsLoanFile;
                            this.loanDocument = response.detail;
                            this.checklistData = this.sanitized.bypassSecurityTrustHtml(this.loanDocument.paperProductChecklist);
                            this.loanDocument.id = response.detail.id;
                            this.submitDisable = false;
                            this.loanHolder = this.loanDocument.loanHolder;
                            this.priorityForm.get('priority').patchValue(this.loanDocument.priority);
                            this.approvingLevelForm.get('approvingLevel').patchValue(this.loanDocument.approvingLevel);
                            this.loanType = this.loanDocument.loanType;
                            if (this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.DISCUSSION) ||
                                this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.DOCUMENTATION) ||
                                this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.VALUATION) ||
                                this.loanDocument.documentStatus.toString() === DocStatus.value(DocStatus.UNDER_REVIEW)) {
                                this.showDocStatusDropDown = true;
                            } else {
                                this.showDocStatusDropDown = false;
                            }
                            this.docStatusForm.get('documentStatus').patchValue(this.loanDocument.documentStatus);
                            this.creditRisk.get('creditRisk').patchValue(this.loanDocument.creditRisk);

                            this.populateTemplate();
                            this.loanDataReady = true;
                        }, error => {
                            console.log(error);
                            this.populateTemplate();
                            this.loanDataReady = true;
                        }
                    );
                } else {
                    this.loanDocument = new LoanDataHolder();
                    this.loanDocument.loanCategory = this.allId.loanCategory;
                    this.loanFile = new DmsLoanFile();
                    this.priorityForm.get('priority').patchValue('MEDIUM');
                    this.docStatusForm.get('documentStatus').patchValue(DocStatus.value(DocStatus.DISCUSSION));
                    this.populateTemplate();
                }

            });
        this.dateService.getDateInNepali(this.datePipe.transform(new Date(), 'yyyy-MM-dd')).subscribe((response: any) => {
            this.currentNepDate = response.detail;
        });
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

    buildApprovingLevelForm() {
        this.approvingLevelForm = this.formBuilder.group({
            approvingLevel: [undefined, Validators.required]
        });
    }

    buildCreditRiskForm() {
        this.creditRisk = this.formBuilder.group({
            creditRisk: [undefined, Validators.required]
        });
    }


    buildDocStatusForm() {
        this.docStatusForm = this.formBuilder.group({
            documentStatus: [undefined, Validators.required]
        });
    }


    populateTemplate() {
        this.loanConfigService.detail(this.id).subscribe((response: any) => {
            this.loans = response.detail;
            if (ObjectUtil.isEmpty(this.loanDocument.paperProductChecklist)) {
                if (!ObjectUtil.isEmpty(this.loans.paperChecklist)) {
                    const obj = JSON.parse(this.loans.paperChecklist);
                    this.paperChecklist = obj.view;
                    this.allIds = obj.id;
                    this.checklistChecked = obj.checklistChecked;
                }
            } else  {
                const obj = JSON.parse(this.loanDocument.paperProductChecklist);
                this.paperChecklist = obj.view;
                this.allIds = obj.id;
                this.checklistChecked = true;
            }
            this.loanTag = response.detail.loanTag;
            // this.templateList = response.detail.templateList;
            this.templateList = new DefaultLoanTemplate().DEFAULT_TEMPLATE;
            // Splicing customer loan for Personal Type Loan--
            if ((this.loanType === 'NEW_LOAN') || this.loanType === 'RENEWED_LOAN' || this.loanType === 'ENHANCED_LOAN' ||
                this.loanType === 'RENEW_WITH_ENHANCEMENT') {
                this.templateList.forEach((value, index) => {
                    if (value.name === 'Security') {
                        this.templateList.splice(index, 1);
                    }
                });
            }
            if (CustomerType[this.allId.loanCategory] === CustomerType.INDIVIDUAL) {
                this.templateList.forEach((value, index) => {
                    if (value.name === 'Company Info') {
                        this.templateList.splice(index, 1);
                    } else if (value.name === 'Credit Risk Grading - Alpha') {
                        this.templateList.splice(index, 1);
                    }
                });
                if (!this.checklistChecked || ObjectUtil.isEmpty(this.paperChecklist)) {
                    this.templateList.forEach((value, index) => {
                        // this.loanDocument.customerInfo.isMicroCustomer ||
                        if (value.name === 'Product Paper Checklist') {
                            this.templateList.splice(index, 1);
                        }
                    });
                }
                this.templateList.forEach((value, index) => {
                    // this.loanDocument.customerInfo.isMicroCustomer ||
                    if ((environment.disableCrgLambda) && value.name === 'Credit Risk Grading - Lambda') {
                        this.templateList.splice(index, 1);
                    }
                });
            } else {
                this.templateList = new DefaultLoanTemplate().DEFAULT_TEMPLATE;
                this.templateList.forEach((value, index) => {
                    if (value.name === 'Credit Risk Grading - Lambda') {
                        this.templateList.splice(index, 1);
                    }
                });
                this.templateList.forEach((value, index) => {
                    if ((this.loanDocument.companyInfo.isMicroCustomer ||
                        environment.disableCrgAlpha) && value.name === 'Credit Risk Grading - Alpha') {
                        this.templateList.splice(index, 1);
                    }
                });
            }

            if (environment.disableCrgAlpha) {
                this.templateList.forEach((value, index) => {
                    if (value.name === 'Credit Risk Grading - Alpha') {
                        this.templateList.splice(index, 1);
                    }
                });
            }

            // Remove Customer Info Template for Business Loan Type
            if (CustomerType[this.allId.loanCategory] === CustomerType.INSTITUTION) {
                this.templateList.forEach((value, i) => {
                    if (value.name === 'Customer Info') {
                        this.templateList.splice(i, 1);
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

            this.riskQuestionService.getAllQuestions(this.id).subscribe(riskQsnRes => {
                const crgQuestionsList = riskQsnRes.detail as Array<any>;
                if (!(crgQuestionsList.length > 0)) {
                    this.removeCrgGammaFromTemplateList();
                    this.templateList.forEach((value, index) => {
                        if (CustomerType[this.allId.loanCategory] === CustomerType.INDIVIDUAL) {
                            if (!this.loanDocument.customerInfo.isMicroCustomer
                                && value.name === 'Credit Risk Grading - Micro') {
                                this.templateList.splice(index, 1);
                            }
                        } else {
                            if (this.loanDocument.companyInfo.microCustomerType !== MicroCustomerType.DIRECT
                                && value.name === 'Credit Risk Grading - Micro') {
                                this.templateList.splice(index, 1);
                            }
                        }
                    });
                } else {
                    this.templateList.forEach((value, index) => {
                        if (value.name === 'Credit Risk Grading - Lambda') {
                            this.templateList.splice(index, 1);
                        }
                        if (value.name === 'Credit Risk Grading - Alpha') {
                            this.templateList.splice(index, 1);
                        }
                        if (value.name === 'Credit Risk Grading - Micro') {
                            this.templateList.splice(index, 1);
                        }
                    });
                }
                this.pushProposalTemplateToLast();
                this.spinner.hide();
            }, error => {
                this.spinner.hide();
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Error while checking for available CRG-GAMMA questions!'));
                this.removeCrgGammaFromTemplateList();
                this.pushProposalTemplateToLast();
            });
        });
    }
    pushProposalTemplateToLast() {
        this.templateList.some((value, index) => {
            if (value.name === 'Proposal') {
                this.templateList.push(this.templateList.splice(index, 1)[0]);
                return true;
            }
            return false;
        });
        this.totalTabCount = this.templateList.length;
    }

    removeCrgGammaFromTemplateList() {
        this.templateList.forEach((value, index) => {
            if (value.name === 'Credit Risk Grading - Gamma') {
                this.templateList.splice(index, 1);
            }
        });
    }

    tabChange(evt: NgbTabChangeEvent, tabSet: NgbTabset) {
        const selectedTabId = parseInt(evt.nextId, 10);
        this.nextTabId = selectedTabId + 1;
        this.previousTabId = selectedTabId - 1;

        tabSet.tabs.forEach(templateListMember => {
            if (Number(templateListMember.id) === Number(evt.activeId) && !this.nextButtonAction) {
                this.selectChild(templateListMember.title, true, this.loanTag);
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
        if (this.selectChild(this.selectedTab, true, this.loanTag)) {
            return;
        }
        this.nxtParameter = this.loanDataService.getNext();
        this.selectTab(this.nxtParameter.index, this.nxtParameter.name);
    }

    prevTab() {
        this.previousParameter = this.loanDataService.getPrevious();
        this.selectTab(this.previousParameter.index, this.previousParameter.name);
    }

    nextButtonActionFxn(tabSet: NgbTabset) {
        this.nextButtonAction = true;
        tabSet.tabs.some(templateListMember => {
            if (Number(templateListMember.id) === Number(tabSet.activeId)) {
                if (this.selectChild(templateListMember.title, true, this.loanTag)) {
                    this.nextButtonAction = false;
                    return true;
                } else {
                    tabSet.select(this.nextTabId.toString(10));
                    return true;
                }
            }
        });
    }

    selectChild(name, action, loanTag) {
        //     // TODO: Add Validations in Tabs

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

        if (name === 'Kyc Info' && action) {
            this.kycInfo.onSubmit();
            const customerRelatives = this.kycInfo.kycInfo.value.otherRelatives as Array<CustomerRelative>;
            this.loanDocument.customerInfo.customerRelatives = customerRelatives;
        }

        if (name === 'Proposal' && action) {
            if (this.proposalDetail.proposalForm.invalid && this.nextButtonAction) {
                this.proposalDetail.scrollToFirstInvalidControl();
                this.proposalDetail.submitted = true;
                return true;
            }
            this.proposalDetail.onSubmit();
            this.loanDocument.proposal = this.proposalDetail.proposalData;

        }
        if (name === 'Product Paper Checklist' && action) {
            this.productPaperChecklistComponent.save();
            this.loanDocument.paperProductChecklist = this.checklistData;
            const obj = JSON.parse(this.checklistData);
            this.paperChecklist = obj.view;
            this.allIds = obj.id;
        }

        if (name === 'Loan Document' && action) {
            this.loanDocument.customerDocument = this.customerDocument.customerDocumentArray;
        }

        if (name === 'Credit Risk Grading - Alpha' && action) {
            this.creditRiskGradingAlpha.onSubmit();
            this.loanDocument.creditRiskGradingAlpha = this.creditRiskGradingAlpha.creditRiskData;
        }

        if (name === 'Credit Risk Grading - Lambda' && action) {
            this.creditRiskGradingLambda.onSubmit();
            this.loanDocument.creditRiskGradingLambda = this.creditRiskGradingLambda.creditRiskData;
        }

        if (name === 'Credit Risk Grading - Micro' && action) {
            this.crgMicro.onSubmit();
            this.loanDocument.crgMicro = this.crgMicro.creditRiskData;
        }

        if (name === 'Credit Risk Grading - Gamma' && action) {
            this.crgGamma.onSubmit();
            this.loanDocument.crgGamma = this.crgGamma.creditRiskData;
        }

        if (name === 'Group' && action) {
            this.group.onSubmit();
            this.loanDocument.group = this.group.modelData;
        }

        if (name === 'Guarantor' && action) {
            this.loanDocument.taggedGuarantors = this.guarantorComponent.selectedGuarantorList;
        }

        if (name === 'Reporting Info' && action) {
            this.reportingInfoTaggingComponent.onSubmit();
            this.loanDocument.reportingInfoLevels = this.reportingInfoTaggingComponent.finalReportingInfoLevels;
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

    getCustomerInfo(id) {
        this.customerService.detail(id).subscribe((res: any) => {
            this.loanDocument.customerInfo = res.detail;
        });
    }

    getCompanyInfo(id) {
        this.companyInfoService.detail(id).subscribe((res: any) => {
            this.loanDocument.companyInfo = res.detail;
        });
    }

    getTemplateInfoFromCustomerInfo(id) {
        this.customerInfoService.detail(id)
            .subscribe((infoResponse) => {
                this.loanHolder = infoResponse.detail;
                this.loanDocument.loanHolder = this.loanHolder;
                this.loanDocument.siteVisit = this.loanHolder.siteVisit;
                this.loanDocument.financial = this.loanHolder.financial;
                if (CustomerType[this.loanHolder.customerType] === CustomerType.INSTITUTION) {
                    this.companyInfoService.detail(this.loanHolder.associateId).subscribe((res: any) => {
                        this.loanDocument.companyInfo = res.detail;
                    }, error => {
                        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
                    });
                }
                this.loanDocument.creditRiskGradingAlpha = this.loanHolder.creditRiskGradingAlpha;
                this.loanDocument.creditRiskGrading = this.loanHolder.creditRiskGrading;
                this.loanDocument.crgGamma = this.loanHolder.crgGamma;
                this.loanDocument.security = this.loanHolder.security;
                this.loanDocument.shareSecurity = this.loanHolder.shareSecurity;
                this.loanDocument.insurance = this.loanHolder.insurance;
                this.loanDataReady = true;
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load customer info'));
            });
    }

    nepaliFormTemplate() {
        if (ObjectUtil.isEmpty(this.loanDocument.customerInfo)) {
            this.loanDocument.customerInfo = new Customer();
        }
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

    getIsBlackListed(isBlackListed: boolean) {
        this.isBlackListed = isBlackListed;
    }

    save(action) {
        if (this.priorityForm.invalid) {
            this.scrollNavService.scrollNavigateTo(this.priorityFormNav);
            return;
        }
        this.nextButtonAction = true;
        this.spinner.show();

        if (this.selectChild(this.selectedTab, action, this.loanTag)) {
            this.spinner.hide();
            this.nextButtonAction = false;
            return;
        } else {
            // this.loanDocument.loanHolder = this.proposalDetail.incomeFromAccountDataResponse;
            this.loanDocument.loan = this.loan;
            this.loanDocument.priority = this.priorityForm.get('priority').value;
            this.loanDocument.approvingLevel = this.approvingLevelForm.get('approvingLevel').value;
            this.loanDocument.documentStatus = this.docStatusForm.get('documentStatus').value;
            this.loanDocument.creditRisk = this.creditRisk.get('creditRisk').value;
            this.loanDocument.loanType = this.loanType;
            this.loanDocument.loanCategory = this.allId.loanCategory;
            if (CustomerType[this.loanHolder.customerType] === CustomerType.INSTITUTION) {
                this.loanDocument.customerInfo = null;
            }
            if (ObjectUtil.isEmpty(this.loanDocument.loanHolder)) {
                this.spinner.hide();
                this.toastService.show(new Alert(AlertType.ERROR, 'Customer cannot be empty! Please search customer'));
                return;
            }
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

    scrollToTop() {
        this.scrollNavService.scrollNavigateTo(this.container);
    }

    goToCustomer() {
        const loanHolder = this.loanDocument.loanHolder;
        this.commonRoutingUtilsService.loadCustomerProfile(loanHolder.associateId, loanHolder.id, loanHolder.customerType);
    }

   updateIncome(event) {
       this.loanDocument.loanHolder = event;
       this.save(false);
   }
   updateChecklist(event) {
        this.checklistData = event;
   }
}
