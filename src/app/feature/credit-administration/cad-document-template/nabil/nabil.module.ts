import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromissoryNoteIndividualComponent} from './promissory-note-individual/promissory-note-individual.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PromissoryNoteIndividualPrintComponent} from './promissory-note-individual/promissory-note-individual-print/promissory-note-individual-print.component';
import {NgxPrintModule} from 'ngx-print';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';
import {NbButtonModule} from '@nebular/theme';
import {LetterOfSetOffComponent} from './letter-of-set-off/letter-of-set-off.component';
import {LetterOfSetOffPrintComponent} from './letter-of-set-off/letter-of-set-off-print/letter-of-set-off-print.component';
import { PersonalGuaranteeIndividualPrintComponent } from './personal-guarantee-individual/personal-guarantee-individual-print/personal-guarantee-individual-print.component';
import { PersonalGuaranteeIndividualComponent } from './personal-guarantee-individual/personal-guarantee-individual.component';
import { PersonalGuaranteeCompanyComponent } from './personal-guarantee-company/personal-guarantee-company.component';
import { NabilLoanDeedCompanyComponent } from './nabil-loan-deed-company/nabil-loan-deed-company.component';
import {CKEditorModule} from 'ng2-ckeditor';
import { LoanDeedIndividualComponent } from './loan-deed-individual/loan-deed-individual.component';
import { LoanDeedIndividualPrintComponent } from './loan-deed-individual/loan-deed-individual-print/loan-deed-individual-print.component';
import { PromissoryNotePropertiershipComponent } from './promissory-note-propertiership/promissory-note-propertiership.component';
import { PromissoryNotePropertiershipPrintComponent } from './promissory-note-propertiership/promissory-note-propertiership-print/promissory-note-propertiership-print.component';
import {PromissoryNotePartnershipComponent} from './promissory-note-partnership/promissory-note-partnership.component';
import {PromissoryNotePartnershipPrintComponent} from './promissory-note-partnership/promissory-note-partnership-print/promissory-note-partnership-print.component';
import {SecuritiesComponent} from './securities-view/securities-view.component';

@NgModule({
    declarations: [
        PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, LetterOfSetOffComponent,
        LetterOfSetOffPrintComponent, PersonalGuaranteeIndividualComponent, PersonalGuaranteeIndividualPrintComponent,
        PersonalGuaranteeCompanyComponent, PromissoryNoteCompanyComponent, NabilLoanDeedCompanyComponent,
        LoanDeedIndividualComponent, LoanDeedIndividualPrintComponent, PromissoryNotePropertiershipComponent, PromissoryNotePropertiershipPrintComponent,
        PromissoryNotePartnershipComponent, PromissoryNotePartnershipPrintComponent, SecuritiesComponent ],

    exports: [
        PromissoryNoteIndividualComponent,
        LetterOfSetOffComponent,
        PersonalGuaranteeCompanyComponent,
        PersonalGuaranteeIndividualComponent,
        LetterOfSetOffPrintComponent,
        PromissoryNoteIndividualPrintComponent,
        PromissoryNoteCompanyComponent,
        LoanDeedIndividualComponent,
        LoanDeedIndividualPrintComponent,
        NabilLoanDeedCompanyComponent,
        PromissoryNotePropertiershipComponent,
        PromissoryNotePropertiershipPrintComponent,
        PromissoryNotePartnershipPrintComponent,
        PromissoryNotePartnershipComponent,
        SecuritiesComponent

    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPrintModule,
        NbButtonModule,
        CKEditorModule
    ]
})
export class NabilModule {
}
