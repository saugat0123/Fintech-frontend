import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeModule} from '../../../../@theme/theme.module';
import {NgxPrintModule} from 'ngx-print';
import {CoreModule} from '../../../../@core/core.module';
import {NbAccordionModule} from '@nebular/theme';
import {ProgressiveOfferLetterComponent} from './progressive-offer-letter/progressive-offer-letter.component';
import {LetterOfArrangementsComponent} from './progressive-legal-docs/letter-of-arrangements/letter-of-arrangements.component';
import {LetterOfArrangementsPrintComponent} from './progressive-legal-docs/letter-of-arrangements/letter-of-arrangements-print/letter-of-arrangements-print.component';
import {LetterOfInstallmentsComponent} from './progressive-legal-docs/letter-of-installments/letter-of-installments.component';
import {LetterOfLeinComponent} from './progressive-legal-docs/letter-of-lein/letter-of-lein.component';
import {PromissoryNoteComponent} from './progressive-legal-docs/promissory-note/promissory-note.component';
import {LoanDeedComponent} from './progressive-legal-docs/loan-deed/loan-deed.component';
import {LetterOfInstallmentsPrintComponent} from './progressive-legal-docs/letter-of-installments/letter-of-installments-print/letter-of-installments-print.component';
import {LetterOfLeinPrintComponent} from './progressive-legal-docs/letter-of-lein/letter-of-lein-print/letter-of-lein-print.component';
import {PromissoryNotePrintComponent} from './progressive-legal-docs/promissory-note/promissory-note-print/promissory-note-print.component';
import {PromissoryNoteGuarantorComponent} from './progressive-legal-docs/promissory-note-guarantor/promissory-note-guarantor.component';
import {PromissoryNoteGuarantorPrintComponent} from './progressive-legal-docs/promissory-note-guarantor/promissory-note-guarantor-print/promissory-note-guarantor-print.component';
import {LetterOfAgreementComponent} from './progressive-legal-docs/letter-of-agreement/letter-of-agreement.component';
import {LetterOfAgreementPrintComponent} from './progressive-legal-docs/letter-of-agreement/letter-of-agreement-print/letter-of-agreement-print.component';
import {LoanDeedPrintComponent} from './progressive-legal-docs/loan-deed/loan-deed-print/loan-deed-print.component';
import {HirePurchaseDeedComponent} from './progressive-legal-docs/hire-purchase-deed/hire-purchase-deed.component';
import {GuaranteeBondCorporateComponent} from './progressive-legal-docs/guarantee-bond-corporate/guarantee-bond-corporate.component';
import {IndemnityDeedComponent} from './progressive-legal-docs/indemnity-deed/indemnity-deed.component';
import {LetterOfContinuityComponent} from './progressive-legal-docs/letter-of-continuity/letter-of-continuity.component';
import {LetterOfDisbursementComponent} from './progressive-legal-docs/letter-of-disbursement/letter-of-disbursement.component';
import {HirePurchaseDeedPrintComponent} from './progressive-legal-docs/hire-purchase-deed/hire-purchase-deed-print/hire-purchase-deed-print.component';
import {IndemnityDeedPrintComponent} from './progressive-legal-docs/indemnity-deed/indemnity-deed-print/indemnity-deed-print.component';
import {LetterOfDisbursementPrintComponent} from './progressive-legal-docs/letter-of-disbursement/letter-of-disbursement-print/letter-of-disbursement-print.component';
import {GuaranteeBondCorporatePrintComponent} from './progressive-legal-docs/guarantee-bond-corporate/guarantee-bond-corporate-print/guarantee-bond-corporate-print.component';
import {LetterOfContinuityPrintComponent} from './progressive-legal-docs/letter-of-continuity/letter-of-continuity-print/letter-of-continuity-print.component';
import {CrossGuaranteeBondComponent} from './progressive-legal-docs/cross-guarantee-bond/cross-guarantee-bond.component';
import {GuaranteeBondPersonalComponent} from './progressive-legal-docs/guarantee-bond-personal/guarantee-bond-personal.component';
import {HypothecationOfGoodsAndReceivablesBComponent} from './progressive-legal-docs/hypothecation-of-goods-and-receivables-b/hypothecation-of-goods-and-receivables-b.component';
import {MortgageDeedComponent} from './progressive-legal-docs/mortgage-deed/mortgage-deed.component';
import {OfferLetterCorporateComponent} from './progressive-offer-letter/offer-letter-corporate/offer-letter-corporate.component';
import {OfferLetterPersonalComponent} from './progressive-offer-letter/offer-letter-personal/offer-letter-personal.component';
import {HypothecationOfGoodsAndReceivablesBPrintComponent} from './progressive-legal-docs/hypothecation-of-goods-and-receivables-b/hypothecation-of-goods-and-receivables-b-print/hypothecation-of-goods-and-receivables-b-print.component';
import {MortgageDeedPrintComponent} from './progressive-legal-docs/mortgage-deed/mortgage-deed-print/mortgage-deed-print.component';
import {OfferLetterCorporatePrintComponent} from './progressive-offer-letter/offer-letter-corporate/offer-letter-corporate-print/offer-letter-corporate-print.component';

