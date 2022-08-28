import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HayerPurchaseComponent} from './mega-offer-letter/hayer-purchase/hayer-purchase.component';
import {RetailEducationalLoanComponent} from './mega-offer-letter/retail-educational-loan/retail-educational-loan.component';
import {RetailEducationalLoanPrintComponent} from './mega-offer-letter/retail-educational-loan/retail-educational-loan-print/retail-educational-loan-print.component';
import {RetailEducationalLoanEnglishComponent} from './mega-offer-letter/retail-educational-loan-english/retail-educational-loan-english.component';
import {HayerPurchasePrintComponent} from './mega-offer-letter/hayer-purchase/hayer-purchase-print/hayer-purchase-print.component';
import {RetailEducationalLoanEnglishPrintComponent} from './mega-offer-letter/retail-educational-loan-english/retail-educational-loan-english-print/retail-educational-loan-english-print.component';
import {RetailHousingLoanComponent} from './mega-offer-letter/retail-housing-loan/retail-housing-loan.component';
import {RetailHousingLoanPrintComponent} from './mega-offer-letter/retail-housing-loan/retail-housing-loan-print/retail-housing-loan-print.component';
import {RetailMortgageComponent} from './mega-offer-letter/retail-mortgage/retail-mortgage.component';
import {RetailMortgagePrintComponent} from './mega-offer-letter/retail-mortgage/retail-mortgage-print/retail-mortgage-print.component';
import {RetailProfessionalLoanPrintComponent} from './mega-offer-letter/retail-professional-loan/retail-professional-loan-print/retail-professional-loan-print.component';
import {SmeOfferLetterComponent} from './mega-offer-letter/sme-offer-letter/sme-offer-letter.component';
import {RetailMortgageLoanPrintComponent} from './mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan-print/retail-mortgage-loan-print.component';
import {RetailProfessionalLoanComponent} from './mega-offer-letter/retail-professional-loan/retail-professional-loan.component';
import {RetailMortgageLoanComponent} from './mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan.component';
import {SmeOfferLetterPrintComponent} from './mega-offer-letter/sme-offer-letter/sme-offer-letter-print/sme-offer-letter-print.component';
import {MegaOfferLetterComponent} from './mega-offer-letter/mega-offer-letter.component';
import {ThemeModule} from '../../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../@core/core.module';
import {NbAccordionModule} from '@nebular/theme';
import {RetailAgainstInsPrintComponent} from './mega-offer-letter/retail-loan-against-insurance/retail-against-ins-print/retail-against-ins-print.component';
import {CustomInputComponent} from './mega-offer-letter/custom-input/custom-input.component';
import {RetailLoanAgainstInsuranceComponent} from './mega-offer-letter/retail-loan-against-insurance/retail-loan-against-insurance.component';
import {OfferLetterConsentComponent} from './mega-offer-letter/offer-letter-consent/offer-letter-consent.component';
import {PersonalOfferLetterRenewalsComponent} from './mega-offer-letter/personal-offer-letter-renewals/personal-offer-letter-renewals.component';
import { LoanAgainstShareComponent } from './century-offer-letter/loan-against-share/loan-against-share.component';

const COMPONENTS = [
  MegaOfferLetterComponent,
  HayerPurchaseComponent,
  HayerPurchasePrintComponent,
  RetailEducationalLoanComponent,
  RetailEducationalLoanPrintComponent,
  RetailEducationalLoanEnglishComponent,
  RetailEducationalLoanEnglishPrintComponent,
  RetailHousingLoanComponent,
  RetailHousingLoanPrintComponent,
  RetailMortgageComponent,
  RetailMortgagePrintComponent,
  RetailMortgageLoanComponent,
  RetailMortgageLoanPrintComponent,
  RetailProfessionalLoanComponent,
  RetailProfessionalLoanPrintComponent,
  RetailLoanAgainstInsuranceComponent,
  SmeOfferLetterComponent,
  SmeOfferLetterPrintComponent,
  PersonalOfferLetterRenewalsComponent,


];

@NgModule({
    declarations: [...COMPONENTS, RetailAgainstInsPrintComponent, CustomInputComponent,
        OfferLetterConsentComponent, PersonalOfferLetterRenewalsComponent, LoanAgainstShareComponent
        ],
    exports: [
        HayerPurchaseComponent,
        RetailEducationalLoanComponent,
        SmeOfferLetterComponent,
        RetailEducationalLoanEnglishComponent,
        RetailHousingLoanComponent,
        RetailMortgageComponent,
        RetailMortgageLoanComponent,
        RetailProfessionalLoanComponent,
        RetailLoanAgainstInsuranceComponent,
        OfferLetterConsentComponent,
        PersonalOfferLetterRenewalsComponent,
        CustomInputComponent,
        LoanAgainstShareComponent
    ],
    imports: [
        ThemeModule,
        CommonModule,
        NgxPrintModule,
        CoreModule,
        NbAccordionModule,
    ]
})
export class MegaOfferLetterTemplateModule {
}
