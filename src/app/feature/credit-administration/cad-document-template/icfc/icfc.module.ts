import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IcfcOfferLetterComponent} from './icfc-offer-letter/icfc-offer-letter.component';
import { LetterOfArrangementsComponent } from './icfc-offer-letter/letter-of-arrangements/letter-of-arrangements.component';
import {ThemeModule} from '../../../../@theme/theme.module';
import { AcDebitAndLoanDisbursementAuthorityComponent } from './icfc-offer-letter/ac-debit-and-loan-disbursement-authority/ac-debit-and-loan-disbursement-authority.component';
import { BankGuaranteeComponent } from './icfc-offer-letter/bank-guarantee/bank-guarantee.component';
import { BusinessLoanComponent } from './icfc-offer-letter/business-loan/business-loan.component';
import { CorporateGuaranteeComponent } from './icfc-offer-letter/corporate-guarantee/corporate-guarantee.component';
import { LetterOfContinuityComponent } from './icfc-offer-letter/letter-of-continuity/letter-of-continuity.component';
import { LetterOfSetOffComponent } from './icfc-offer-letter/letter-of-set-off/letter-of-set-off.component';
import { PersonalTermLoanComponent } from './icfc-offer-letter/personal-term-loan/personal-term-loan.component';

@NgModule({
    declarations: [IcfcOfferLetterComponent, LetterOfArrangementsComponent, AcDebitAndLoanDisbursementAuthorityComponent, BankGuaranteeComponent, BusinessLoanComponent, CorporateGuaranteeComponent, LetterOfContinuityComponent, LetterOfSetOffComponent, PersonalTermLoanComponent],
    imports: [
        CommonModule,
        ThemeModule
    ],
    entryComponents: [
        IcfcOfferLetterComponent
    ]
})
export class IcfcModule {
}