import {CrossGuaranteeBondPrintComponent} from './progressive-legal-docs/cross-guarantee-bond/cross-guarantee-bond-print/cross-guarantee-bond-print.component';
import {GuaranteeBondPersonalPrintComponent} from './progressive-legal-docs/guarantee-bond-personal/guarantee-bond-personal-print/guarantee-bond-personal-print.component';
import {OfferLetterPersonalPrintComponent} from './progressive-offer-letter/offer-letter-personal/offer-letter-personal-print/offer-letter-personal-print.component';
import {HypothecationOfGoodsAndReceivablesAComponent} from './progressive-legal-docs/hypothecation-of-goods-and-receivables-a/hypothecation-of-goods-and-receivables-a.component';
import {HypothecationOfGoodsAndReceivablesAPrintComponent} from './progressive-legal-docs/hypothecation-of-goods-and-receivables-a/hypothecation-of-goods-and-receivables-a-print/hypothecation-of-goods-and-receivables-a-print.component';
import {ProgressiveLegalDocsComponent} from './progressive-legal-docs/progressive-legal-docs.component';
import {LetterOfContinuityInstitutionalComponent} from './progressive-legal-docs/letter-of-continuity-institutional/letter-of-continuity-institutional.component';
import { LetterOfContinuityInstitutionalPrintComponent } from './progressive-legal-docs/letter-of-continuity-institutional/letter-of-continuity-institutional-print/letter-of-continuity-institutional-print.component';
import { AuthorityToDebtAccountComponent } from './progressive-legal-docs/authority-to-debt-account/authority-to-debt-account.component';
import { AuthorityToDebtAccountPrintComponent } from './progressive-legal-docs/authority-to-debt-account/authority-to-debt-account-print/authority-to-debt-account-print.component';
import { PromisoryNoteInstitutionalComponent } from './progressive-legal-docs/promisory-note-institutional/promisory-note-institutional.component';
import { PromisoryNoteInstitutionalPrintComponent } from './progressive-legal-docs/promisory-note-institutional/promisory-note-institutional-print/promisory-note-institutional-print.component';
import { BlacklistConsentComponent } from './progressive-legal-docs/blacklist-consent/blacklist-consent.component';
import { BlacklistConsentPrintComponent } from './progressive-legal-docs/blacklist-consent/blacklist-consent-print/blacklist-consent-print.component';
import { RokkaLetterComponent } from './progressive-legal-docs/rokka-letter/rokka-letter.component';
import { RokkaLetterPrintComponent } from './progressive-legal-docs/rokka-letter/rokka-letter-print/rokka-letter-print.component';
import { ConsentLetterIndividualComponent } from './progressive-legal-docs/consent-letter-individual/consent-letter-individual.component';
import { ConsentLetterIndividualPrintComponent } from './progressive-legal-docs/consent-letter-individual/consent-letter-individual-print/consent-letter-individual-print.component';
import { BlacklistConsentCorporateComponent } from './progressive-legal-docs/blacklist-consent-corporate/blacklist-consent-corporate.component';
import { BlacklistConsentCorporatePrintComponent } from './progressive-legal-docs/blacklist-consent-corporate/blacklist-consent-corporate-print/blacklist-consent-corporate-print.component';

