import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromissoryNoteIndividualComponent} from './promissory-note-individual/promissory-note-individual.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PromissoryNoteIndividualPrintComponent} from './promissory-note-individual/promissory-note-individual-print/promissory-note-individual-print.component';
import {NgxPrintModule} from 'ngx-print';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';
import {NbButtonModule, NbCardModule, NbSpinnerModule} from '@nebular/theme';
import {LetterOfSetOffComponent} from './letter-of-set-off/letter-of-set-off.component';
import {LetterOfSetOffPrintComponent} from './letter-of-set-off/letter-of-set-off-print/letter-of-set-off-print.component';
import {LoanDeedPartnershipComponent} from './loan-deed-partnership/loan-deed-partnership.component';
import {PersonalGuaranteeIndividualPrintComponent} from './personal-guarantee-individual/personal-guarantee-individual-print/personal-guarantee-individual-print.component';
import {PersonalGuaranteeIndividualComponent} from './personal-guarantee-individual/personal-guarantee-individual.component';
import {PersonalGuaranteeCompanyComponent} from './personal-guarantee-company/personal-guarantee-company.component';
import {NabilLoanDeedCompanyComponent} from './nabil-loan-deed-company/nabil-loan-deed-company.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {LoanDeedIndividualComponent} from './loan-deed-individual/loan-deed-individual.component';
import {LoanDeedIndividualPrintComponent} from './loan-deed-individual/loan-deed-individual-print/loan-deed-individual-print.component';
import {PromissoryNotePartnershipComponent} from './promissory-note-partnership/promissory-note-partnership.component';
import {PromissoryNotePartnershipPrintComponent} from './promissory-note-partnership/promissory-note-partnership-print/promissory-note-partnership-print.component';
import { PersonalGuaranteePartnershipComponent } from './personal-guarantee-partnership/personal-guarantee-partnership.component';
import {PromissoryNoteProprietorshipComponent} from './promissory-note-proprietorship/promissory-note-proprietorship.component';
import {PromissoryNoteProprietorshipPrintComponent} from './promissory-note-proprietorship/promissory-note-propertiership-print/promissory-note-proprietorship-print.component';
import {LetterVehicleThirdpartyCompanyComponent} from './letter-vehicle-thirdparty-company/letter-vehicle-thirdparty-company.component';
import {LetterVehicleThirdpartyCompanyPrintComponent} from './letter-vehicle-thirdparty-company/letter-vehicle-thirdparty-company-print/letter-vehicle-thirdparty-company-print.component';
import { LetterVehicleIndividualComponent } from './letter-vehicle-individual/letter-vehicle-individual.component';
import { LetterVehicleIndividualPrintComponent } from './letter-vehicle-individual/letter-vehicle-individual-print/letter-vehicle-individual-print.component';
import { PromissoryNoteCompanyPrintComponent } from './promissory-note-company/promissory-note-company-print/promissory-note-company-print.component';
import {PersonalGuaranteeProprietorshipComponent} from './personal-guarantee-proprietorship/personal-gaurantee-proprietorship.component';
import { MegaOfferLetterTemplateModule } from '../../mega-offer-letter-template/mega-offer-letter-template.module';
import { NabilSmeComponent } from './nabil-sme/nabil-sme.component';
import { KisanKarjaSubsidyComponent } from './nabil-sme/kisan-karja-subsidy/kisan-karja-subsidy.component';
import { UdyamsilKarjaSubsidyComponent } from './nabil-sme/udyamsil-karja-subsidy/udyamsil-karja-subsidy.component';
import { UdyamsilKarjaSubsidyPrintComponent } from './nabil-sme/udyamsil-karja-subsidy/udyamsil-karja-subsidy-print/udyamsil-karja-subsidy-print.component';
import { KisanKarjaSubsidyPrintComponent } from './nabil-sme/kisan-karja-subsidy/kisan-karja-subsidy-print/kisan-karja-subsidy-print.component';
import {ThemeModule} from '../../../../@theme/theme.module';
import {InterestSubsidySanctionLetterComponent} from './nabil-sme/interest-subsidy-sanction-letter/interest-subsidy-sanction-letter.component';
import { DdslWithoutSubsidyComponent } from './nabil-sme/ddsl-without-subsidy/ddsl-without-subsidy.component';
import { DdslWithoutSubsidyPrintComponent } from './nabil-sme/ddsl-without-subsidy/ddsl-without-subsidy-print/ddsl-without-subsidy-print.component';
import { CombinedOfferLetterComponent } from './nabil-sme/combined-offer-letter/combined-offer-letter.component';
import { Section1IntroductionComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section1-introduction/section1-introduction.component';
import { Section2LoanTypeComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/section2-loan-type.component';
import { Section3SecurityAndCollateralComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section3-security-and-collateral/section3-security-and-collateral.component';
import { Section4LoanLimitComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section4-loan-limit/section4-loan-limit.component';
import { Section5InterstPenalChargeComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section5-interst-penal-charge/section5-interst-penal-charge.component';
import { Section6FacilitiesClauseComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section6-facilities-clause/section6-facilities-clause.component';
import { Section7SecurityClauseComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section7-security-clause/section7-security-clause.component';
import { Section8InsuranceClauseComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section8-insurance-clause/section8-insurance-clause.component';
import { Section9OtherClauseComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section9-other-clause/section9-other-clause.component';
import { Section10SecurityDocumentsComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section10-security-documents/section10-security-documents.component';
import { CombinedOfferLetterPrintComponent } from './nabil-sme/combined-offer-letter/combined-offer-letter-print/combined-offer-letter-print.component';
import { Section6FacilitiesClausePrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section6-facilities-clause/section6-facilities-clause-print/section6-facilities-clause-print.component';
import { Section9OtherClausePrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section9-other-clause/section9-other-clause-print/section9-other-clause-print.component';
import { Section1IntroductionPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section1-introduction/section1-introduction-print/section1-introduction-print.component';
import { Section4LoanLimitPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section4-loan-limit/section4-loan-limit-print/section4-loan-limit-print.component';
import { Section5InterestPenalChargePrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section5-interst-penal-charge/section5-interest-penal-charge-print/section5-interest-penal-charge-print.component';
import { Section8InsuranceClausePrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section8-insurance-clause/section8-insurance-clause-print/section8-insurance-clause-print.component';
import { Section3SecurityAndCollateralPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section3-security-and-collateral/section3-security-and-collateral-print/section3-security-and-collateral-print.component';
import { Section7SecurityClausePrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section7-security-clause/section7-security-clause-print/section7-security-clause-print.component';
import { Section10SecurityDocumentsPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section10-security-documents/section10-security-documents-print/section10-security-documents-print.component';
import { Section2LoanTypePrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/section2-loan-type-print/section2-loan-type-print.component';
import { TermLoanToOrForComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/term-loan-to-or-for/term-loan-to-or-for.component';
import { TermLoanToOrForPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/term-loan-to-or-for/term-loan-to-or-for-print/term-loan-to-or-for-print.component';
import { MortgageEquityTermLoanComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/mortgage-equity-term-loan/mortgage-equity-term-loan.component';
import { MortgageEquityTermLoanPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/mortgage-equity-term-loan/mortgage-equity-term-loan-print/mortgage-equity-term-loan-print.component';
import { AutoLoanComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/auto-loan/auto-loan.component';
import { AutoLoanPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/section2-loan-type/auto-loan/auto-loan-print/auto-loan-print.component';
import { CommonSectionTopComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/common-section-top/common-section-top.component';
import { CommonSectionBottomComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/common-section-bottom/common-section-bottom.component';
import { CommonSectionBottomPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/common-section-bottom/common-section-bottom-print/common-section-bottom-print.component';
import { CommonSectionTopPrintComponent } from './nabil-sme/combined-offer-letter/combined-letter-sections/common-section-top/common-section-top-print/common-section-top-print.component';
import { MasterSecuritiesViewComponent } from './master-securities-view/master-securities-view.component';
import { MasterSecondarySecuritiesViewComponent } from './master-secondary-securities-view/master-secondary-securities-view.component';
import { SharePledgeSecuritiesComponent } from './share-pledge-securities/share-pledge-securities.component';
import {CoreModule} from '../../../../@core/core.module';
import { LoanDeedProprietorshipComponent } from './loan-deed-proprietorship/loan-deed-proprietorship.component';

import { CounterGuaranteeCompanyComponent } from './counter-guarantee-company/counter-guarantee-company.component';
import { LetterOfHypothecationProprietorshipComponent } from './nabil-sme/legal-documents/letter-of-hypothecation-proprietorship/letter-of-hypothecation-proprietorship.component';
import { LetterOfHypothecationPartnershipComponent } from './nabil-sme/legal-documents/letter-of-hypothecation-partnership/letter-of-hypothecation-partnership.component';
import { LetterOfHypothecationCompanyComponent } from './nabil-sme/legal-documents/letter-of-hypothecation-company/letter-of-hypothecation-company.component';
import { SupplementaryAggrementProprietorshipComponent } from './nabil-sme/legal-documents/supplementary-aggrement-proprietorship/supplementary-aggrement-proprietorship.component';
import { SupplementaryAggrementPartnershipComponent } from './nabil-sme/legal-documents/supplementary-aggrement-partnership/supplementary-aggrement-partnership.component';
import { SupplementaryAggrementCompanyComponent } from './nabil-sme/legal-documents/supplementary-aggrement-company/supplementary-aggrement-company.component';
import { AssignmentOfReceivableProprietorshipComponent } from './nabil-sme/legal-documents/assignment-of-receivable-proprietorship/assignment-of-receivable-proprietorship.component';
import { AssignmentOfReceivablePartnershipComponent } from './nabil-sme/legal-documents/assignment-of-receivable-partnership/assignment-of-receivable-partnership.component';
import { AssignmentOfReceivableCompanyComponent } from './nabil-sme/legal-documents/assignment-of-receivable-company/assignment-of-receivable-company.component';
import { PowerOfAttorneyProprietorshipComponent } from './nabil-sme/legal-documents/power-of-attorney-proprietorship/power-of-attorney-proprietorship.component';
import { PowerOfAttorneyPartnershipComponent } from './nabil-sme/legal-documents/power-of-attorney-partnership/power-of-attorney-partnership.component';
import { PowerOfAttorneyCompanyComponent } from './nabil-sme/legal-documents/power-of-attorney-company/power-of-attorney-company.component';
import { CounterGuaranteeProprietorshipComponent } from './counter-guarantee-proprietorship/counter-guarantee-proprietorship.component';
import { CounterGuaranteePartnershipComponent } from './counter-guarantee-partnership/counter-guarantee-partnership.component';

@NgModule({
    declarations: [
        PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, LetterOfSetOffComponent,
        LetterOfSetOffPrintComponent, PersonalGuaranteeIndividualComponent, PersonalGuaranteeIndividualPrintComponent,
        PersonalGuaranteeCompanyComponent, PromissoryNoteCompanyComponent, NabilLoanDeedCompanyComponent,
         LoanDeedIndividualPrintComponent, PromissoryNotePartnershipComponent, PromissoryNotePartnershipPrintComponent, PersonalGuaranteePartnershipComponent,
        PersonalGuaranteeCompanyComponent, PromissoryNoteCompanyComponent, NabilLoanDeedCompanyComponent,
        LetterVehicleIndividualComponent, LetterVehicleIndividualPrintComponent,
         PromissoryNoteProprietorshipComponent, PromissoryNoteProprietorshipPrintComponent,
        PromissoryNotePartnershipComponent, PromissoryNotePartnershipPrintComponent,
        PromissoryNoteIndividualComponent, PromissoryNoteIndividualPrintComponent, LetterOfSetOffComponent,
        LetterOfSetOffPrintComponent,
        LoanDeedPartnershipComponent,
        LetterVehicleThirdpartyCompanyComponent, LetterVehicleThirdpartyCompanyPrintComponent,
        PersonalGuaranteeIndividualPrintComponent,
        LoanDeedIndividualComponent, PromissoryNoteCompanyPrintComponent, PersonalGuaranteeProprietorshipComponent, NabilSmeComponent, KisanKarjaSubsidyComponent, UdyamsilKarjaSubsidyComponent, UdyamsilKarjaSubsidyPrintComponent, DdslWithoutSubsidyComponent, DdslWithoutSubsidyPrintComponent, KisanKarjaSubsidyPrintComponent, CombinedOfferLetterComponent, Section1IntroductionComponent, Section2LoanTypeComponent, Section3SecurityAndCollateralComponent, Section4LoanLimitComponent, Section5InterstPenalChargeComponent, Section6FacilitiesClauseComponent, Section7SecurityClauseComponent, Section8InsuranceClauseComponent, Section9OtherClauseComponent, Section10SecurityDocumentsComponent, CombinedOfferLetterPrintComponent, Section6FacilitiesClausePrintComponent, Section9OtherClausePrintComponent, Section3SecurityAndCollateralPrintComponent, Section7SecurityClausePrintComponent, Section10SecurityDocumentsPrintComponent, Section1IntroductionPrintComponent, Section4LoanLimitPrintComponent, Section5InterestPenalChargePrintComponent, Section8InsuranceClausePrintComponent, Section2LoanTypePrintComponent, TermLoanToOrForComponent, TermLoanToOrForPrintComponent, MortgageEquityTermLoanComponent, MortgageEquityTermLoanPrintComponent, AutoLoanComponent, AutoLoanPrintComponent, CommonSectionTopComponent, CommonSectionBottomComponent, CommonSectionBottomPrintComponent, CommonSectionTopPrintComponent, MasterSecuritiesViewComponent, MasterSecondarySecuritiesViewComponent, SharePledgeSecuritiesComponent, CounterGuaranteeCompanyComponent, LetterOfHypothecationProprietorshipComponent, LetterOfHypothecationPartnershipComponent, LetterOfHypothecationCompanyComponent, SupplementaryAggrementProprietorshipComponent, SupplementaryAggrementPartnershipComponent, SupplementaryAggrementCompanyComponent, AssignmentOfReceivableProprietorshipComponent, AssignmentOfReceivablePartnershipComponent, AssignmentOfReceivableCompanyComponent, PowerOfAttorneyProprietorshipComponent, PowerOfAttorneyPartnershipComponent, PowerOfAttorneyCompanyComponent, LoanDeedProprietorshipComponent, CounterGuaranteeProprietorshipComponent, CounterGuaranteePartnershipComponent],

    exports: [
        PromissoryNoteIndividualComponent,
        LetterOfSetOffComponent,
        PersonalGuaranteeCompanyComponent,
        PersonalGuaranteeIndividualComponent,
        LetterOfSetOffPrintComponent,
        PromissoryNoteIndividualPrintComponent,
        PromissoryNoteCompanyComponent,
        LoanDeedIndividualComponent,
        LoanDeedIndividualPrintComponent,
        NabilLoanDeedCompanyComponent,
        LetterVehicleIndividualComponent,
        LetterVehicleIndividualPrintComponent,
        NabilLoanDeedCompanyComponent,
        PromissoryNoteProprietorshipPrintComponent,
        PromissoryNoteProprietorshipComponent,
        PromissoryNotePartnershipComponent,
        PromissoryNotePartnershipPrintComponent,
        PersonalGuaranteePartnershipComponent,
        LoanDeedPartnershipComponent,
        LetterVehicleThirdpartyCompanyComponent,
        LetterVehicleThirdpartyCompanyPrintComponent,
        PersonalGuaranteeProprietorshipComponent,
        KisanKarjaSubsidyComponent,
        UdyamsilKarjaSubsidyComponent,
        UdyamsilKarjaSubsidyPrintComponent,
        KisanKarjaSubsidyPrintComponent,
        DdslWithoutSubsidyComponent,
        DdslWithoutSubsidyPrintComponent,
        CombinedOfferLetterComponent,
        CombinedOfferLetterPrintComponent,
        Section2LoanTypeComponent,
        MasterSecuritiesViewComponent,
        LoanDeedProprietorshipComponent,
        MasterSecuritiesViewComponent,
        CounterGuaranteeCompanyComponent,
        LetterOfHypothecationPartnershipComponent,
        LetterOfHypothecationCompanyComponent,
        SupplementaryAggrementProprietorshipComponent,
        SupplementaryAggrementPartnershipComponent,
        SupplementaryAggrementCompanyComponent,
        AssignmentOfReceivableProprietorshipComponent,
        AssignmentOfReceivablePartnershipComponent,
        AssignmentOfReceivableCompanyComponent,
        PowerOfAttorneyProprietorshipComponent,
        PowerOfAttorneyPartnershipComponent,
        PowerOfAttorneyCompanyComponent,
        LetterOfHypothecationProprietorshipComponent,
        CounterGuaranteeProprietorshipComponent,
        CounterGuaranteePartnershipComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxPrintModule,
        NbButtonModule,
        CKEditorModule,
        NbSpinnerModule,
        MegaOfferLetterTemplateModule,
        NbCardModule,
        ThemeModule,
        CoreModule,
    ],
    entryComponents: [
        UdyamsilKarjaSubsidyComponent,
        KisanKarjaSubsidyComponent,
        InterestSubsidySanctionLetterComponent,
        DdslWithoutSubsidyComponent,
    ]
})
export class NabilModule {
}
