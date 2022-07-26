import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {SiteVisitComponent} from '../../../loan-information-template/site-visit/site-visit.component';
import {TemplateName} from '../../model/templateName';
import {CustomerInfoService} from '../../service/customer-info.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {SiteVisit} from '../../../admin/modal/siteVisit';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbAccordionItemComponent, NbDialogRef, NbDialogService} from '@nebular/theme';
import {Financial} from '../../../loan/model/financial';
import {FinancialComponent} from '../../../loan-information-template/financial/financial.component';
import {Security} from '../../../loan/model/security';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {ShareSecurity} from '../../../admin/modal/shareSecurity';
import {GuarantorDetail} from '../../../loan/model/guarantor-detail';
import {GuarantorComponent} from '../../../loan-information-template/guarantor/guarantor.component';
import {Insurance} from '../../../admin/modal/insurance';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {CreditRiskGrading} from '../../../admin/modal/creditRiskGrading';
import {CreditGradingComponent} from '../../../loan-information-template/credit-grading/credit-grading.component';
import {CreditRiskGradingGammaComponent} from '../../../loan-information-template/credit-risk-grading-gamma/credit-risk-grading-gamma.component';
import {CreditRiskGradingGamma} from '../../../admin/modal/creditRiskGradingGamma';
import {CiclArray} from '../../../admin/modal/cicl';
import {IncomeFromAccount} from '../../../admin/modal/incomeFromAccount';
import {NetTradingAssets} from '../../../admin/modal/NetTradingAssets';
import {CreditChecklistGeneral} from '../../../loan/model/creditChecklistGeneral';
import {CustomerType} from '../../model/customerType';
import {environment} from '../../../../../environments/environment';
import {MicroLoanSynopsis} from '../../../loan/model/micro-loan-synopsis';
import {BorrowerPortfolio} from '../../../loan/model/borrwerportfolio';
import {MicroBaselRiskExposure} from '../../../loan/model/micro-basel-risk-exposure';
import {MicroBorrowerFinancial} from '../../../loan/model/micro-borrower-financial';
import {MarketingActivities} from '../../../loan/model/marketing-activities';
import {ReportingInfoLevel} from '../../../reporting/model/reporting-info-level';
import {ReportingInfoTaggingComponent} from '../../../reporting/component/reporting-info-tagging/reporting-info-tagging.component';
import {Comments} from '../../../admin/modal/comments';
import {CommentsComponent} from '../../../loan-information-template/comments/comments.component';
import {PreviousSecurity} from '../../../admin/modal/previousSecurity';
import {PreviousSecurityComponent} from '../../../loan-information-template/previous-security/previous-security.component';
import {Clients} from '../../../../../environments/Clients';
import {MicroCrgParams} from '../../../loan/model/MicroCrgParams';
import {MicroCustomerType} from '../../../../@core/model/enum/micro-customer-type';
import {NgxSpinnerService} from 'ngx-spinner';
import {ReviewDate} from '../../../loan/model/reviewDate';
import {MultiBanking} from '../../../loan/model/multiBanking';
import {CustomerService} from '../../service/customer.service';
import {Customer} from '../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Editor} from '../../../../@core/utils/constants/editor';
import {SecurityComponent} from '../../../loan-information-template/security/security.component';
import {BehaviorSubject} from 'rxjs';
import {GroupSummarySheetComponent} from '../../../loan-information-template/group-summary-sheet/group-summary-sheet.component';
import {CommonLoanInformationComponent} from './common-loan-information/common-loan-information.component';
import {SecuritiesType} from '../../../constants/securities-type';
import {MGroup} from '../../model/mGroup';
import {
    FinancialAccountInformationComponent
} from '../../../loan-information-template/financial-account-information/financial-account-information.component';
import {CompanyInfoService} from '../../../admin/service/company-info.service';

@Component({
    selector: 'app-customer-loan-information',
    templateUrl: './customer-loan-information.component.html',
    styleUrls: ['./customer-loan-information.component.scss']
})
export class CustomerLoanInformationComponent implements OnInit, OnChanges {
    @Input() public customerInfoId: number;
    @Input() public customerInfo: CustomerInfoData;
    @Input() public companyInfo: CompanyInfo;
    @Input() isMicroCustomer: boolean;
    @Input() fromProfile: boolean;

