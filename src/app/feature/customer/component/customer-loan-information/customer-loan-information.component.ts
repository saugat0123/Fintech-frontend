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
import {BorrowerPortfolio} from '../../../loan/model/borrwerportfolio';
import {MarketingActivities} from '../../../loan/model/marketing-activities';
import {ReportingInfoLevel} from '../../../reporting/model/reporting-info-level';
import {ReportingInfoTaggingComponent} from '../../../reporting/component/reporting-info-tagging/reporting-info-tagging.component';
import {Comments} from '../../../admin/modal/comments';
import {CommentsComponent} from '../../../loan-information-template/comments/comments.component';
import {PreviousSecurity} from '../../../admin/modal/previousSecurity';
import {PreviousSecurityComponent} from '../../../loan-information-template/previous-security/previous-security.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ActivatedRoute} from '@angular/router';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {InstitutionalCrgGammaComponent} from '../../../loan-information-template/institutional-crg-gamma/institutional-crg-gamma.component';
import {CustomerService} from '../../service/customer.service';
import {Customer} from '../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';
import {MultipleBanking} from '../../../admin/modal/multipleBanking';
import {RiskAnalysisComponent} from '../customer-form/company-form/risk-analysis/risk-analysis.component';
import {MultipleBankingComponent} from '../../../loan-information-template/multiple-banking/multiple-banking.component';
import {CompanyInfoService} from '../../../admin/service/company-info.service';
import {SwotAnalysisComponent} from '../../../loan-information-template/swot-analysis/swot-analysis.component';
import {NetWorthComponent} from '../net-worth/net-worth.component';

@Component({
    selector: 'app-customer-loan-information',
    templateUrl: './customer-loan-information.component.html',
    styleUrls: ['./customer-loan-information.component.scss']
})
export class CustomerLoanInformationComponent implements OnInit, OnChanges {
    @Input() public customerInfoId: number;
    @Input() public customerInfo: CustomerInfoData;
    @Input() public companyInfo: CompanyInfo;

    @ViewChild('siteVisitComponent', {static: false})
    public siteVisitComponent: SiteVisitComponent;
    @ViewChild('itemSiteVisit', {static: false})
    private itemSiteVisit: NbAccordionItemComponent;
    @ViewChild('financialComponent', {static: false})
    public financialComponent: FinancialComponent;
    @ViewChild('itemFinancial', {static: false})
    private itemFinancial: NbAccordionItemComponent;
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
    @ViewChild('institutionalCrgGamma', {static: false})
    public institutionalCrgGamma: InstitutionalCrgGammaComponent;
    @ViewChild('multipleBankingComponent', {static: false})
    public multipleBankingComponent: MultipleBankingComponent;
    @ViewChild('riskAnalysisComponent', {static: false})
    public riskAnalysisComponent: RiskAnalysisComponent;
    @ViewChild('swotAnalysisComponent', {static: false})
    public swotAnalysisComponent: SwotAnalysisComponent;
    @ViewChild('netWorth', {static: false})
    public netWorthComponent: NetWorthComponent;

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
    public borrowerPortfolio: BorrowerPortfolio;
    public marketingActivities: MarketingActivities;
    customerType = CustomerType;
    public reportingInfoLevels: Array<ReportingInfoLevel>;
    public reportingInfoLevelCode: string;
    public reportingInfoLevelDescription: string;
    public commentsDataResponse: Comments;
    public commentsData: string;
    public securityDataResponse: PreviousSecurity;
    private securityData: string;
    private gammaData: string;
    checkedPreviousSecurity = false;
    checkedPreviousComments = false;
    checkCrgGamma = false;
    submittedCheck: boolean;
    multiBankingResponse: MultipleBanking;
      nbDialogRef: NbDialogRef<any>;
      customer: Customer;
    commonLoanData: FormGroup;
    ckeConfig;
    waiverChecked = false;
    commitmentChecked = false;
    swapDoubleChargeChecked = false;
    prepaymentChargeChecked = false;
    purposeChecked = false;
    netChecked = false;
    swapChargeChecked = false;
    subsidizedLoanChecked = false;
    loanDocument: LoanDataHolder;
    loanTag: string;
    reviewDate;
    groupTable = '<table class="table table-sm table-condensed table-bordered table-responsive-md text-center table-sm sb-small" border="1" cellpadding="1" cellspacing="1" style="width:1000px"><thead><tr><th scope="col">S. No.</th><th scope="col">Details of Waivers and Deviation</th><th scope="col">Justification for Waiver</th></tr></thead><tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><p>&nbsp;</p>';

