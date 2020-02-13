import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgxPrintModule} from 'ngx-print';
import {LoanRoutingModule} from './loan-routing.module';
import {LoanFormComponent} from './component/loan-form/loan-form.component';
import {BasicInfoComponent} from './component/loan-main-template/basic-info/basic-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbActiveModal, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {CompanyInfoComponent} from './component/loan-main-template/company-info/company-info.component';
import {KycInfoComponent} from './component/loan-main-template/kyc-info/kyc-info.component';
import {DmsLoanFileComponent} from './component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {SecurityComponent} from './component/loan-main-template/security/security.component';
import {NbDatepickerModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {LoanActionComponent} from './loan-action/loan-action.component';
import {LoanFormService} from './component/loan-form/service/loan-form.service';
import {LoanSummaryComponent} from './component/loan-summary/loan-summary.component';
import {FinancialComponent} from './component/loan-main-template/financial/financial.component';
import {BirthMarkLetterNepaliComponent} from './component/offer-letter/birth-mark-letter/birth-mark-letter-nepali.component';
// tslint:disable-next-line:max-line-length
import {BirthMarkLetterPrintComponent} from './component/offer-letter/birth-mark-letter/birth-mark-letter-print/birth-mark-letter-print.component';
import {SuccessOfferLetterComponent} from './component/offer-letter/success-offer-letter/success-offer-letter.component';
// tslint:disable-next-line:max-line-length
import {SuccessOfferLetterPrintComponent} from './component/offer-letter/success-offer-letter/success-offer-letter-print/success-offer-letter-print.component';
import {ProposalComponent} from './component/loan-main-template/proposal/proposal.component';
import {CiclComponent} from './component/loan-main-template/cicl/cicl.component';
import {ReadmoreModelComponent} from './component/readmore-model/readmore-model.component';
import {CreditGradingComponent} from './component/loan-main-template/credit-grading/credit-grading.component';
import {CoreModule} from '../../@core/core.module';
import {BorrowerRiskRatingComponent} from './component/loan-main-template/financial/borrower-risk-rating/borrower-risk-rating.component';
import {environment} from '../../../environments/environment';
import {SiteVisitComponent} from './component/loan-main-template/site-visit/site-visit.component';
import {AgmCoreModule} from '@agm/core';
import {IncomeStatementComponent} from './component/loan-main-template/financial/income-statement/income-statement.component';
import {BalanceSheetComponent} from './component/loan-main-template/financial/balance-sheet/balance-sheet.component';
import {CashFlowStatementComponent} from './component/loan-main-template/financial/cash-flow-statement/cash-flow-statement.component';
import {KeyIndicatorsComponent} from './component/loan-main-template/financial/key-indicators/key-indicators.component';
import {InitialFormComponent} from './component/loan-main-template/financial/initial-form/initial-form.component';
import {LoanPullComponent} from './component/loan-pull/loan-pull.component';
import {FinancialSummaryComponent} from './component/loan-summary/financial-summary/financial-summary.component';
// tslint:disable-next-line:max-line-length
import {SecurityInitialFormComponent} from './component/loan-main-template/security/security-initial-form/security-initial-form.component';
import {SecuritySummaryComponent} from './component/loan-summary/security-summary/security-summary.component';
import {CustomerDocumentComponent} from './component/loan-main-template/customer-document/customer-document.component';

import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {OfferLetterActionComponent} from './loan-offer-letter/offer-letter-action/offer-letter-action.component';
import {OfferLetterUploadComponent} from './component/offer-letter/offer-letter-upload/offer-letter-upload.component';
import {OfferLetterComponent} from './component/offer-letter/offer-letter.component';
import {SitevistSummaryComponentComponent} from './component/loan-summary/sitevist-summary-component/sitevist-summary-component.component';
import {GroupComponent} from './component/loan-main-template/group/group.component';
import {GroupDetailComponent} from './component/loan-main-template/group/group-detail/group-detail.component';
import {SecurityDetailComponent} from './component/loan-main-template/group/security-detail/security-detail.component';
import {VehicleSecurityComponent} from './component/loan-main-template/vehicle-security/vehicle-security.component';
import {ShareSecurityComponent} from './component/loan-main-template/share-security/share-security.component';
import {ShareSecuritySummaryComponent} from './component/loan-summary/share-security-summary/share-security-summary.component';
import {DhitoLikhatManjurinamaComponent} from './component/offer-letter/dhito-likhat-manjurinama/dhito-likhat-manjurinama.component';
import {DhristiBandhakComponent} from './component/offer-letter/dhristi-bandhak/dhristi-bandhak.component';
import {JamaniTamsukComponent} from './component/offer-letter/jamani-tamsuk/jamani-tamsuk.component';
import {KararnamaComponent} from './component/offer-letter/kararnama/kararnama.component';
import {KarjatamsukComponent} from './component/offer-letter/karjatamsuk/karjatamsuk.component';
import {ManjurinamaComponent} from './component/offer-letter/manjurinama/manjurinama.component';
import {PratigyaPatraComponent} from './component/offer-letter/pratigya-patra/pratigya-patra.component';
import {LoanMainNepaliTemplateComponent} from './component/loan-main-nepali-template/loan-main-nepali-template.component';
import {FiscalYearModalComponent} from './component/loan-main-template/financial/fiscal-year-modal/fiscal-year-modal.component';
import {CustomerInfoNepaliComponent} from './component/loan-main-nepali-template/customer-info-nepali/customer-info-nepali.component';
import {DhitoLikhatPrintComponent} from './component/offer-letter/dhito-likhat-manjurinama/dhito-likhat-print/dhito-likhat-print.component';
import {ApplicantFamilyInfoComponent} from './component/loan-main-nepali-template/applicant-family-info/applicant-family-info.component';
import {KarjaTamsukPrintComponent} from './component/offer-letter/karjatamsuk/karja-tamsuk-print/karja-tamsuk-print.component';
import {KararnamaPrintComponent} from './component/offer-letter/kararnama/kararnama-print/kararnama-print.component';
import {DhristiBandhakPrintComponent} from './component/offer-letter/dhristi-bandhak/dhristi-bandhak-print/dhristi-bandhak-print.component';
import {ManjurinamaLetterPrintComponent} from './component/offer-letter/manjurinama/manjurinama-letter-print/manjurinama-letter-print.component';
import {JamaniBasekoComponent} from './component/loan-main-nepali-template/jamani-baseko/jamani-baseko.component';
import {JamaniBasekoPrintComponent} from './component/loan-main-nepali-template/jamani-baseko/jamani-baseko-print/jamani-baseko-print.component';
import {BikeKarjaComponent} from './component/loan-main-nepali-template/bike-karja/bike-karja.component';
import {HayarParchesKarjaNibedanComponent} from './component/loan-main-nepali-template/hayar-parches-karja-nibedan/hayar-parches-karja-nibedan.component';
import { PratigyaPatraPrintComponent } from './component/offer-letter/pratigya-patra/pratigya-patra-print/pratigya-patra-print.component';
import { MawCreditRiskGradingComponent } from './component/loan-main-template/maw-credit-risk-grading/maw-credit-risk-grading.component';
import { AllTemplateDetailsComponent } from './component/loan-summary/all-template-details/all-template-details.component';
import { CompanyInfoDetailsComponent } from './component/loan-summary/all-template-details/company-info-details/company-info-details.component';
import { CustomerDetailsInformationComponent } from './component/loan-summary/all-template-details/customer-details-information/customer-details-information.component';
import { FinancialDetailsComponent } from './component/loan-summary/all-template-details/financial-details/financial-details.component';
import { ProposalDetailsComponent } from './component/loan-summary/all-template-details/proposal-details/proposal-details.component';
import { SiteVisitDetailsComponent } from './component/loan-summary/all-template-details/site-visit-details/site-visit-details.component';
import { SecurityDetailsComponent } from './component/loan-summary/all-template-details/security-details/security-details.component';

import {JamaniTamsukLetterPrintComponent} from './component/offer-letter/jamani-tamsuk/jamani-tamsuk-letter-print/jamani-tamsuk-letter-print.component';
import { ApplicantFamilyInfoPrintComponent } from './component/loan-main-nepali-template/applicant-family-info/applicant-family-info-print/applicant-family-info-print.component';
import { BikeKarjaPrintComponent } from './component/loan-main-nepali-template/bike-karja/bike-karja-print/bike-karja-print.component';
import { CustomerAssociateComponent } from './component/loan-main-template/customer-associate/customer-associate.component';
import {CustomerModule} from '../customer/customer.module';

const COMPONENTS = [
    LoanFormComponent,
    BasicInfoComponent,
    CompanyInfoComponent,
    KycInfoComponent,
    DmsLoanFileComponent,
    SecurityComponent,
    LoanActionComponent,
    LoanSummaryComponent,
    BirthMarkLetterNepaliComponent,
    ProposalComponent,
    BirthMarkLetterPrintComponent,
    SuccessOfferLetterComponent,
    SuccessOfferLetterPrintComponent,
    FinancialComponent,
    BorrowerRiskRatingComponent,
    CiclComponent,
    ReadmoreModelComponent,
    CreditGradingComponent,
    SiteVisitComponent,
    LoanPullComponent,
    SecurityInitialFormComponent,
    SecuritySummaryComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    CashFlowStatementComponent,
    KeyIndicatorsComponent,
    InitialFormComponent,
    FinancialSummaryComponent,
    CustomerDocumentComponent,
    FinancialSummaryComponent,
    LoanOfferLetterComponent,
    OfferLetterActionComponent,
    OfferLetterUploadComponent,
    OfferLetterComponent,
    SitevistSummaryComponentComponent,
    GroupComponent,
    GroupDetailComponent,
    SecurityDetailComponent,
    VehicleSecurityComponent,
    ShareSecurityComponent,
    ShareSecuritySummaryComponent,
    DhitoLikhatManjurinamaComponent,
    DhristiBandhakComponent,
    JamaniTamsukComponent,
    KararnamaComponent,
    KarjatamsukComponent,
    ManjurinamaComponent,
    PratigyaPatraComponent,
    LoanMainNepaliTemplateComponent,
    FiscalYearModalComponent,
    CustomerInfoNepaliComponent,
    LoanMainNepaliTemplateComponent,
    FiscalYearModalComponent,
    DhitoLikhatPrintComponent,
    PratigyaPatraPrintComponent,
    ApplicantFamilyInfoComponent,
    KarjaTamsukPrintComponent,
    KararnamaPrintComponent,
    ManjurinamaLetterPrintComponent,
    JamaniBasekoComponent,
    JamaniBasekoPrintComponent,
    DhristiBandhakPrintComponent,
    BikeKarjaComponent,
    HayarParchesKarjaNibedanComponent,
    MawCreditRiskGradingComponent,
    JamaniTamsukLetterPrintComponent,
    ApplicantFamilyInfoPrintComponent,
    BikeKarjaPrintComponent,
    CustomerAssociateComponent,
    CustomerInfoNepaliComponent,
    AllTemplateDetailsComponent,
    CompanyInfoDetailsComponent,
    CustomerDetailsInformationComponent,
    FinancialDetailsComponent,
    ProposalDetailsComponent,
    SiteVisitDetailsComponent,
    SecurityDetailsComponent
];
const ENTRY_COMPONENTS = [
    ReadmoreModelComponent,
    FiscalYearModalComponent,
    LoanMainNepaliTemplateComponent,
    CustomerInfoNepaliComponent,
    CustomerAssociateComponent
];

// @ts-ignore
// @ts-ignore
@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        ThemeModule,
        CommonModule,
        LoanRoutingModule,
        FormsModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NbDatepickerModule,
        NgxPrintModule,
        CoreModule,
        AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_MAP_API_KEY
        }),
        CustomerModule
    ],

    providers: [
        DatePipe,
        LoanFormService,
        NgbActiveModal
    ],

    entryComponents: [...ENTRY_COMPONENTS],

})
export class LoanModule {
}
