import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromissoryNoteIndividualComponent} from './promissory-note-individual/promissory-note-individual.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PromissoryNoteIndividualPrintComponent } from './promissory-note-individual/promissory-note-individual-print/promissory-note-individual-print.component';
import {NgxPrintModule} from 'ngx-print';
import {NbButtonModule} from '@nebular/theme';
import {LetterOfSetOffComponent} from './letter-of-set-off/letter-of-set-off.component';
import {LetterOfSetOffPrintComponent} from './letter-of-set-off/letter-of-set-off-print/letter-of-set-off-print.component';
import { PersonalGuaranteeIndividualPrintComponent } from './personal-guarantee-individual/personal-guarantee-individual-print/personal-guarantee-individual-print.component';
import { PersonalGuaranteeIndividualComponent } from './personal-guarantee-individual/personal-guarantee-individual.component';
import { PersonalGuaranteeCompanyComponent } from './personal-guarantee-company/personal-guarantee-company.component';


@NgModule({
    declarations: [PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, LetterOfSetOffComponent,
        LetterOfSetOffPrintComponent, PersonalGuaranteeIndividualComponent, PersonalGuaranteeIndividualPrintComponent,
        PersonalGuaranteeCompanyComponent],
    exports: [
        PromissoryNoteIndividualComponent,
        LetterOfSetOffComponent,
        PersonalGuaranteeCompanyComponent,
        PersonalGuaranteeIndividualComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPrintModule,
        NbButtonModule
    ]
})
export class NabilModule { }
