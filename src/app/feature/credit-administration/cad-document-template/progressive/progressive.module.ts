import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../../@core/core.module';
import {NbAccordionModule} from '@nebular/theme';
import {ProgressiveOfferLetterComponent} from './progressive-offer-letter/progressive-offer-letter.component';
import {LetterOfArrangementsComponent} from './progressive-offer-letter/letter-of-arrangements/letter-of-arrangements.component';
import { LetterOfArrangementsPrintComponent } from './progressive-offer-letter/letter-of-arrangements/letter-of-arrangements-print/letter-of-arrangements-print.component';
import {LetterOfInstallmentsComponent} from './progressive-offer-letter/letter-of-installments/letter-of-installments.component';
import { LetterOfLeinComponent } from './progressive-offer-letter/letter-of-lein/letter-of-lein.component';
import { PromissoryNoteComponent } from './progressive-offer-letter/promissory-note/promissory-note.component';
import { LoanDeedComponent } from './progressive-offer-letter/loan-deed/loan-deed.component';
import { LetterOfInstallmentsPrintComponent } from './progressive-offer-letter/letter-of-installments/letter-of-installments-print/letter-of-installments-print.component';
import { LetterOfLeinPrintComponent } from './progressive-offer-letter/letter-of-lein/letter-of-lein-print/letter-of-lein-print.component';
import { PromissoryNotePrintComponent } from './progressive-offer-letter/promissory-note/promissory-note-print/promissory-note-print.component';
import {PromissoryNoteGuarantorComponent} from './progressive-offer-letter/promissory-note-guarantor/promissory-note-guarantor.component';
import { PromissoryNoteGuarantorPrintComponent } from './progressive-offer-letter/promissory-note-guarantor/promissory-note-guarantor-print/promissory-note-guarantor-print.component';
import {LetterOfAgreementComponent} from './progressive-offer-letter/letter-of-agreement/letter-of-agreement.component';
import { LetterOfAgreementPrintComponent } from './progressive-offer-letter/letter-of-agreement/letter-of-agreement-print/letter-of-agreement-print.component';
import { LoanDeedPrintComponent } from './progressive-offer-letter/loan-deed/loan-deed-print/loan-deed-print.component';
import {HirePurchaseDeedComponent} from "./progressive-offer-letter/hire-purchase-deed/hire-purchase-deed.component";
import {GuaranteeBondCorporateComponent} from "./progressive-offer-letter/guarantee-bond-corporate/guarantee-bond-corporate.component";
import {IndemnityDeedComponent} from "./progressive-offer-letter/indemnity-deed/indemnity-deed.component";
import {LetterOfContinuityComponent} from "./progressive-offer-letter/letter-of-continuity/letter-of-continuity.component";
import {LetterOfDisbursementComponent} from "./progressive-offer-letter/letter-of-disbursement/letter-of-disbursement.component";
import { HirePurchaseDeedPrintComponent } from './progressive-offer-letter/hire-purchase-deed/hire-purchase-deed-print/hire-purchase-deed-print.component';
import { IndemnityDeedPrintComponent } from './progressive-offer-letter/indemnity-deed/indemnity-deed-print/indemnity-deed-print.component';
import { LetterOfDisbursementPrintComponent } from './progressive-offer-letter/letter-of-disbursement/letter-of-disbursement-print/letter-of-disbursement-print.component';
import { GuaranteeBondCorporatePrintComponent } from './progressive-offer-letter/guarantee-bond-corporate/guarantee-bond-corporate-print/guarantee-bond-corporate-print.component';
import { LetterOfContinuityPrintComponent } from './progressive-offer-letter/letter-of-continuity/letter-of-continuity-print/letter-of-continuity-print.component';
import {CrossGuaranteeBondComponent} from './progressive-offer-letter/cross-guarantee-bond/cross-guarantee-bond.component';
import {GuaranteeBondPersonalComponent} from './progressive-offer-letter/guarantee-bond-personal/guarantee-bond-personal.component';
import {HypothecationOfGoodsAndReceivablesBComponent} from "./progressive-offer-letter/hypothecation-of-goods-and-receivables-b/hypothecation-of-goods-and-receivables-b.component";
import {MortgageDeedComponent} from "./progressive-offer-letter/mortgage-deed/mortgage-deed.component";
import {OfferLetterCorporateComponent} from "./progressive-offer-letter/offer-letter-corporate/offer-letter-corporate.component";
import {OfferLetterPersonalComponent} from "./progressive-offer-letter/offer-letter-personal/offer-letter-personal.component";
import { CrossGuaranteeBondPrintComponent } from './progressive-offer-letter/cross-guarantee-bond/cross-guarantee-bond-print/cross-guarantee-bond-print.component';
import { GuaranteeBondPersonalPrintComponent } from './progressive-offer-letter/guarantee-bond-personal/guarantee-bond-personal-print/guarantee-bond-personal-print.component';
const COMPONENTS = [
    LetterOfArrangementsComponent, LetterOfArrangementsPrintComponent,
    LetterOfInstallmentsComponent];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ProgressiveOfferLetterComponent,
        LetterOfLeinComponent,
        PromissoryNoteComponent,
        LoanDeedComponent,
        LetterOfInstallmentsPrintComponent,
        LetterOfLeinPrintComponent,
        PromissoryNotePrintComponent,
        PromissoryNoteGuarantorComponent,
        PromissoryNoteGuarantorPrintComponent,
        LetterOfAgreementComponent,
        LetterOfAgreementPrintComponent,
        LoanDeedPrintComponent,
        HirePurchaseDeedComponent,
        GuaranteeBondCorporateComponent,
        IndemnityDeedComponent,
        LetterOfContinuityComponent,
        LetterOfDisbursementComponent,
        HirePurchaseDeedPrintComponent,
        IndemnityDeedPrintComponent,
        LetterOfDisbursementPrintComponent,
        GuaranteeBondCorporatePrintComponent,
        LetterOfContinuityPrintComponent,
        CrossGuaranteeBondComponent,
        GuaranteeBondPersonalComponent,
        HypothecationOfGoodsAndReceivablesBComponent,
        MortgageDeedComponent,
        OfferLetterCorporateComponent,
        OfferLetterPersonalComponent,
        CrossGuaranteeBondPrintComponent,
        GuaranteeBondPersonalPrintComponent

    ],
    exports: [
        ...COMPONENTS
    ],
    imports: [
        ThemeModule,
        CommonModule,
        NgxPrintModule,
        CoreModule,
        NbAccordionModule,
    ],
    entryComponents: [
        ProgressiveOfferLetterComponent
    ]
})
export class ProgressiveModule {
}
