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
import {SummaryComponent} from './component/print-summary/summary.component';
import { FinancialComponent } from './component/loan-main-template/financial/financial.component';
import {BirthMarkLetterNepaliComponent} from './component/offer-letter/birth-mark-letter/birth-mark-letter-nepali.component';
// tslint:disable-next-line:max-line-length
import {BirthMarkLetterPrintComponent} from './component/offer-letter/birth-mark-letter/birth-mark-letter-print/birth-mark-letter-print.component';
import { SuccessOfferLetterComponent } from './component/offer-letter/success-offer-letter/success-offer-letter.component';
// tslint:disable-next-line:max-line-length
import { SuccessOfferLetterPrintComponent } from './component/offer-letter/success-offer-letter/success-offer-letter-print/success-offer-letter-print.component';
import {ProposalComponent} from './component/loan-main-template/proposal/proposal.component';
import { BorrowerRiskRatingComponent } from './component/loan-main-template/financial/borrower-risk-rating/borrower-risk-rating.component';




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
        SummaryComponent,
        ProposalComponent,
        BirthMarkLetterPrintComponent,
        SuccessOfferLetterComponent,
        SuccessOfferLetterPrintComponent,
        FinancialComponent,
        BorrowerRiskRatingComponent,

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
    ],

    providers: [
        DatePipe,
        LoanFormService,
        NgbActiveModal
    ]

})
export class LoanModule {
}
