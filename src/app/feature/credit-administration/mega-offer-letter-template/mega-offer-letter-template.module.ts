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
import {RetailLoanAgainstInsuranceComponent} from './mega-offer-letter/retail-loan-against-insurance/retail-loan-against-insurance.component';
import { RetailAgainstInsPrintComponent } from './mega-offer-letter/retail-loan-against-insurance/retail-against-ins-print/retail-against-ins-print.component';
import { CustomInputComponent } from './mega-offer-letter/custom-input/custom-input.component';
import { PersonalOverdraftComponent } from './mega-offer-letter/personal-overdraft/personal-overdraft.component';
import { PersonalOverdraftPrintComponent } from './mega-offer-letter/personal-overdraft/personal-overdraft-print/personal-overdraft-print.component';
import { PersonalLoanAndPersonalOverdraftComponent } from './mega-offer-letter/personal-loan-and-personal-overdraft/personal-loan-and-personal-overdraft.component';
import {NepaliPatroModule} from 'nepali-patro';
import { PersonalLoanAndPersonalOverdraftPrintComponent } from './mega-offer-letter/personal-loan-and-personal-overdraft/personal-loan-and-personal-overdraft-print/personal-loan-and-personal-overdraft-print.component';
import { PersonalLoanComponent } from './mega-offer-letter/personal-loan/personal-loan.component';
import { PersonalLoanPrintComponent } from './mega-offer-letter/personal-loan/personal-loan-print/personal-loan-print.component';
import {NabilModule} from '../cad-document-template/nabil/nabil.module';
import {SakhshiCommonComponent} from '../component/sakhshi-common/sakhshi-common.component';
import { SecuritiesComponent } from '../cad-document-template/nabil/securities-view/securities-view.component';
import { PersonalOverdraftWithoutCollateralComponent } from './mega-offer-letter/personal-overdraft-without-collateral/personal-overdraft-without-collateral.component';
import { PersonalOverdraftWithoutCollateralPrintComponent } from './mega-offer-letter/personal-overdraft-without-collateral/personal-overdraft-without-collateral-print/personal-overdraft-without-collateral-print.component';

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
    RetailLoanAgainstInsuranceComponent,
    SmeComponent,
    SmePrintComponent

];

@NgModule({
    declarations: [...COMPONENTS, RetailAgainstInsPrintComponent, CustomInputComponent, PersonalOverdraftComponent, PersonalOverdraftPrintComponent, PersonalLoanAndPersonalOverdraftComponent, PersonalLoanAndPersonalOverdraftPrintComponent, PersonalLoanComponent, PersonalLoanPrintComponent,
        SakhshiCommonComponent,
        SecuritiesComponent,
        PersonalOverdraftWithoutCollateralComponent,
        PersonalOverdraftWithoutCollateralPrintComponent],
    exports: [
        HayerPurchaseComponent,
        RetailEducationalLoanComponent,
        SmeComponent,
        RetailEducationalLoanEnglishComponent,
        RetailHousingLoanComponent,
        RetailMortgageComponent,
        RetailMortgageLoanComponent,
        RetailProfessionalLoanComponent,
        RetailLoanAgainstInsuranceComponent,
        PersonalOverdraftComponent,
        PersonalLoanAndPersonalOverdraftComponent,
        PersonalLoanComponent,
        SakhshiCommonComponent,
        SecuritiesComponent,
        PersonalLoanPrintComponent,
        RetailProfessionalLoanPrintComponent,
        SmePrintComponent,
        PersonalOverdraftPrintComponent,
        PersonalLoanAndPersonalOverdraftPrintComponent,
        RetailMortgageLoanPrintComponent,
        PersonalOverdraftWithoutCollateralComponent,
        PersonalOverdraftWithoutCollateralPrintComponent
    ],
    imports: [
        ThemeModule,
        CommonModule,
        NgxPrintModule,
        CoreModule,
        NbAccordionModule,
        NepaliPatroModule,
    ],
    entryComponents: [
        RetailProfessionalLoanComponent,
        PersonalOverdraftComponent,
        PersonalLoanAndPersonalOverdraftComponent,
        PersonalLoanComponent,
        SmeComponent,
        RetailMortgageLoanComponent,
        SakhshiCommonComponent,
    SecuritiesComponent,
        PersonalOverdraftWithoutCollateralComponent,
    ]
})
export class MegaOfferLetterTemplateModule {
}