    @ViewChild('siteVisitComponent', {static: false})
    public siteVisitComponent: SiteVisitComponent;
    @ViewChild('itemSiteVisit', {static: false})
    private itemSiteVisit: NbAccordionItemComponent;
    @ViewChild('financialComponent', {static: false})
    public financialComponent: FinancialComponent;
    @ViewChild('itemFinancial', {static: false})
    private itemFinancial: NbAccordionItemComponent;
    /*@ViewChild('CrgAlphaComponent', {static: false})
    public CrgAlphaComponent: CreditRiskGradingAlphaComponent;
    @ViewChild('itemCrgAlpha', {static: false})
    private itemCrgAlpha: NbAccordionItemComponent;*/
    @ViewChild('CrgComponent', {static: false})
    public CrgComponent: CreditGradingComponent;
    @ViewChild('itemCrg', {static: false})
    private itemCrg: NbAccordionItemComponent;
    @ViewChild('CrgGammaComponent', {static: false})
    public CrgGammaComponent: CreditRiskGradingGammaComponent;
    @ViewChild('itemCrgGamma', {static: false})
    private itemCrgGamma: NbAccordionItemComponent;
    @ViewChild('itemSecurity', {static: false})
    private itemSecurity: NbAccordionItemComponent;
    @ViewChild('guarantorComponent', {static: false})
    public guarantorComponent: GuarantorComponent;
    @ViewChild('itemGuarantor', {static: false})
    private itemGuarantor: NbAccordionItemComponent;
    @ViewChild('itemInsurance', {static: false})
    private itemInsurance: NbAccordionItemComponent;
    @ViewChild('itemIncomeFromAccount', {static: false})
    private itemIncomeFromAccount: NbAccordionItemComponent;
    @ViewChild('itemNetTradingAssets', {static: false})
    private itemNetTradingAssets: NbAccordionItemComponent;
    @ViewChild('ciclComponent', {static: false})
    private itemCicl: NbAccordionItemComponent;
    @ViewChild('itemloanChecklist', {static: false})
    private itemloanChecklist: NbAccordionItemComponent;
    @ViewChild('synopsisAccordion', {static: false})
    private synopsisAccordion: NbAccordionItemComponent;
    @ViewChild('loanPortfolio', {static: false})
    private loanPortfolio: NbAccordionItemComponent;
    @ViewChild('borrowerLoanPortfolioComponent', {static: false})
    private borrowerLoanPortfolioComponent: NbAccordionItemComponent;
    @ViewChild('borrowerFinancialHighlight', {static: false})
    private borrowerFinancialHighlight: NbAccordionItemComponent;
    @ViewChild('reviewDate', {static: false})
    private reviewDate: ReviewDate;
    @ViewChild('multiBankingComponent', {static: false})
    private multiBankingComponent: MultiBanking;
    @ViewChild('gssComponent', {static: false})
    private gssComponent: GroupSummarySheetComponent;

    @ViewChild('microCrgParamsComponent', {static: false})
    private microCrgParamsComponent: NbAccordionItemComponent;

    @ViewChild('baselRiskAccordion', {static: false})
    private marketingActivitiesAccordian: NbAccordionItemComponent;
    @ViewChild('marketingActivitiesAccordian', {static: false})
    private baselRiskAccordion: NbAccordionItemComponent;
    @ViewChild('reportingInfoLevelAccordion', {static: false})
    public reportingInfoLevelAccordion: NbAccordionItemComponent;
    @ViewChild('reportingInfoTagging', {static: false})
    public reportingInfoTaggingComponent: ReportingInfoTaggingComponent;
    @Output() public triggerCustomerRefresh = new EventEmitter<boolean>();
    calendarType: CalendarType = CalendarType.AD;
    @ViewChild('commentsFromAccount', {static: false})
    private commentsFromAccount: NbAccordionItemComponent;
    @ViewChild('commentsInfoTagging', {static: false})
    public commentsComponent: CommentsComponent;
    @ViewChild('dataFromPreviousSecurity', {static: false})
    private dataFromPreviousSecurity: NbAccordionItemComponent;
    @ViewChild('previousSecurityInfoTagging', {static: false})
    public previousSecurityComponent: PreviousSecurityComponent;

    @ViewChild('securityComponent', {static: false})
    public securityComponent: SecurityComponent;
    @ViewChild('commonLoanInformation', {static: false})
    public commonLoanInformation: CommonLoanInformationComponent;
    @ViewChild('financialAccountInformation', {static: false})
    private financialAccountInformation: FinancialAccountInformationComponent;

    private siteVisit: SiteVisit;
    private financial: Financial;
    /*private creditRiskGradingAlpha: CreditRiskGradingAlpha;*/
    private creditRiskGrading: CreditRiskGrading;
    private crgGamma: CreditRiskGradingGamma;
    private security: Security;
    private shareSecurity: ShareSecurity;
    private guarantors: GuarantorDetail;
    public insurance: Array<Insurance>;
    public ciclResponse: CiclArray;
    public incomeFromAccountDataResponse: IncomeFromAccount;
    public netTradingAssets: NetTradingAssets;
    public creditChecklistGeneral: CreditChecklistGeneral;
    public microLoanSynopsis: MicroLoanSynopsis;
    public borrowerPortfolio: BorrowerPortfolio;
    public marketingActivities: MarketingActivities;
    public microBaselRiskExposure: MicroBaselRiskExposure;
    public microBorrowerFinancial: MicroBorrowerFinancial;
    public microCrgParams: MicroCrgParams;
    customerType = CustomerType;
    public reportingInfoLevels: Array<ReportingInfoLevel>;
    public reportingInfoLevelCode: string;
    public reportingInfoLevelDescription: string;
    public commentsDataResponse: Comments;
    public commentsData: string;
    public securityDataResponse: PreviousSecurity;
    private securityData: string;
    public reviewDateResponse: ReviewDate;
    public multiBankingResponse: MultiBanking;
    client = environment.client;
    clientName = Clients;
    checkedPreviousSecurity = false;
    checkedPreviousComments = false;
    microCustomerTypeEnum = MicroCustomerType;

