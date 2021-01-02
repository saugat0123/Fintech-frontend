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
import {SmeComponent} from './mega-offer-letter/sme/sme.component';
import {RetailMortgageLoanPrintComponent} from './mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan-print/retail-mortgage-loan-print.component';
import {RetailProfessionalLoanComponent} from './mega-offer-letter/retail-professional-loan/retail-professional-loan.component';
import {RetailMortgageLoanComponent} from './mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan.component';
import {SmePrintComponent} from './mega-offer-letter/sme/sme-print/sme-print.component';
import {MegaOfferLetterComponent} from './mega-offer-letter/mega-offer-letter.component';
import {ThemeModule} from '../../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../@core/core.module';
import {NbAccordionModule} from '@nebular/theme';

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
    RetailHousingLoanPrintComponent,
    RetailMortgageComponent,
    RetailMortgagePrintComponent,
    RetailMortgageLoanComponent,
    RetailMortgageLoanPrintComponent,
    RetailProfessionalLoanComponent,
    RetailProfessionalLoanPrintComponent,
    SmeComponent,
    SmePrintComponent,

];

@NgModule({
    declarations: [...COMPONENTS],
    exports: [
        HayerPurchaseComponent,
        RetailEducationalLoanComponent,
        SmeComponent,
        RetailEducationalLoanEnglishComponent,
        RetailHousingLoanComponent,
        RetailMortgageComponent,
        RetailMortgageLoanComponent,
        RetailProfessionalLoanComponent
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
