import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LaxmiOfferLetterComponent} from './laxmi-offer-letter/laxmi-offer-letter.component';
import {NbCardModule, NbRadioModule, NbSpinnerModule} from '@nebular/theme';
import {LetterOfCommitmentComponent} from './laxmi-offer-letter/letter-of-commitment/letter-of-commitment.component';
import {PersonalGuaranteeComponent} from './laxmi-offer-letter/personal-guarantee/personal-guarantee.component';
import {OfferLetterComponent} from './laxmi-offer-letter/offer-letter/offer-letter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import {LetterOfCommitmentPrintComponent} from './laxmi-offer-letter/letter-of-commitment/letter-of-commitment-print/letter-of-commitment-print.component';
import {OfferLetterPrintComponent} from './laxmi-offer-letter/offer-letter/offer-letter-print/offer-letter-print.component';
import {CoreModule} from '../../../../@core/core.module';
import {PersonalGuaranteePrintComponent} from './laxmi-offer-letter/personal-guarantee/personal-guarantee-print/personal-guarantee-print.component';

import {LoanDeedIndividualComponent} from './laxmi-offer-letter/loan-deed-individual/loan-deed-individual.component';
import {LoanDeedIndividualPrintComponent} from './laxmi-offer-letter/loan-deed-individual/loan-deed-individual-print/loan-deed-individual-print.component';
import {PromisoryNoteIndividualComponent} from './laxmi-offer-letter/promisory-note-individual/promisory-note-individual.component';
import {PromisoryNoteIndividualPrintComponent} from './laxmi-offer-letter/promisory-note-individual/promisory-note-individual-print/promisory-note-individual-print.component';
import {SelfDeclarationComponent} from './laxmi-offer-letter/self-declaration/self-declaration.component';
import {SelfDeclarationPrintComponent} from './laxmi-offer-letter/self-declaration/self-declaration-print/self-declaration-print.component';
import {NrbKycComponent} from './laxmi-offer-letter/nrb-kyc/nrb-kyc.component';
import {NrbKycPrintComponent} from './laxmi-offer-letter/nrb-kyc/nrb-kyc-print/nrb-kyc-print.component';
// tslint:disable-next-line:max-line-length
import {PromisoryNoteInstitutionalComponent} from './laxmi-offer-letter/promisory-note-institutional/promisory-note-institutional.component';
import {PromisoryNoteInstitutionalPrintComponent} from './laxmi-offer-letter/promisory-note-institutional/promisory-note-institutional-print/promisory-note-institutional-print.component';
import {LoanDeedInstitutionalComponent} from './laxmi-offer-letter/loan-deed-institutional/loan-deed-institutional.component';
import {LoanDeedInstitutionalPrintComponent} from './laxmi-offer-letter/loan-deed-institutional/loan-deed-institutional-print/loan-deed-institutional-print.component';
import { CorporateGuranteeComponent } from './laxmi-offer-letter/corporate-guarantee/corporate-gurantee.component';
import {PersonalGuaranteeInstitutionalComponent} from './laxmi-offer-letter/personal-guarantee-institutional/personal-guarantee-institutional.component';
import { PersonalGuaranteeInstitutionalPrintComponent } from './laxmi-offer-letter/personal-guarantee-institutional/personal-guarantee-institutional-print/personal-guarantee-institutional-print.component';
import { PersonalGuaranteeIndividualComponent } from './laxmi-offer-letter/personal-guarantee-individual/personal-guarantee-individual.component';
import { HypothecationOverStockAndReceivableCurrentAssetsComponent } from './laxmi-offer-letter/hypothecation-over-stock-and-receivable-current-assets/hypothecation-over-stock-and-receivable-current-assets.component';
import { ConsentOfHakwalaComponent } from './laxmi-offer-letter/consent-of-hakwala/consent-of-hakwala.component';
import { MortgageDeedLaxmiComponent } from './laxmi-offer-letter/mortgage-deed-laxmi/mortgage-deed-laxmi.component';
import { HypothecationChargeOverFixedAssetsComponent } from './laxmi-offer-letter/hypothecation-charge-over-fixed-assets/hypothecation-charge-over-fixed-assets.component';
import { OfferLetterLaxmiComponent } from './laxmi-offer-letter/offer-letter-laxmi/offer-letter-laxmi.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {CKEditorModule} from 'ng2-ckeditor';
import {ThemeModule} from '../../../../@theme/theme.module';
import { ConsentOfSellersHakwalaComponent } from './laxmi-offer-letter/consent-of-sellers-hakwala/consent-of-sellers-hakwala.component';
import { GuarantorAcknowledgementComponent } from './laxmi-offer-letter/guarantor-acknowledgement/guarantor-acknowledgement.component';
import { ConsentForLeinComponent } from './laxmi-offer-letter/consent-for-lein/consent-for-lein.component';
import { StatementOfPositionComponent } from './laxmi-offer-letter/statement-of-position/statement-of-position.component';
import {AnusuchiComponent} from './laxmi-offer-letter/anusuchi/anusuchi.component';

