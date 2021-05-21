import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExcelOfferLetterComponent} from './excel-offer-letter/excel-offer-letter.component';
import {ThemeModule} from '../../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../@core/core.module';
import {NbAccordionModule} from '@nebular/theme';
import {DristibadhakiComponent} from './excel-offer-letter/dristibadhaki/dristibadhaki.component';
import {DpNoteGuarantorComponent} from './excel-offer-letter/dp-note-guarantor/dp-note-guarantor.component';
import {PledgeDeedFirstComponent} from './excel-offer-letter/pledge-deed-first/pledge-deed-first.component';
import {DpNoteBorrowerComponent} from './excel-offer-letter/dp-note-borrower/dp-note-borrower.component';
import {PgFirmComponent} from './excel-offer-letter/pg-firm/pg-firm.component';
import {PgRetailLoanComponent} from './excel-offer-letter/pg-retail-loan/pg-retail-loan.component';
import {ContinuationDeedComponent} from './excel-offer-letter/continuation-deed/continuation-deed.component';
import {DristibandhakiPrintComponent} from './excel-offer-letter/dristibadhaki/dristibandhaki-print/dristibandhaki-print.component';
import {DpNoteBorrowerPrintComponent} from './excel-offer-letter/dp-note-borrower/dp-note-borrower-print/dp-note-borrower-print.component';
import {PledgeDeedFirstPrintComponent} from './excel-offer-letter/pledge-deed-first/pledge-deed-first-print/pledge-deed-first-print.component';
import {DpNoteGuarantorPrintComponent} from './excel-offer-letter/dp-note-guarantor/dp-note-guarantor-print/dp-note-guarantor-print.component';
import {PgFirmPrintComponent} from './excel-offer-letter/pg-firm/pg-firm-print/pg-firm-print.component';
import {PgRetailLoanPrintComponent} from './excel-offer-letter/pg-retail-loan/pg-retail-loan-print/pg-retail-loan-print.component';
import {ContinuationDeedPrintComponent} from './excel-offer-letter/continuation-deed/continuation-deed-print/continuation-deed-print.component';

const COMPONENTS = [
    ExcelOfferLetterComponent,
    DristibadhakiComponent,
    DristibandhakiPrintComponent,
    DpNoteGuarantorComponent,
    DpNoteBorrowerPrintComponent,
    PledgeDeedFirstComponent,
    DpNoteBorrowerComponent,
    PgFirmComponent,
    PgRetailLoanComponent,
    ContinuationDeedComponent,
    ContinuationDeedPrintComponent,
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        DristibandhakiPrintComponent,
        DpNoteBorrowerPrintComponent,
        PledgeDeedFirstPrintComponent,
        DpNoteGuarantorPrintComponent,
        PgFirmPrintComponent,
        PgRetailLoanPrintComponent,
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
        ExcelOfferLetterComponent
    ]
})
export class ExcelOfferLetterTemplateModule {
}
