import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../../@core/core.module';
import {NbAccordionModule} from '@nebular/theme';
import {ProgressiveOfferLetterComponent} from './progressive-offer-letter/progressive-offer-letter.component';
import {LetterOfArrangementsComponent} from './progressive-offer-letter/letter-of-arrangements/letter-of-arrangements.component';
import { LetterOfArrangementsPrintComponent } from './progressive-offer-letter/letter-of-arrangements/letter-of-arrangements-print/letter-of-arrangements-print.component';
import {LetterOfInstallmentsComponent} from "./progressive-offer-letter/letter-of-installments/letter-of-installments.component";
import { LetterOfLeinComponent } from './progressive-offer-letter/letter-of-lein/letter-of-lein.component';
import { PromissoryNoteComponent } from './progressive-offer-letter/promissory-note/promissory-note.component';
import { LoanDeedComponent } from './progressive-offer-letter/loan-deed/loan-deed.component';
import { LetterOfInstallmentsPrintComponent } from './progressive-offer-letter/letter-of-installments/letter-of-installments-print/letter-of-installments-print.component';
import { LetterOfLeinPrintComponent } from './progressive-offer-letter/letter-of-lein/letter-of-lein-print/letter-of-lein-print.component';
import { PromissoryNotePrintComponent } from './progressive-offer-letter/promissory-note/promissory-note-print/promissory-note-print.component';
import {PromissoryNoteGuarantorComponent} from "./progressive-offer-letter/promissory-note-guarantor/promissory-note-guarantor.component";
import { PromissoryNoteGuarantorPrintComponent } from './progressive-offer-letter/promissory-note-guarantor/promissory-note-guarantor-print/promissory-note-guarantor-print.component';
import {LetterOfAgreementComponent} from "./progressive-offer-letter/letter-of-agreement/letter-of-agreement.component";
import { LetterOfAgreementPrintComponent } from './progressive-offer-letter/letter-of-agreement/letter-of-agreement-print/letter-of-agreement-print.component';
import { LoanDeedPrintComponent } from './progressive-offer-letter/loan-deed/loan-deed-print/loan-deed-print.component';

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
        LoanDeedPrintComponent

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