const COMPONENTS = [
  LetterOfArrangementsComponent, LetterOfArrangementsPrintComponent,
  LetterOfInstallmentsComponent];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ProgressiveOfferLetterComponent,
    ProgressiveLegalDocsComponent,
    LetterOfLeinComponent,
    PromissoryNoteComponent,
    LoanDeedComponent,
    LetterOfInstallmentsPrintComponent,
    LetterOfLeinPrintComponent,
    PromissoryNotePrintComponent,
    PromissoryNoteGuarantorComponent,
    PromissoryNoteGuarantorPrintComponent,
    LetterOfAgreementComponent,
    LetterOfAgreementPrintComponent,
    LoanDeedPrintComponent,
    HirePurchaseDeedComponent,
    GuaranteeBondCorporateComponent,
    IndemnityDeedComponent,
    LetterOfContinuityComponent,
    LetterOfDisbursementComponent,
    HirePurchaseDeedPrintComponent,
    IndemnityDeedPrintComponent,
    LetterOfDisbursementPrintComponent,
    GuaranteeBondCorporatePrintComponent,
    LetterOfContinuityPrintComponent,
    CrossGuaranteeBondComponent,
    GuaranteeBondPersonalComponent,
    HypothecationOfGoodsAndReceivablesAComponent,
    HypothecationOfGoodsAndReceivablesBComponent,
    MortgageDeedComponent,
    OfferLetterCorporateComponent,
    OfferLetterPersonalComponent,
    CrossGuaranteeBondPrintComponent,
    GuaranteeBondPersonalPrintComponent,
    OfferLetterCorporatePrintComponent,
    OfferLetterPersonalPrintComponent,
    HypothecationOfGoodsAndReceivablesAPrintComponent,
    OfferLetterPersonalComponent,
    HypothecationOfGoodsAndReceivablesBPrintComponent,
    MortgageDeedPrintComponent,
    PromisoryNoteInstitutionalComponent,
    PromisoryNoteInstitutionalPrintComponent,
    BlacklistConsentComponent,
    BlacklistConsentPrintComponent,
    LetterOfContinuityInstitutionalComponent,
    LetterOfContinuityInstitutionalPrintComponent,
    AuthorityToDebtAccountComponent,
    AuthorityToDebtAccountPrintComponent,
    RokkaLetterComponent,
    RokkaLetterPrintComponent,
    ConsentLetterIndividualComponent,
    ConsentLetterIndividualPrintComponent,
    BlacklistConsentCorporateComponent,
    BlacklistConsentCorporatePrintComponent,

  ],
    exports: [
        ...COMPONENTS,
        LetterOfLeinComponent,
        PromissoryNoteComponent,
        LoanDeedComponent,
        PromissoryNoteGuarantorComponent,
        LetterOfAgreementComponent,
        HirePurchaseDeedComponent,
        IndemnityDeedComponent,
        LetterOfDisbursementComponent,
        GuaranteeBondCorporateComponent,
        LetterOfContinuityComponent,
        CrossGuaranteeBondComponent,
        GuaranteeBondPersonalComponent,
        HypothecationOfGoodsAndReceivablesAComponent,
        HypothecationOfGoodsAndReceivablesBComponent,
        MortgageDeedComponent,
        PromisoryNoteInstitutionalComponent,
        BlacklistConsentComponent,
        MortgageDeedComponent,
        LetterOfContinuityInstitutionalComponent,
        AuthorityToDebtAccountComponent,
        RokkaLetterComponent,
        ConsentLetterIndividualComponent,
        BlacklistConsentCorporateComponent
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
