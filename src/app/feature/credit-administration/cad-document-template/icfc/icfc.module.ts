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
import { LetterOfAgreementComponent } from './icfc-offer-letter/letter-of-agreement/letter-of-agreement.component';
import { MarginCallDeedShareLoanCompanyComponent } from './icfc-offer-letter/margin-call-deed-share-loan-company/margin-call-deed-share-loan-company.component';
import { MarginCallDeedShareLoanComponent } from './icfc-offer-letter/margin-call-deed-share-loan/margin-call-deed-share-loan.component';
import { PromissoryNoteComponent } from './icfc-offer-letter/promissory-note/promissory-note.component';
import { MortgageDeedCompanyComponent } from './icfc-offer-letter/mortgage-deed-company/mortgage-deed-company.component';
import { MrtgDeedIndividualDifferentComponent } from './icfc-offer-letter/mrtg-deed-individual-different/mrtg-deed-individual-different.component';
import { MrtgDeedIndividualSameComponent } from './icfc-offer-letter/mrtg-deed-individual-same/mrtg-deed-individual-same.component';
import {NgxPrintModule} from 'ngx-print';
import { MarginCallDeedShareLoanPrintComponent } from './icfc-offer-letter/margin-call-deed-share-loan/margin-call-deed-share-loan-print/margin-call-deed-share-loan-print.component';
import { MarginCallDeedShareCompanyPrintComponent } from './icfc-offer-letter/margin-call-deed-share-loan-company/margin-call-deed-share-company-print/margin-call-deed-share-company-print.component';
import { PromissoryNotePrintComponent } from './icfc-offer-letter/promissory-note/promissory-note-print/promissory-note-print.component';
import { MortgageDeedCompanyPrintComponent } from './icfc-offer-letter/mortgage-deed-company/mortgage-deed-company-print/mortgage-deed-company-print.component';
import { MrtgDeedIndividualDifferentPrintComponent } from './icfc-offer-letter/mrtg-deed-individual-different/mrtg-deed-individual-different-print/mrtg-deed-individual-different-print.component';
import { MrtgDeedIndividualSamePrintComponent } from './icfc-offer-letter/mrtg-deed-individual-same/mrtg-deed-individual-same-print/mrtg-deed-individual-same-print.component';
import { LetterOfAgreementPrintComponent } from './icfc-offer-letter/letter-of-agreement/letter-of-agreement-print/letter-of-agreement-print.component';
import { AcDebitAndLoanDisbursementAuthorityPrintComponent } from './icfc-offer-letter/ac-debit-and-loan-disbursement-authority/ac-debit-and-loan-disbursement-authority-print/ac-debit-and-loan-disbursement-authority-print.component';
import { BankGuaranteePrintComponent } from './icfc-offer-letter/bank-guarantee/bank-guarantee-print/bank-guarantee-print.component';
import { BusinessLoanPrintComponent } from './icfc-offer-letter/business-loan/business-loan-print/business-loan-print.component';
import { CorporateGuaranteePrintComponent } from './icfc-offer-letter/corporate-guarantee/corporate-guarantee-print/corporate-guarantee-print.component';
import { LetterOfContinuityPrintComponent } from './icfc-offer-letter/letter-of-continuity/letter-of-continuity-print/letter-of-continuity-print.component';
import { LetterOfSetOffPrintComponent } from './icfc-offer-letter/letter-of-set-off/letter-of-set-off-print/letter-of-set-off-print.component';
import { PersonalTermLoanPrintComponent } from './icfc-offer-letter/personal-term-loan/personal-term-loan-print/personal-term-loan-print.component';
import {CoreModule} from '../../../../@core/core.module';
import { LoanDeedCompanyIcfcComponent } from './icfc-offer-letter/loan-deed-company-icfc/loan-deed-company-icfc.component';
import { LoanDeedMultipleIcfcComponent } from './icfc-offer-letter/loan-deed-multiple-icfc/loan-deed-multiple-icfc.component';
import { LoanDeedCompanyIcfcPrintComponent } from './icfc-offer-letter/loan-deed-company-icfc/loan-deed-company-icfc-print/loan-deed-company-icfc-print.component';
import { LoanDeedMultipleIcfcPrintComponent } from './icfc-offer-letter/loan-deed-multiple-icfc/loan-deed-multiple-icfc-print/loan-deed-multiple-icfc-print.component';
import { LoanDeedPersonalLoanHomeLoanIcfcPrintComponent } from './icfc-offer-letter/loan-deed-personal-loan-home-loan-icfc/loan-deed-personal-loan-home-loan-icfc-print/loan-deed-personal-loan-home-loan-icfc-print.component';
import { LoanDeedPersonalLoanHomeLoanIcfcComponent } from './icfc-offer-letter/loan-deed-personal-loan-home-loan-icfc/loan-deed-personal-loan-home-loan-icfc.component';
@NgModule({
    declarations: [IcfcOfferLetterComponent, LetterOfArrangementsComponent, AcDebitAndLoanDisbursementAuthorityComponent, BankGuaranteeComponent, BusinessLoanComponent, CorporateGuaranteeComponent, LetterOfContinuityComponent, LetterOfSetOffComponent, PersonalTermLoanComponent, LetterOfAgreementComponent, MarginCallDeedShareLoanCompanyComponent, MarginCallDeedShareLoanComponent, PromissoryNoteComponent, MortgageDeedCompanyComponent, MrtgDeedIndividualDifferentComponent, MrtgDeedIndividualSameComponent, MarginCallDeedShareLoanPrintComponent, MarginCallDeedShareCompanyPrintComponent, PromissoryNotePrintComponent, MortgageDeedCompanyPrintComponent, MrtgDeedIndividualDifferentPrintComponent, MrtgDeedIndividualSamePrintComponent, LetterOfAgreementPrintComponent, AcDebitAndLoanDisbursementAuthorityPrintComponent, BankGuaranteePrintComponent, BusinessLoanPrintComponent, CorporateGuaranteePrintComponent, LetterOfContinuityPrintComponent, LetterOfSetOffPrintComponent, PersonalTermLoanPrintComponent, LoanDeedCompanyIcfcComponent, LoanDeedMultipleIcfcComponent, LoanDeedPersonalLoanHomeLoanIcfcComponent, LoanDeedCompanyIcfcPrintComponent, LoanDeedMultipleIcfcPrintComponent, LoanDeedPersonalLoanHomeLoanIcfcPrintComponent],
    imports: [
        CommonModule,
        ThemeModule,
        NgxPrintModule,
        CoreModule
    ],
    entryComponents: [
        IcfcOfferLetterComponent
    ]
})
export class IcfcModule {
}
