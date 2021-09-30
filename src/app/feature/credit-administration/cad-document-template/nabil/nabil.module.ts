import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromissoryNoteIndividualComponent} from './promissory-note-individual/promissory-note-individual.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PromissoryNoteIndividualPrintComponent} from './promissory-note-individual/promissory-note-individual-print/promissory-note-individual-print.component';
import {NgxPrintModule} from 'ngx-print';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';


@NgModule({
    declarations: [PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, PromissoryNoteCompanyComponent, PromissoryNoteCompanyComponent],
    exports: [
        PromissoryNoteIndividualComponent,
        PromissoryNoteCompanyComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPrintModule
    ]
})
export class NabilModule {
}
