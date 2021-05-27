import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../../@core/core.module';
import {NbAccordionModule} from '@nebular/theme';
import {ProgressiveOfferLetterComponent} from './progressive-offer-letter/progressive-offer-letter.component';
import {LetterOfArrangementsComponent} from './progressive-offer-letter/letter-of-arrangements/letter-of-arrangements.component';
import { LetterOfArrangementsPrintComponent } from './progressive-offer-letter/letter-of-arrangements/letter-of-arrangements-print/letter-of-arrangements-print.component';

const COMPONENTS = [];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ProgressiveOfferLetterComponent,
        LetterOfArrangementsComponent,
        LetterOfArrangementsPrintComponent,

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
