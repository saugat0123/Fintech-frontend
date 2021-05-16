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

const COMPONENTS = [
    ExcelOfferLetterComponent,
    DristibadhakiComponent,
    DpNoteGuarantorComponent,
    PledgeDeedFirstComponent,
    DpNoteBorrowerComponent,
    PgFirmComponent,
    PgRetailLoanComponent,
    ContinuationDeedComponent
];

@NgModule({
    declarations: [
        ...COMPONENTS,
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
