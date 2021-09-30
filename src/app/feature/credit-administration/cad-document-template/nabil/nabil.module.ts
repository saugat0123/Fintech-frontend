import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromissoryNoteIndividualComponent} from './promissory-note-individual/promissory-note-individual.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PromissoryNoteIndividualPrintComponent } from './promissory-note-individual/promissory-note-individual-print/promissory-note-individual-print.component';
import {NgxPrintModule} from 'ngx-print';
import {NbButtonModule} from '@nebular/theme';
import {LetterOfSetOffComponent} from './letter-of-set-off/letter-of-set-off.component';
import {LetterOfSetOffPrintComponent} from './letter-of-set-off/letter-of-set-off-print/letter-of-set-off-print.component';
import { LoanDeedCompanyComponent } from './loan-deed-company/loan-deed-company.component';
import { LoanDeedCompanyPrintComponent } from './loan-deed-company/loan-deed-company-print/loan-deed-company-print.component';


@NgModule({
    declarations: [PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, LetterOfSetOffComponent,
        LetterOfSetOffPrintComponent,
        LoanDeedCompanyComponent,
        LoanDeedCompanyPrintComponent],
    exports: [
        PromissoryNoteIndividualComponent,
        LetterOfSetOffComponent,
        LoanDeedCompanyComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPrintModule,
        NbButtonModule
    ]
})
export class NabilModule { }
