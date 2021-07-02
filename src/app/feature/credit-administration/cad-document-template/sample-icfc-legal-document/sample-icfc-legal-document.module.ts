import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleOfferLetterComponent } from './sample-offer-letter/sample-offer-letter.component';
import { AcDebitAndLoanDisbursementSampleComponent } from './sample-offer-letter/ac-debit-and-loan-disbursement-sample/ac-debit-and-loan-disbursement-sample.component';
import {ThemeModule} from '../../../../@theme/theme.module';
import {CoreModule} from '../../../../@core/core.module';
import { BankGuaranteeSampleComponent } from './sample-offer-letter/bank-guarantee-sample/bank-guarantee-sample.component';
import { LetterOfAgreementSampleComponent } from './sample-offer-letter/letter-of-agreement-sample/letter-of-agreement-sample.component';
import { LetterOfContinuitySampleComponent } from './sample-offer-letter/letter-of-continuity-sample/letter-of-continuity-sample.component';
import { AcDebitAndLoanDisbursementSamplePrintComponent } from './sample-offer-letter/ac-debit-and-loan-disbursement-sample/ac-debit-and-loan-disbursement-sample-print/ac-debit-and-loan-disbursement-sample-print.component';
import {NgxPrintModule} from 'ngx-print';
import { BankGuaranteeSamplePrintComponent } from './sample-offer-letter/bank-guarantee-sample/bank-guarantee-sample-print/bank-guarantee-sample-print.component';
import { LetterOfAgreementSamplePrintComponent } from './sample-offer-letter/letter-of-agreement-sample/letter-of-agreement-sample-print/letter-of-agreement-sample-print.component';
import { LetterOfContinuitySamplePrintComponent } from './sample-offer-letter/letter-of-continuity-sample/letter-of-continuity-sample-print/letter-of-continuity-sample-print.component';



@NgModule({
    declarations: [SampleOfferLetterComponent, AcDebitAndLoanDisbursementSampleComponent, BankGuaranteeSampleComponent, LetterOfAgreementSampleComponent, LetterOfContinuitySampleComponent, AcDebitAndLoanDisbursementSamplePrintComponent, BankGuaranteeSamplePrintComponent, LetterOfAgreementSamplePrintComponent, LetterOfContinuitySamplePrintComponent],
    imports: [
        CommonModule,
        ThemeModule,
        CoreModule,
        NgxPrintModule
    ],
    exports: [
        LetterOfContinuitySampleComponent,
        LetterOfAgreementSampleComponent,
        AcDebitAndLoanDisbursementSampleComponent,
        BankGuaranteeSampleComponent
    ],
    entryComponents: [
        SampleOfferLetterComponent
    ]
})
export class SampleIcfcLegalDocumentModule { }
