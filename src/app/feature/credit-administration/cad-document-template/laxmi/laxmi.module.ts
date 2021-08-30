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


@NgModule({
    declarations: [LaxmiOfferLetterComponent, LetterOfCommitmentComponent, PersonalGuaranteeComponent, OfferLetterComponent, LetterOfCommitmentPrintComponent],
    imports: [
        CommonModule,
        NbCardModule,
        ReactiveFormsModule,
        NbSpinnerModule,
        NgxPrintModule
    ],
    entryComponents: [
        LaxmiOfferLetterComponent
    ]
})
export class LaxmiModule {
}