@NgModule({
    declarations: [LaxmiOfferLetterComponent,
        LetterOfCommitmentComponent,
        PersonalGuaranteeComponent,
        OfferLetterComponent,
        LetterOfCommitmentPrintComponent,
        OfferLetterPrintComponent,
        PersonalGuaranteePrintComponent,
        LoanDeedIndividualComponent,
        LoanDeedIndividualPrintComponent,
        PromisoryNoteIndividualComponent,
        PromisoryNoteIndividualPrintComponent,
        SelfDeclarationComponent,
        SelfDeclarationPrintComponent,
        NrbKycComponent,
        NrbKycPrintComponent,
        PromisoryNoteInstitutionalComponent,
        PromisoryNoteInstitutionalPrintComponent,
        LoanDeedInstitutionalComponent,
        LoanDeedInstitutionalPrintComponent,
        PersonalGuaranteeInstitutionalComponent,
        PersonalGuaranteeInstitutionalPrintComponent,
        PersonalGuaranteeIndividualComponent,
        HypothecationOverStockAndReceivableCurrentAssetsComponent,
        ConsentOfHakwalaComponent,
        CorporateGuranteeComponent,
        ConsentOfHakwalaComponent,
        MortgageDeedLaxmiComponent,
        HypothecationChargeOverFixedAssetsComponent,
        OfferLetterLaxmiComponent,
        ConsentOfSellersHakwalaComponent,
        GuarantorAcknowledgementComponent,
        ConsentForLeinComponent,
        StatementOfPositionComponent,
        AnusuchiComponent],

    imports: [
        CommonModule,
        NbCardModule,
        ReactiveFormsModule,
        NbSpinnerModule,
        NgxPrintModule,
        CoreModule,
        NbRadioModule,
        NgSelectModule,
        CKEditorModule,
        ThemeModule,
    ],
    exports: [
        LoanDeedIndividualComponent,
        PromisoryNoteIndividualComponent,
        SelfDeclarationComponent,
        NrbKycComponent,
        LoanDeedInstitutionalComponent,
        PromisoryNoteInstitutionalComponent,
        PersonalGuaranteeInstitutionalComponent,
        PersonalGuaranteeIndividualComponent,
        HypothecationOverStockAndReceivableCurrentAssetsComponent,
        ConsentOfHakwalaComponent,
        CorporateGuranteeComponent,
        ConsentOfHakwalaComponent,
        MortgageDeedLaxmiComponent,
        HypothecationChargeOverFixedAssetsComponent,
        OfferLetterLaxmiComponent,
        ConsentOfSellersHakwalaComponent,
        GuarantorAcknowledgementComponent,
        ConsentForLeinComponent,
        StatementOfPositionComponent,
        AnusuchiComponent
    ],
    entryComponents: [
        LaxmiOfferLetterComponent
    ]
})
export class LaxmiModule {
}
