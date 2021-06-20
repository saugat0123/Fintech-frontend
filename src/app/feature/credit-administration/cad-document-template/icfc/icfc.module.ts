import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IcfcOfferLetterComponent} from './icfc-offer-letter/icfc-offer-letter.component';
import { LetterOfArrangementsComponent } from './icfc-offer-letter/letter-of-arrangements/letter-of-arrangements.component';
import {ThemeModule} from '../../../../@theme/theme.module';
import { LetterOfAgreementComponent } from './icfc-offer-letter/letter-of-agreement/letter-of-agreement.component';
import { MarginCallDeedShareLoanCompanyComponent } from './icfc-offer-letter/margin-call-deed-share-loan-company/margin-call-deed-share-loan-company.component';
import { MarginCallDeedShareLoanComponent } from './icfc-offer-letter/margin-call-deed-share-loan/margin-call-deed-share-loan.component';
import { PromissoryNoteComponent } from './icfc-offer-letter/promissory-note/promissory-note.component';
import { MortgageDeedCompanyComponent } from './icfc-offer-letter/mortgage-deed-company/mortgage-deed-company.component';
import { MrtgDeedIndividualDifferentComponent } from './icfc-offer-letter/mrtg-deed-individual-different/mrtg-deed-individual-different.component';
import { MrtgDeedIndividualSameComponent } from './icfc-offer-letter/mrtg-deed-individual-same/mrtg-deed-individual-same.component';

@NgModule({
    declarations: [IcfcOfferLetterComponent, LetterOfArrangementsComponent, LetterOfAgreementComponent, MarginCallDeedShareLoanCompanyComponent, MarginCallDeedShareLoanComponent, PromissoryNoteComponent, MortgageDeedCompanyComponent, MrtgDeedIndividualDifferentComponent, MrtgDeedIndividualSameComponent],
    imports: [
        CommonModule,
        ThemeModule
    ],
    entryComponents: [
        IcfcOfferLetterComponent
    ]
})
export class IcfcModule {
}