    nbDialogRef: NbDialogRef<any>;
    customer: Customer;
    commonLoanData: FormGroup;
    ckeConfig;
    solChecked = false;
    waiverChecked = false;
    deviationChecked = false;
    riskChecked = false;
    commitmentChecked = false;
    swapDoubleChargeChecked = false;
    prepaymentChargeChecked = false;
    purposeChecked = false;
    debtChecked = false;
    netChecked = false;
    swapChargeChecked = false;
    subsidizedLoanChecked = false;
    reviewDateBoolean = false;

    consumerFinance = false;
    smallBusiness = false;
    deprivedSector = false;
    microFinancialService = false;
    private _securities = new BehaviorSubject<Security[]>([]);
    readonly securities$ = this._securities.asObservable();

    constructor(
        private toastService: ToastService,
        private customerInfoService: CustomerInfoService,
        private companyInfoService: CompanyInfoService,
        private customerService: CustomerService,
        private modalService: NbDialogService,
        private spinner: NgxSpinnerService,
        private nbService: NgbModal,
        private formBuilder: FormBuilder

    ) {
    }

    ngOnInit() {
        this.ckeConfig = Editor.CK_CONFIG;
        if (this.customerInfo.clientType === 'CONSUMER_FINANCE') {
            this.consumerFinance = true;
        } else if (this.customerInfo.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES') {
            this.smallBusiness = true;
        }
        if (this.customerInfo.clientType === 'DEPRIVED_SECTOR') {
            this.deprivedSector = true;
        }
        if (this.customerInfo.clientType === 'MICRO_FINANCIAL_SERVICES') {
            this.microFinancialService = true;
        }
        this.customerInfo.isMicroCustomer = this.isMicroCustomer;
        this.customerService.detail(this.customerInfo.associateId).subscribe((res) => {
            this.customer = res.detail;
        });
        if (!ObjectUtil.isEmpty(this.customerInfo.siteVisit)) {
            this.siteVisit = this.customerInfo.siteVisit;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.financial)) {
            this.financial = this.customerInfo.financial;
        }
        /*if (!ObjectUtil.isEmpty(this.customerInfo.creditRiskGradingAlpha)) {
          this.creditRiskGradingAlpha = this.customerInfo.creditRiskGradingAlpha;
        }*/
        if (!ObjectUtil.isEmpty(this.customerInfo.creditRiskGrading)) {
            this.creditRiskGrading = this.customerInfo.creditRiskGrading;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.crgGamma)) {
            this.crgGamma = this.customerInfo.crgGamma;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.insurance)) {
            this.insurance = this.customerInfo.insurance;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.guarantors)) {
            this.guarantors = this.customerInfo.guarantors;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.cicl)) {
            this.ciclResponse = this.customerInfo.cicl;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.incomeFromAccount)) {
            this.incomeFromAccountDataResponse = this.customerInfo.incomeFromAccount;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.netTradingAssets)) {
            this.netTradingAssets = this.customerInfo.netTradingAssets;
        }

        if (!ObjectUtil.isEmpty(this.customerInfo.creditChecklist)) {
            this.creditChecklistGeneral = this.customerInfo.creditChecklist;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.synopsisCreditworthiness)) {
            this.microLoanSynopsis = this.customerInfo.synopsisCreditworthiness;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.microBaselRiskExposure)) {
            this.microBaselRiskExposure = this.customerInfo.microBaselRiskExposure;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.borrowerPortFolio)) {
            this.borrowerPortfolio = this.customerInfo.borrowerPortFolio;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.marketingActivities)) {
            this.marketingActivities = this.customerInfo.marketingActivities;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.microBorrowerFinancial)) {
            this.microBorrowerFinancial = this.customerInfo.microBorrowerFinancial;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.microOtherParameters)) {
            this.microCrgParams = this.customerInfo.microOtherParameters;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.reportingInfoLevels)) {
            this.reportingInfoLevels = this.customerInfo.reportingInfoLevels;
            this.reportingInfoLevels.filter(f => {
                this.reportingInfoLevelCode = f.code;
                this.reportingInfoLevelDescription = f.description;
            });
        }
        if (this.customerInfo.clientType !== 'CONSUMER_FINANCE' && this.customerInfo.clientType !== 'SMALL_BUSINESS_FINANCIAL_SERVICES'
            && this.customerInfo.clientType !== 'DEPRIVED_SECTOR' && this.customerInfo.clientType !== 'MICRO_FINANCIAL_SERVICES') {
            this.reviewDateBoolean = true;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.data)) {
            this.commentsData = this.customerInfo.data;
            const jsonSec = JSON.parse(this.commentsData);
            const secParseJson = JSON.parse(jsonSec.data);
            if (!ObjectUtil.isEmpty(secParseJson)) {
                this.checkedPreviousComments = true;
            }
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.data)) {
            this.securityData = this.customerInfo.data;
            const jsonSec = JSON.parse(this.securityData);
            const secParseJson = JSON.parse(jsonSec.data);
            if (!ObjectUtil.isEmpty(secParseJson.securityDetails)) {
                this.checkedPreviousSecurity = true;
            }
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.reviewDate)) {
            this.reviewDateResponse = this.customerInfo.reviewDate;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.multiBanking)) {
            this.multiBankingResponse = this.customerInfo.multiBanking;
        }
        this.buildProposalCommonForm();
    }

    get otherMicroDetailsVisibility() {
        if (this.customerInfo.customerType === CustomerType.INDIVIDUAL && this.isMicroCustomer) {
            return true;
        } else {
            return this.customerInfo.customerType === CustomerType.INSTITUTION && this.isMicroCustomer &&
                this.companyInfo.microCustomerType === MicroCustomerType.DIRECT;
        }
    }

    public saveSiteVisit(data?: any) {
        if (ObjectUtil.isEmpty(this.siteVisit)) {
            this.siteVisit = new SiteVisit();
        }
        // this.siteVisit.data = data;
        this.customerInfoService.saveSiteVisitDataWithDocument(data)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved site visit!'));
                // this.itemSiteVisit.close();
                this.nbDialogRef.close();
                this.triggerCustomerRefresh.emit(true);
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save site visit!'));
            });
        /*this.customerInfoService.saveLoanInfo(this.siteVisit, this.customerInfoId, TemplateName.SITE_VISIT)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved site visit!'));
            // this.itemSiteVisit.close();
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save site visit!'));
        });*/
    }

    saveFinancial(data: string) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.financial)) {
            this.financial = new Financial();
        }
        this.financial.data = data;
        this.customerInfoService.saveLoanInfo(this.financial, this.customerInfoId, TemplateName.FINANCIAL)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Financial!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
            this.spinner.hide();
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Financial!'));
            this.spinner.hide();
        });
    }

    public saveSecurity(data: Security) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.security)) {
            this.security = new Security();
        }
        if (!ObjectUtil.isEmpty(data)) {
            let finalTemplate;
            let finalData;
            if (data.securityType === SecuritiesType.SHARE_SECURITY) {
                finalTemplate = TemplateName.SHARE_SECURITY;
                finalData = JSON.parse(data.data);
            } else {
                finalTemplate = TemplateName.SECURITY;
                finalData = data;
            }
            this.security = data;
            this.customerInfoService.saveLoanInfo(finalData, this.customerInfoId, finalTemplate)
                .subscribe((response: any) => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Security Data!'));
                    this.setSecurity(response.detail.securities);
                    this.triggerCustomerRefresh.emit();
                    this.securityComponent.securityInitialState();
                    this.spinner.hide();
                    this.nbDialogRef.close();
                }, error => {
                    this.spinner.hide();
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Security Data!'));
                });
        }
    }

    setSecurity(security: Array<Security>) {
        this._securities.next(security);
    }


    saveShare(data) {
        this.shareSecurity = data.share;
        this.customerInfoService.saveLoanInfo(this.shareSecurity, this.customerInfoId, TemplateName.SHARE_SECURITY)
        .subscribe(() => {
            this.spinner.hide();
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            this.spinner.hide();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Share Security!'));
        });
    }

    saveGuarantor(data: GuarantorDetail) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.guarantors)) {
            this.guarantors = new GuarantorDetail();
        }
        this.guarantors = data;
        this.customerInfoService.saveLoanInfo(this.guarantors, this.customerInfoId, TemplateName.GUARANTOR)
        .subscribe(() => {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Guarantor saved successfully !'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Guarantor !'));
        });
    }

    public saveInsurance(data: Array<Insurance>) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.insurance)) {
            this.insurance = new Array<Insurance>();
        }
        this.insurance = data;
        this.customerInfoService.saveLoanInfo(this.insurance, this.customerInfoId, TemplateName.INSURANCE)
        .subscribe(() => {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Insurance!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            this.spinner.hide();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Insurance!'));
        });
    }

    saveCrg(data: string) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.creditRiskGrading)) {
            this.creditRiskGrading = new CreditRiskGrading();
        }
        this.creditRiskGrading.data = data;
        this.customerInfoService.saveLoanInfo(this.creditRiskGrading, this.customerInfoId, TemplateName.CRG)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Credit Risk Grading!'));
            this.itemCrg.close();
            this.triggerCustomerRefresh.emit(true);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Successfully saved Credit Risk Grading!'));
        });
    }

    saveCrgGamma(data: string) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.crgGamma)) {
            this.crgGamma = new CreditRiskGradingGamma();
        }
        this.crgGamma.data = data;
        this.customerInfoService.saveLoanInfo(this.crgGamma, this.customerInfoId, TemplateName.CRG_GAMMA)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Credit Risk Grading (Gamma)!'));
            // this.itemCrgGamma.close();
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
            this.spinner.hide();
        }, error => {
            console.error(error);
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Successfully saved Credit Risk Grading (Gamma)!'));
        });
    }

    saveCICL(data: CiclArray) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.ciclResponse)) {
            this.ciclResponse = new CiclArray();
        }
        if (!ObjectUtil.isEmpty(data.cibRemark)) {
            if (!ObjectUtil.isEmpty(this.customer.jointInfo)) {
                const jointInfo = JSON.parse(this.customer.jointInfo);
                jointInfo.bankingRelationship = JSON.parse(data.cibRemark).bankingRelationship;
                this.customer.jointInfo = JSON.stringify(jointInfo);
            }
            if (this.customer.clientType !== 'INDIVIDUAL' && ObjectUtil.isEmpty(this.customer.jointInfo)) {
                if (!ObjectUtil.isEmpty(JSON.parse(data.cibRemark).bankingRelationship)) {
                    this.customer.bankingRelationship = JSON.parse(data.cibRemark).bankingRelationship;
                }
            }
            this.customer.bankingRelationship = JSON.stringify(JSON.parse(data.cibRemark).bankingRelationship);
        }
        this.customer.clientType = this.customerInfo.clientType;
        this.customer.maritalStatus = this.customerInfo.maritalStatus;
        this.customer.gender = this.customerInfo.gender;
        this.customerService.save(this.customer).subscribe(res => {
            this.ciclResponse = data;
            this.customerInfoService.saveLoanInfo(this.ciclResponse, this.customerInfoId, TemplateName.CICL)
                .subscribe(() => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved CICL!'));
                    // this.itemCicl.close();
                    this.nbDialogRef.close();
                    this.triggerCustomerRefresh.emit(true);
                    this.spinner.hide();
                }, error => {
                    this.spinner.hide();
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Successfully saved CICL)!'));
                });
        });
    }

    saveIncomeFromAccount(data: IncomeFromAccount) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
            this.incomeFromAccountDataResponse = new IncomeFromAccount();
        }
        this.incomeFromAccountDataResponse = data;
        this.customerInfoService.saveLoanInfo(this.incomeFromAccountDataResponse, this.customerInfoId, TemplateName.INCOME_FROM_ACCOUNT)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved EARNING, PROFITABILITY AND PRICING'));
            // this.itemIncomeFromAccount.close();
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save EARNING, PROFITABILITY AND PRICING)!'));
        });
    }

    saveNetTradingAssets(data: NetTradingAssets) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.netTradingAssets)) {
            this.netTradingAssets = new NetTradingAssets();
        }
        this.netTradingAssets = data;
        this.customerInfoService.saveLoanInfo(this.netTradingAssets, this.customerInfoId, TemplateName.NET_TRADING_ASSETS)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Net Trading Assets!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Net Trading Assets)!'));
        });
    }

    saveCreditChecklist(data: CreditChecklistGeneral) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.creditChecklistGeneral)) {
            this.creditChecklistGeneral = new CreditChecklistGeneral();
        }
        this.creditChecklistGeneral = data;
        this.customerInfoService.saveLoanInfo(this.creditChecklistGeneral, this.customerInfoId, TemplateName.CREDIT_CHECKlIST)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Credit Checklist!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
            this.spinner.hide();

        }, error => {
            this.spinner.hide();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Credit Checklist!'));
        });
    }

    saveSynopsisCreditworthiness(data: MicroLoanSynopsis) {
        if (ObjectUtil.isEmpty(this.microLoanSynopsis)) {
            this.microLoanSynopsis = new MicroLoanSynopsis();
        }
        this.microLoanSynopsis = data;
        this.customerInfoService.saveLoanInfo(this.microLoanSynopsis, this.customerInfoId, TemplateName.SYNOPSIS_CREDITWORTHINESS)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Synopsis Creditworthiness!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Synopsis Creditworthiness!'));
        });
    }

    saveBorrowerPortFolio(data: BorrowerPortfolio) {
        if (ObjectUtil.isEmpty(this.borrowerPortfolio)) {
            this.borrowerPortfolio = new BorrowerPortfolio();
        }
        this.borrowerPortfolio = data;
        this.customerInfoService.saveLoanInfo(this.borrowerPortfolio, this.customerInfoId, TemplateName.BORROWER_PORTFOLIO)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Borrower Portfolio!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save  Borrower Portfolio!'));
        });
    }

    saveBaselRiskExposure(data: MicroBaselRiskExposure) {
        if (ObjectUtil.isEmpty(this.microBaselRiskExposure)) {
            this.microBaselRiskExposure = new MicroBaselRiskExposure();
        }
        this.microBorrowerFinancial = data;
        this.customerInfoService.saveLoanInfo(this.microBorrowerFinancial, this.customerInfoId, TemplateName.BASEL_RISK_EXPOSURE)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Basel Wise Risk Exposure!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Basel Wise Risk Exposure!'));
        });
    }

    saveBorrowerFinancial(data: MicroBorrowerFinancial) {
        if (ObjectUtil.isEmpty(this.borrowerPortfolio)) {
            this.borrowerPortfolio = new BorrowerPortfolio();
        }
        this.borrowerPortfolio = data;
        this.customerInfoService.saveLoanInfo(this.borrowerPortfolio, this.customerInfoId, TemplateName.MICRO_BORROWER_FINANCIAL)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Borrower Portfolio!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save  Borrower Portfolio!'));
        });
    }

    saveMicroCrgParams(data: MicroCrgParams) {
        if (ObjectUtil.isEmpty(this.microCrgParams)) {
            this.microCrgParams = new MicroCrgParams();
        }
        this.microCrgParams = data;
        this.customerInfoService.saveLoanInfo(this.microCrgParams, this.customerInfoId, TemplateName.MICRO_OTHER_PARAMETERS)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Micro CRG Params!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Micro CRG Params!'));
        });
    }

    saveMarketingActivities(data: MarketingActivities) {
        if (ObjectUtil.isEmpty(this.marketingActivities)) {
            this.marketingActivities = new MarketingActivities();
        }
        this.marketingActivities = data;
        this.customerInfoService.saveLoanInfo(this.marketingActivities, this.customerInfoId, TemplateName.MARKETING_ACTIVITIES)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Marketing Activities!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Marketing Activities!'));
        });
    }

    saveCustomerReportingInfo(data: Array<ReportingInfoLevel>) {
        if (ObjectUtil.isEmpty(this.reportingInfoLevels)) {
            this.reportingInfoLevels = new Array<ReportingInfoLevel>();
        }
        this.reportingInfoLevels = data;
        this.customerInfoService.saveLoanInfo(this.reportingInfoLevels, this.customerInfoId, TemplateName.CUSTOMER_REPORTING_INFO)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully save Customer Reporting Info!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Customer Reporting Info!'));
        });
    }

    saveDataFromComments(data: Comments) {
        if (ObjectUtil.isEmpty(this.commentsDataResponse)) {
            this.commentsDataResponse = new Comments();
        }
        this.commentsDataResponse = data;
        this.customerInfoService.saveLoanInfo(this.commentsDataResponse, this.customerInfoId, TemplateName.COMMENTS)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Comments!'));
            this.nbDialogRef.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            this.nbDialogRef.close();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Comments)!'));
        });
    }

    saveDataFromSecurity(data: PreviousSecurity) {
        if (!ObjectUtil.isEmpty(this.securityDataResponse)) {
            this.securityDataResponse = new PreviousSecurity();
        }
        this.securityDataResponse = data;
        this.customerInfoService.saveLoanInfo(this.securityDataResponse, this.customerInfoId, TemplateName.PREVIOUS_SECURITY)
        .subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Previous Security'));
            this.dataFromPreviousSecurity.close();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Previous Security'));
        });
    }

    openModel(name: TemplateRef<any>) {
        this.nbDialogRef = this.modalService.open(name, {closeOnBackdropClick: false, closeOnEsc: false});
    }

    saveReviewDate(data) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.reviewDateResponse)) {
            this.reviewDateResponse = new ReviewDate();
        }
        this.reviewDateResponse = data;
        this.customerInfoService.saveLoanInfo(this.reviewDateResponse, this.customerInfoId, TemplateName.REVIEW_DATE)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Review Date!'));
                this.nbDialogRef.close();
                this.triggerCustomerRefresh.emit(true);
                this.spinner.hide();
            }, error => {
                this.spinner.hide();
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Review Date!'));
            });
    }

    saveMultiBanking(data) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.multiBankingResponse)) {
            this.multiBankingResponse = new MultiBanking();
        }
        this.multiBankingResponse = data;
        this.customerInfoService.saveLoanInfo(this.multiBankingResponse, this.customerInfoId, TemplateName.MULTI_BANKING)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Multi Banking!'));
                this.nbDialogRef.close();
                this.triggerCustomerRefresh.emit(true);
                this.spinner.hide();
            }, error => {
                this.spinner.hide();
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Multi Banking!'));
            });
    }

    saveGssData(data) {
        let mGroup = new MGroup();
        this.spinner.show();
        if (!ObjectUtil.isEmpty(this.customerInfo.mgroupInfo)) {
            mGroup = this.customerInfo.mgroupInfo;
        }
        if (!ObjectUtil.isEmpty(data)) {
            mGroup.groupCode = data.groupCode;
            mGroup.detailInformation = data.otherDetail;
            mGroup.customerInfoId = this.customerInfo.id;
            this.customerInfo.mgroupInfo = mGroup;
            this.customerInfoService.save(this.customerInfo)
                .subscribe(() => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Group Summary Sheet!'));
                    this.nbDialogRef.close();
                    this.triggerCustomerRefresh.emit(true);
                    this.spinner.hide();
                }, error => {
                    this.spinner.hide();
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Group Summary Sheet!'));
                });
        }
    }

    saveOthersData(data) {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(data)) {
            this.customerInfo.otherDetails = data;
            this.customerInfoService.save(this.customerInfo)
                .subscribe(() => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Other Details!'));
                    this.nbDialogRef.close();
                    this.triggerCustomerRefresh.emit(true);
                    this.spinner.hide();
                }, error => {
                    this.spinner.hide();
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Other Details!'));
                });
        }
    }
    financialAssessmentSave(data) {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(data)) {
            this.customerInfo.financialAssessmentData = data;
            this.customerInfoService.save(this.customerInfo).subscribe(() => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved financial assessment!'));
                    this.nbDialogRef.close();
                    this.triggerCustomerRefresh.emit(true);
                    this.spinner.hide();
                }, error => {
                    this.spinner.hide();
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save financial assessment!'));
                });
        }
    }
    update(data) {
        this.customerInfo = data;
    }

    buildProposalCommonForm() {
        this.commonLoanData = this.formBuilder.group({
            borrowerInformation: [undefined],
            disbursementCriteria: [undefined],
            repayment: [undefined],
            remark: [undefined],
            summeryRecommendation: [undefined],
            waiverConclusionRecommendation: [undefined],
            deviationConclusionRecommendation: [undefined],
            solConclusionRecommendation: [undefined],
            riskConclusionRecommendation: [undefined],
            termsAndCondition: [undefined],
            mergedCheck: [undefined],
            shares: this.formBuilder.array([]),
            realState: this.formBuilder.array([]),
            vehicle: this.formBuilder.array([]),
            deposit: this.formBuilder.array([]),
            depositBank: [undefined],
            depositOther: [undefined],
            depositBankRemark: [undefined],
            depositOtherRemark: [undefined],
            total: [undefined],
            totals: [undefined],
        });
        if (!ObjectUtil.isEmpty(this.customerInfo.commonLoanData)) {
            const commonData = JSON.parse(this.customerInfo.commonLoanData);
            this.commonLoanData.patchValue(commonData);
            this.setCheckedData(JSON.parse(this.commonLoanData.get('mergedCheck').value));
            if (!ObjectUtil.isEmpty(commonData.vehicle)) {
                this.setFormData(commonData.vehicle, 'vehicle');
            } else {
                this.addKeyValue('vehicle');
            }
            if (!ObjectUtil.isEmpty(commonData.realState)) {
                this.setFormData(commonData.realState, 'realState');
            } else {
                this.addKeyValue('realState');
            }
            if (!ObjectUtil.isEmpty(commonData.shares)) {
                this.setFormData(commonData.shares, 'shares');
            } else {
                this.addKeyValue('shares');
            }
            if (!ObjectUtil.isEmpty(commonData.deposit)) {
                this.setFormData(commonData.deposit, 'deposit');
            } else {
                this.addKeyValue('deposit');
            }
        }
    }

    openCadSetup(data) {
        this.nbService.open(data, {size: 'xl', backdrop: true});
    }
    checkChecked(event, type) {
        switch (type) {
            case 'sol':
                if (event) {
                    this.solChecked = true;
                } else {
                    this.solChecked = false;
                    this.commonLoanData.get('solConclusionRecommendation').setValue(null);
                }
                break;
            case 'waiver':
                if (event) {
                    this.waiverChecked = true;
                } else {
                    this.waiverChecked = false;
                    this.commonLoanData.get('waiverConclusionRecommendation').setValue(null);
                }
                break;
            case 'risk':
                if (event) {
                    this.riskChecked = true;
                } else {
                    this.riskChecked = false;
                    this.commonLoanData.get('riskConclusionRecommendation').setValue(null);
                }
                break;
            case 'deviation':
                if (event) {
                    this.deviationChecked = true;
                } else {
                    this.deviationChecked = false;
                    this.commonLoanData.get('deviationConclusionRecommendation').setValue(null);
                }
                break;
            case 'commitment': {
                this.commitmentChecked = event;
            }
                break;
            case 'swapDoubleCharge': {
                this.swapDoubleChargeChecked = event;
            }
                break;
            case 'prepayment': {
                this.prepaymentChargeChecked = event;
            }
                break;
            case 'purpose': {
                this.purposeChecked = event;
            }
                break;
            case 'debt': {
                this.debtChecked = event;
            }
                break;
            case 'net': {
                this.netChecked = event;
            }
                break;
        }
    }

    saveCommonLoanData() {
        this.spinner.show();
        const mergeChecked = {
            solChecked: this.solChecked,
            waiverChecked: this.waiverChecked,
            riskChecked: this.riskChecked,
            swapChargeChecked: this.swapChargeChecked,
            subsidizedLoanChecked: this.subsidizedLoanChecked,
            deviationChecked: this.deviationChecked,
            commitmentChecked: this.commitmentChecked,
            swapDoubleChargeChecked: this.swapDoubleChargeChecked,
            prepaymentChargeChecked: this.prepaymentChargeChecked,
            purposeChecked: this.purposeChecked,
            debtChecked: this.debtChecked,
            netChecked: this.netChecked,
        };
        this.commonLoanData.patchValue({
            mergedCheck: JSON.stringify(mergeChecked)
        });
        this.customerInfo.commonLoanData = JSON.stringify(this.commonLoanData.value);
        this.customerInfoService.save(this.customerInfo).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved  Common Data!'));
            this.customerInfo = res.detail;
            this.nbDialogRef.close();
            this.spinner.hide();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.DANGER, 'Some thing Went Wrong'));
        });
    }
    setCheckedData(data) {
        if (!ObjectUtil.isEmpty(data)) {
            this.checkChecked(data['solChecked'], 'sol');
            this.checkChecked(data['waiverChecked'], 'waiver');
            this.checkChecked(data['riskChecked'], 'risk');
            this.checkChecked(data['swapChargeChecked'], 'swapCharge');
            this.checkChecked(data['subsidizedLoanChecked'], 'subsidizedLoan');
            this.checkChecked(data['deviationChecked'], 'deviation');
            this.checkChecked(data['commitmentChecked'], 'commitment');
            this.checkChecked(data['swapDoubleChargeChecked'], 'swapDoubleCharge');
            this.checkChecked(data['prepaymentChargeChecked'], 'prepayment');
            this.checkChecked(data['purposeChecked'], 'purpose');
            this.checkChecked(data['debtChecked'], 'debt');
            this.checkChecked(data['netChecked'], 'net');
        }
    }
    removeValue(formControl: string, index: number) {
        (<FormArray>this.commonLoanData.get(formControl)).removeAt(index);
    }
    addKeyValue(formControl: string) {
        (this.commonLoanData.get(formControl) as FormArray).push(
            this.formBuilder.group({
                assets: undefined,
                amount: 0,
            })
        );
    }
    calculate() {
        let total = this.commonLoanData.get('depositBank').value + this.commonLoanData.get('depositOther').value;
        total += this.getArrayTotal('shares');
        total += this.getArrayTotal('vehicle');
        total += this.getArrayTotal('realState');
        total += this.getArrayTotal('deposit');
        this.commonLoanData.get('total').patchValue(total);
    }
    getArrayTotal(formControl): number {
        let total = 0;
        (this.commonLoanData.get(formControl).value).forEach((d, i) => {
            total += d.amount;
        });
        return total;
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.buildProposalCommonForm();
    }
    setFormData(data, formControl) {
        const form = this.commonLoanData.get(formControl) as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(l => {
                form.push(this.formBuilder.group({
                    assets: [l.assets],
                    amount: [l.amount]
                }));
            });
        }
    }

    onRefresh() {
        this.triggerCustomerRefresh.emit();
        this.nbDialogRef.close();
        this.ngOnInit();
    }

    saveCustomerInfo() {
        this.spinner.show();
        this.customerInfoService.save(this.customerInfo).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved  Common Data!'));
            this.customerInfo = res.detail;
            this.nbDialogRef.close();
            this.onRefresh();
            this.spinner.hide();
            this.triggerCustomerRefresh.emit(true);
        }, error => {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.DANGER, 'Some thing Went Wrong'));
        });
    }

    saveAccount(data) {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(data)) {
            this.customerInfo.accountStrategy = data;
            this.customerInfoService.save(this.customerInfo).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY SAVED ACCOUNT STRATEGY'));
                this.nbDialogRef.close();
                this.onRefresh();
                this.triggerCustomerRefresh.emit(true);
                this.spinner.hide();
            }, res => {
                this.spinner.hide();
                this.toastService.show(new Alert(AlertType.DANGER, 'Some thing Went Wrong'));
            });
        }
    }
}
