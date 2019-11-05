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
import {BorrowerRiskRatingComponent} from './component/loan-main-template/financial/borrower-risk-rating/borrower-risk-rating.component';
import {ReadmoreModelComponent} from './component/readmore-model/readmore-model.component';
import {CreditGradingComponent} from './component/loan-main-template/credit-grading/credit-grading.component';
import {CoreModule} from '../../@core/core.module';
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
import {SecurityInitialFormComponent} from './component/loan-main-template/security/security-initial-form/security-initial-form.component';
import {SecuritySummaryComponent} from './component/loan-summary/security-summary/security-summary.component';

import {LoanOfferLetterComponent} from './loan-offer-letter/loan-offer-letter.component';
import {OfferLetterActionComponent} from './loan-offer-letter/offer-letter-action/offer-letter-action.component';
import {OfferLetterUploadComponent} from './loan-offer-letter/offer-letter-upload/offer-letter-upload.component';


const ENTRY_COMPONENTS = [ReadmoreModelComponent, OfferLetterUploadComponent];

@NgModule({
    declarations: [
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
        LoanOfferLetterComponent,
        OfferLetterActionComponent,
        OfferLetterUploadComponent,
    ],
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
        })
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
