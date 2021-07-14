import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IcfcOfferLetterComponent} from './icfc-offer-letter/icfc-offer-letter.component';
import { LetterOfArrangementsComponent } from './icfc-offer-letter/letter-of-arrangements/letter-of-arrangements.component';
import {ThemeModule} from '../../../../@theme/theme.module';
import { AcDebitAndLoanDisbursementAuthorityComponent } from './icfc-offer-letter/ac-debit-and-loan-disbursement-authority/ac-debit-and-loan-disbursement-authority.component';
import { BankGuaranteeComponent } from './icfc-offer-letter/bank-guarantee/bank-guarantee.component';
import { BusinessLoanComponent } from './icfc-offer-letter/business-loan/business-loan.component';
import { CorporateGuaranteeComponent } from './icfc-offer-letter/corporate-guarantee/corporate-guarantee.component';
import { LetterOfSetOffComponent } from './icfc-offer-letter/letter-of-set-off/letter-of-set-off.component';
import { PersonalTermLoanComponent } from './icfc-offer-letter/personal-term-loan/personal-term-loan.component';
import { MarginCallDeedShareLoanCompanyComponent } from './icfc-offer-letter/margin-call-deed-share-loan-company/margin-call-deed-share-loan-company.component';
import { MarginCallDeedShareLoanComponent } from './icfc-offer-letter/margin-call-deed-share-loan/margin-call-deed-share-loan.component';
import { MortgageDeedCompanyComponent } from './icfc-offer-letter/mortgage-deed-company/mortgage-deed-company.component';
import { MrtgDeedIndividualDifferentComponent } from './icfc-offer-letter/mrtg-deed-individual-different/mrtg-deed-individual-different.component';
import { MrtgDeedIndividualSameComponent } from './icfc-offer-letter/mrtg-deed-individual-same/mrtg-deed-individual-same.component';
import {NgxPrintModule} from 'ngx-print';
import { MarginCallDeedShareLoanPrintComponent } from './icfc-offer-letter/margin-call-deed-share-loan/margin-call-deed-share-loan-print/margin-call-deed-share-loan-print.component';
import { MarginCallDeedShareCompanyPrintComponent } from './icfc-offer-letter/margin-call-deed-share-loan-company/margin-call-deed-share-company-print/margin-call-deed-share-company-print.component';
import { MortgageDeedCompanyPrintComponent } from './icfc-offer-letter/mortgage-deed-company/mortgage-deed-company-print/mortgage-deed-company-print.component';
import { MrtgDeedIndividualDifferentPrintComponent } from './icfc-offer-letter/mrtg-deed-individual-different/mrtg-deed-individual-different-print/mrtg-deed-individual-different-print.component';
import { MrtgDeedIndividualSamePrintComponent } from './icfc-offer-letter/mrtg-deed-individual-same/mrtg-deed-individual-same-print/mrtg-deed-individual-same-print.component';
import { AcDebitAndLoanDisbursementAuthorityPrintComponent } from './icfc-offer-letter/ac-debit-and-loan-disbursement-authority/ac-debit-and-loan-disbursement-authority-print/ac-debit-and-loan-disbursement-authority-print.component';
import { BankGuaranteePrintComponent } from './icfc-offer-letter/bank-guarantee/bank-guarantee-print/bank-guarantee-print.component';
import { BusinessLoanPrintComponent } from './icfc-offer-letter/business-loan/business-loan-print/business-loan-print.component';
import { CorporateGuaranteePrintComponent } from './icfc-offer-letter/corporate-guarantee/corporate-guarantee-print/corporate-guarantee-print.component';
import { LetterOfSetOffPrintComponent } from './icfc-offer-letter/letter-of-set-off/letter-of-set-off-print/letter-of-set-off-print.component';
import { PersonalTermLoanPrintComponent } from './icfc-offer-letter/personal-term-loan/personal-term-loan-print/personal-term-loan-print.component';
import {CoreModule} from '../../../../@core/core.module';
import { LoanDeedCompanyIcfcComponent } from './icfc-offer-letter/loan-deed-company-icfc/loan-deed-company-icfc.component';
import { LoanDeedMultipleIcfcComponent } from './icfc-offer-letter/loan-deed-multiple-icfc/loan-deed-multiple-icfc.component';
import { LoanDeedCompanyIcfcPrintComponent } from './icfc-offer-letter/loan-deed-company-icfc/loan-deed-company-icfc-print/loan-deed-company-icfc-print.component';
import { LoanDeedMultipleIcfcPrintComponent } from './icfc-offer-letter/loan-deed-multiple-icfc/loan-deed-multiple-icfc-print/loan-deed-multiple-icfc-print.component';
import { LoanDeedPersonalLoanHomeLoanIcfcPrintComponent } from './icfc-offer-letter/loan-deed-personal-loan-home-loan-icfc/loan-deed-personal-loan-home-loan-icfc-print/loan-deed-personal-loan-home-loan-icfc-print.component';
import { LoanDeedPersonalLoanHomeLoanIcfcComponent } from './icfc-offer-letter/loan-deed-personal-loan-home-loan-icfc/loan-deed-personal-loan-home-loan-icfc.component';
import { LoanDeedHirePurchaseComponent } from './icfc-offer-letter/loan-deed-hire-purchase/loan-deed-hire-purchase.component';
import { LoanDeedHirePurchasePrintComponent } from './icfc-offer-letter/loan-deed-hire-purchase/loan-deed-hire-purchase-print/loan-deed-hire-purchase-print.component';
import { ConsentForCollateralComponent } from './icfc-offer-letter/consent-for-collateral/consent-for-collateral.component';
import { ConsentForLoanInterestPaymentComponent } from './icfc-offer-letter/consent-for-loan-interest-payment/consent-for-loan-interest-payment.component';
import { ConsentLetterForHpLoanComponent } from './icfc-offer-letter/consent-letter-for-hp-loan/consent-letter-for-hp-loan.component';
import { PersonalGuaranteePersonalBothComponent } from './icfc-offer-letter/personal-guarantee-personal-both/personal-guarantee-personal-both.component';
import { PersonalGuaranteePersonalComponent } from './icfc-offer-letter/personal-guarantee-personal/personal-guarantee-personal.component';
import { PersonalGuaranteeCompanyIcfcComponent } from './icfc-offer-letter/personal-guarantee-company-icfc/personal-guarantee-company-icfc.component';
import { PersonalGuaranteeCompanyIcfcPrintComponent } from './icfc-offer-letter/personal-guarantee-company-icfc/personal-guarantee-company-icfc-print/personal-guarantee-company-icfc-print.component';
import { PersonalGuaranteePersonalPrintComponent } from './icfc-offer-letter/personal-guarantee-personal/personal-guarantee-personal-print/personal-guarantee-personal-print.component';
import { PersonalGuaranteePersonalBothPrintComponent } from './icfc-offer-letter/personal-guarantee-personal-both/personal-guarantee-personal-both-print/personal-guarantee-personal-both-print.component';
import { LetterOfAgreementIcfcComponent } from './icfc-offer-letter/letter-of-agreement-icfc/letter-of-agreement-icfc.component';
import { LetterOfAgreementIcfcPrintComponent } from './icfc-offer-letter/letter-of-agreement-icfc/letter-of-agreement-icfc-print/letter-of-agreement-icfc-print.component';
import { LetterOfContinuityIcfcComponent } from './icfc-offer-letter/letter-of-continuity-icfc/letter-of-continuity-icfc.component';
import { LetterOfContinuityIcfcPrintComponent } from './icfc-offer-letter/letter-of-continuity-icfc/letter-of-continuity-icfc-print/letter-of-continuity-icfc-print.component';
import { PromissoryNoteIcfcComponent } from './icfc-offer-letter/promissory-note-icfc/promissory-note-icfc.component';
import { PromissoryNoteIcfcPrintComponent } from './icfc-offer-letter/promissory-note-icfc/promissory-note-icfc-print/promissory-note-icfc-print.component';
@NgModule({
    declarations: [IcfcOfferLetterComponent, LetterOfArrangementsComponent, AcDebitAndLoanDisbursementAuthorityComponent, BankGuaranteeComponent, BusinessLoanComponent, CorporateGuaranteeComponent, LetterOfSetOffComponent, PersonalTermLoanComponent, MarginCallDeedShareLoanCompanyComponent, MarginCallDeedShareLoanComponent, MortgageDeedCompanyComponent, MrtgDeedIndividualDifferentComponent, MrtgDeedIndividualSameComponent, MarginCallDeedShareLoanPrintComponent, MarginCallDeedShareCompanyPrintComponent, MortgageDeedCompanyPrintComponent, MrtgDeedIndividualDifferentPrintComponent, MrtgDeedIndividualSamePrintComponent, AcDebitAndLoanDisbursementAuthorityPrintComponent, BankGuaranteePrintComponent, BusinessLoanPrintComponent, CorporateGuaranteePrintComponent, LetterOfSetOffPrintComponent, PersonalTermLoanPrintComponent, LoanDeedCompanyIcfcComponent, LoanDeedMultipleIcfcComponent, LoanDeedPersonalLoanHomeLoanIcfcComponent, LoanDeedCompanyIcfcPrintComponent, LoanDeedMultipleIcfcPrintComponent, LoanDeedPersonalLoanHomeLoanIcfcPrintComponent, LoanDeedHirePurchaseComponent, LoanDeedHirePurchasePrintComponent, ConsentForCollateralComponent, ConsentForLoanInterestPaymentComponent, ConsentLetterForHpLoanComponent, PersonalGuaranteePersonalBothComponent, PersonalGuaranteePersonalComponent, PersonalGuaranteeCompanyIcfcComponent, PersonalGuaranteeCompanyIcfcPrintComponent, PersonalGuaranteePersonalPrintComponent, PersonalGuaranteePersonalBothPrintComponent, LetterOfAgreementIcfcComponent, LetterOfAgreementIcfcPrintComponent, LetterOfContinuityIcfcComponent, LetterOfContinuityIcfcPrintComponent, PromissoryNoteIcfcComponent, PromissoryNoteIcfcPrintComponent],
    imports: [
        CommonModule,
        ThemeModule,
        NgxPrintModule,
        CoreModule
    ],
    exports: [
        AcDebitAndLoanDisbursementAuthorityComponent,
        CorporateGuaranteeComponent,
        LetterOfSetOffComponent,
        LoanDeedHirePurchaseComponent,
        LoanDeedPersonalLoanHomeLoanIcfcComponent,
        MarginCallDeedShareLoanComponent,
        MarginCallDeedShareLoanCompanyComponent,
        MortgageDeedCompanyComponent,
        MrtgDeedIndividualDifferentComponent,
        MrtgDeedIndividualSameComponent,
        LoanDeedCompanyIcfcComponent,
        LoanDeedMultipleIcfcComponent,
        ConsentForCollateralComponent,
        ConsentForLoanInterestPaymentComponent,
        ConsentLetterForHpLoanComponent,
        PersonalGuaranteePersonalBothComponent,
        PersonalGuaranteePersonalComponent,
        PersonalGuaranteeCompanyIcfcComponent,
        LetterOfAgreementIcfcComponent,
        LetterOfContinuityIcfcComponent,
        PromissoryNoteIcfcComponent
    ],
    entryComponents: [
        IcfcOfferLetterComponent
    ]
})
export class IcfcModule {
}
