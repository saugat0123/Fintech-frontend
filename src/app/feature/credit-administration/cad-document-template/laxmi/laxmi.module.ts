import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LaxmiOfferLetterComponent} from './laxmi-offer-letter/laxmi-offer-letter.component';
import {NbCardModule, NbSpinnerModule} from '@nebular/theme';
import { LetterOfCommitmentComponent } from './laxmi-offer-letter/letter-of-commitment/letter-of-commitment.component';
import { PersonalGuaranteeComponent } from './laxmi-offer-letter/personal-guarantee/personal-guarantee.component';
import { OfferLetterComponent } from './laxmi-offer-letter/offer-letter/offer-letter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import { LetterOfCommitmentPrintComponent } from './laxmi-offer-letter/letter-of-commitment/letter-of-commitment-print/letter-of-commitment-print.component';
import { OfferLetterPrintComponent } from './laxmi-offer-letter/offer-letter/offer-letter-print/offer-letter-print.component';
import {CoreModule} from '../../../../@core/core.module';
import { PersonalGuaranteePrintComponent } from './laxmi-offer-letter/personal-guarantee/personal-guarantee-print/personal-guarantee-print.component';

import { LoanDeedIndividualComponent } from './laxmi-offer-letter/loan-deed-individual/loan-deed-individual.component';
import { LoanDeedIndividualPrintComponent } from './laxmi-offer-letter/loan-deed-individual/loan-deed-individual-print/loan-deed-individual-print.component';
import { PromisoryNoteIndividualComponent } from './laxmi-offer-letter/promisory-note-individual/promisory-note-individual.component';
import { PromisoryNoteIndividualPrintComponent } from './laxmi-offer-letter/promisory-note-individual/promisory-note-individual-print/promisory-note-individual-print.component';
import { SelfDeclarationComponent } from './laxmi-offer-letter/self-declaration/self-declaration.component';
import { SelfDeclarationPrintComponent } from './laxmi-offer-letter/self-declaration/self-declaration-print/self-declaration-print.component';


@NgModule({
    declarations: [LaxmiOfferLetterComponent, LetterOfCommitmentComponent, PersonalGuaranteeComponent, OfferLetterComponent, LetterOfCommitmentPrintComponent, OfferLetterPrintComponent, PersonalGuaranteePrintComponent, LoanDeedIndividualComponent, LoanDeedIndividualPrintComponent, PromisoryNoteIndividualComponent, PromisoryNoteIndividualPrintComponent, SelfDeclarationComponent, SelfDeclarationPrintComponent],
    imports: [
        CommonModule,
        NbCardModule,
        ReactiveFormsModule,
        NbSpinnerModule,
        NgxPrintModule,
        CoreModule
    ],
    exports: [
        LoanDeedIndividualComponent,
        PromisoryNoteIndividualComponent,
        SelfDeclarationComponent
    ],
    entryComponents: [
        LaxmiOfferLetterComponent
    ]
})
export class LaxmiModule {
}