    constructor(
        private toastService: ToastService,
        private customerInfoService: CustomerInfoService,
        private customerService: CustomerService,
        private modalService: NbDialogService,
        private spinner: NgxSpinnerService,
        private loanFormService: LoanFormService,
        private route: ActivatedRoute,
        private loanConfigService: LoanConfigService,
        private formBuilder: FormBuilder,
        private companyInfoService: CompanyInfoService

    ) {
    }

    ngOnInit() {
        this.ckeConfig = Editor.CK_CONFIG;
        this.customerService.detail(this.customerInfo.associateId).subscribe((res) => {
            this.customer = res.detail;
        });
        if (!ObjectUtil.isEmpty(this.customerInfo.siteVisit)) {
            this.siteVisit = this.customerInfo.siteVisit;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.financial)) {
            this.financial = this.customerInfo.financial;
        }

        if (!ObjectUtil.isEmpty(this.customerInfo.creditRiskGrading)) {
            this.creditRiskGrading = this.customerInfo.creditRiskGrading;
        }

        if (!ObjectUtil.isEmpty(this.customerInfo.security)) {
            this.security = this.customerInfo.security;
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

        if (!ObjectUtil.isEmpty(this.customerInfo.borrowerPortFolio)) {
            this.borrowerPortfolio = this.customerInfo.borrowerPortFolio;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.marketingActivities)) {
            this.marketingActivities = this.customerInfo.marketingActivities;
        }

