import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromissoryNoteIndividualComponent } from './promissory-note-individual/promissory-note-individual.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PromissoryNoteIndividualPrintComponent } from './promissory-note-individual/promissory-note-individual-print/promissory-note-individual-print.component';
import {NgxPrintModule} from 'ngx-print';



@NgModule({
    declarations: [PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent],
    exports: [
        PromissoryNoteIndividualComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPrintModule
    ]
})
export class NabilModule { }