        if (!ObjectUtil.isEmpty(this.customerInfo.reportingInfoLevels)) {
            this.reportingInfoLevels = this.customerInfo.reportingInfoLevels;
            this.reportingInfoLevels.filter(f => {
                this.reportingInfoLevelCode = f.code;
                this.reportingInfoLevelDescription = f.description;
            });
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.multiBanking)) {
            this.multiBankingResponse = this.customerInfo.multiBanking;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.data)) {
            this.commentsData = this.customerInfo.data;
            const jsonSec = JSON.parse(this.commentsData);
            const secParseJson = JSON.parse(jsonSec.data);
            if (!ObjectUtil.isEmpty(secParseJson.previousComments) || !ObjectUtil.isEmpty(secParseJson.previousComments)) {
                this.checkedPreviousComments = true;
            }
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.crgGamma)) {
            this.gammaData = this.customerInfo.crgGamma.data;
            const jsonSec = JSON.parse(this.gammaData);
            if (!ObjectUtil.isEmpty(jsonSec.totalPoint)) {
                this.checkCrgGamma = true;
            }
        }

        this.route.queryParamMap.subscribe((q: any) => {
            this.loanConfigService.detail(q.get('id')).subscribe(s => {
                this.loanTag = s.detail.loanTag;
            });

            this.loanFormService.detail(q.get('id')).subscribe(
                (response: any) => {
                    this.loanDocument = response.detail;

                });
        });
        if (!ObjectUtil.isEmpty(this.companyInfo)) {
            const mapData = JSON.parse(this.companyInfo.companyJsonData);
            this.reviewDate = mapData.reviewDate;
        }


    }

    public saveSiteVisit(data: string) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.siteVisit)) {
            this.siteVisit = new SiteVisit();
        }
        this.siteVisit.data = data;
        this.customerInfoService.saveLoanInfo(this.siteVisit, this.customerInfoId, TemplateName.SITE_VISIT)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved site visit!'));
                // this.itemSiteVisit.close();
                this.nbDialogRef.close();
                this.triggerCustomerRefresh.emit(true);
                this.spinner.hide();
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save site visit!'));
                this.spinner.hide();
            });
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
            this.security.data = data.data;
            this.security.totalSecurityAmount = data.totalSecurityAmount;
            this.customerInfoService.saveLoanInfo(this.security, this.customerInfoId, TemplateName.SECURITY)
                .subscribe(() => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Security Data!'));
                    if (!ObjectUtil.isEmpty(data.share)) {
                        this.saveShare(data);
                    } else {
                        this.triggerCustomerRefresh.emit(true);
                        this.nbDialogRef.close();
                    }
                    this.spinner.hide();
                }, error => {
                    this.spinner.hide();
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Security Data!'));
                });
        }
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

    /*saveCrgAlpha(data: string) {
      if (ObjectUtil.isEmpty(this.creditRiskGradingAlpha)) {
        this.creditRiskGradingAlpha = new CreditRiskGradingAlpha();
      }
      this.creditRiskGradingAlpha.data = data;
      this.customerInfoService.saveLoanInfo(this.creditRiskGradingAlpha, this.customerInfoId, TemplateName.CRG_ALPHA)
      .subscribe(() => {
        this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Credit Risk Grading (Alpha)!'));
        this.itemCrgAlpha.close();
        this.triggerCustomerRefresh.emit(true);
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Successfully saved Credit Risk Grading (Alpha)!'));
      });
    }*/

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
                this.triggerCustomerRefresh.emit(true);
                this.nbDialogRef.close();
                this.spinner.hide();
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Successfully saved Credit Risk Grading (Gamma)!'));
                this.spinner.hide();

            });
    }

    saveNetWorth(data: any) {
        this.spinner.show();
        this.customerInfoService.saveLoanInfo(JSON.stringify(data), this.customerInfoId,
            TemplateName.NET_WORTH).subscribe(rs => {
            this.spinner.hide();
            this.nbDialogRef.close();
        }, err=>{
                this.spinner.hide();
        });
    }

    saveCICL(data: CiclArray) {
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.ciclResponse)) {
            this.ciclResponse = new CiclArray();
        }
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
        this.spinner.show();
        if (ObjectUtil.isEmpty(this.commentsDataResponse)) {
            this.commentsDataResponse = new Comments();
        }
        this.commentsDataResponse = data;
        this.customerInfoService.saveLoanInfo(this.commentsDataResponse, this.customerInfoId, TemplateName.COMMENTS)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved Comments!'));
                this.nbDialogRef.close();
                this.triggerCustomerRefresh.emit(true);
                this.spinner.hide();
            }, error => {
                this.nbDialogRef.close();
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Comments)!'));
                this.spinner.hide();
            });
    }

    saveDataFromSecurity(data: PreviousSecurity) {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(this.securityDataResponse)) {
            this.securityDataResponse = new PreviousSecurity();
        }
        this.securityDataResponse = data;
        this.customerInfoService.saveLoanInfo(this.securityDataResponse, this.customerInfoId, TemplateName.PREVIOUS_SECURITY)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Previous Security'));
                this.nbDialogRef.close();
                this.triggerCustomerRefresh.emit(true);
                this.spinner.hide();
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save Previous Security'));
                this.spinner.hide();
            });
    }

    saveMultiBanking(data: MultipleBanking) {
    this.spinner.show();
        if (!ObjectUtil.isEmpty(this.multiBankingResponse)) {
            this.multiBankingResponse = new MultipleBanking();
        }
        this.multiBankingResponse = data;
        this.customerInfoService.saveLoanInfo(this.multiBankingResponse, this.customerInfoId, TemplateName.MULTI_BANKING)
            .subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved multiple banking/consortium'));
                this.nbDialogRef.close();
                this.triggerCustomerRefresh.emit(true);
                this.spinner.hide();
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save multiple banking/consortium'));
                this.spinner.hide();
            });
    }
    saveRiskAnalysis(data: string) {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(data)) {
            this.customerInfo.riskAnalysis = data;
            this.customerInfoService.save(this.customerInfo)
                .subscribe(() => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved risk analysis'));
                    this.triggerCustomerRefresh.emit(true);
                    this.nbDialogRef.close();
                    this.spinner.hide();
                }, error => {
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save risk analysis'));
                    this.spinner.hide();
                });
        }
    }
    saveSwotAnalysis(data: string) {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(data)) {
            this.customerInfo.swotAnalysis = data;
            this.customerInfoService.save(this.customerInfo)
                .subscribe(() => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved swot analysis'));
                    this.triggerCustomerRefresh.emit(true);
                    this.nbDialogRef.close();
                    this.spinner.hide();
                }, error => {
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save swot analysis'));
                    this.spinner.hide();
                });
        }
    }

    buildProposalCommonForm() {
        this.commonLoanData = this.formBuilder.group({
            borrowerInformation: [undefined],
            disbursementCriteria: [undefined],
            repayment: [undefined],
            remark: [undefined],
            summeryRecommendation: [undefined],
            approvingAuthority: [undefined],
            specialCovenant: [undefined],
            waiverConclusionRecommendation: [undefined],
            mergedCheck: [undefined],
            solText: [undefined],
        });
        if (!ObjectUtil.isEmpty(this.customerInfo.commonLoanData)) {
            const commonData = JSON.parse(this.customerInfo.commonLoanData);
            this.commonLoanData.patchValue(commonData);
            this.setCheckedData(JSON.parse(this.commonLoanData.get('mergedCheck').value));
        }
    }

    openModel(name: TemplateRef<any>) {
        this.nbDialogRef = this.modalService.open(name, {closeOnBackdropClick: false, closeOnEsc: false});
    }

    checkChecked(event, type) {
        switch (type) {
            case 'waiver':
                if (event) {
                    this.waiverChecked = true;
                } else {
                    this.waiverChecked = false;
                    this.commonLoanData.get('waiverConclusionRecommendation').patchValue(this.groupTable);
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
            case 'net': {
                this.netChecked = event;
            }
                break;
        }
    }

    saveCommonLoanData() {
        this.spinner.show();
        const mergeChecked = {
            swapChargeChecked: this.swapChargeChecked,
            subsidizedLoanChecked: this.subsidizedLoanChecked,
            commitmentChecked: this.commitmentChecked,
            swapDoubleChargeChecked: this.swapDoubleChargeChecked,
            prepaymentChargeChecked: this.prepaymentChargeChecked,
            purposeChecked: this.purposeChecked,
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
            this.checkChecked(data['swapChargeChecked'], 'swapCharge');
            this.checkChecked(data['subsidizedLoanChecked'], 'subsidizedLoan');
            this.checkChecked(data['commitmentChecked'], 'commitment');
            this.checkChecked(data['swapDoubleChargeChecked'], 'swapDoubleCharge');
            this.checkChecked(data['prepaymentChargeChecked'], 'prepayment');
            this.checkChecked(data['purposeChecked'], 'purpose');
            this.checkChecked(data['netChecked'], 'net');
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.buildProposalCommonForm();
    }


    saveReviewDate(data: string) {
        this.spinner.show();
        if (!ObjectUtil.isEmpty(data)) {
            const existingDetails = JSON.parse(this.companyInfo.companyJsonData);
            existingDetails['reviewDate'] = data;
            this.companyInfo.companyJsonData = JSON.stringify(existingDetails);
            this.companyInfoService.save(this.companyInfo).subscribe((res) => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved review dates'));
                    this.triggerCustomerRefresh.emit(true);
                    this.nbDialogRef.close();
                    this.spinner.hide();
                }, error => {
                    console.error(error);
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save review dates'));
                    this.spinner.hide();
                });
        }
    }

    submittedCheck1(event) {
        this.submittedCheck = event;
    }

}
