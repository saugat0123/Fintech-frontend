import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PersonalGuaranteeJointBorrowerComponent} from './personal-guarantee-joint-borrower/personal-guarantee-joint-borrower.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PersonalGuaranteeCompanyComponent} from './personal-guarantee-company/personal-guarantee-company.component';
import {PersonalGuaranteeIndividualComponent} from './personal-guarantee-individual/personal-guarantee-individual.component';
import {ManjurinamaForCompanyComponent} from './manjurinama-for-company/manjurinama-for-company.component';
import {TrustReceiptNepaliLimitComponent} from './trust-receipt-nepali-limit/trust-receipt-nepali-limit.component';
import {PromissoryNoteSingleBorrowerComponent} from './promissory-note-single-borrower/promissory-note-single-borrower.component';
import {AssignmentOfReceivableComponent} from './assignment-of-receivable/assignment-of-receivable.component';
import {DeedHypoOfMachineryComponent} from './deed-hypo-of-machinery/deed-hypo-of-machinery.component';
import {HypoOfStockComponent} from './hypo-of-stock/hypo-of-stock.component';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {LoanDeedPartnershipComponent} from './loan-deed-partnership/loan-deed-partnership.component';
import {LoanDeedIndividualComponent} from './loan-deed-individual/loan-deed-individual.component';
import {LoanDeedCompanyComponent} from './loan-deed-company/loan-deed-company.component';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';
import {PromissoryNoteJointComponent} from './promissory-note-joint/promissory-note-joint.component';
import {PowerOfAttorneyPartnershipComponent} from './power-of-attorney-partnership/power-of-attorney-partnership.component';
import {KaloSuchiBorrowerCompanyComponent} from './kalo-suchi-borrower-company/kalo-suchi-borrower-company.component';
import {PowerOfAttorneyCompanyComponent} from './power-of-attorney-company/power-of-attorney-company.component';
import {NgxPrintModule} from 'ngx-print';
import {MegaOfferLetterTemplateModule} from '../../mega-offer-letter-template/mega-offer-letter-template.module';
import {LetterOfContinuityCompanyComponent} from './letter-of-continuity-company/letter-of-continuity-company.component';
import {LetterOfContinuityPartnershipComponent} from './letter-of-continuity-partnership/letter-of-continuity-partnership.component';
import {PromissoryNotePartnershipComponent} from './promissory-note-partnership/promissory-note-partnership.component';
import {
    LetterOfContinuityProprietorshipComponent
} from './letter-of-continuity-proprietorship/letter-of-continuity-proprietorship.component';
import {LetterOfSetOffCompanyComponent} from './letter-of-set-off-company/letter-of-set-off-company.component';
import {LetterOfSetOffPartnershipComponent} from './letter-of-set-off-partnership/letter-of-set-off-partnership.component';
import {
    ManjurinamaForGadiNamasariCompanyComponent
} from './manjurinama-for-gadi-namasari-company/manjurinama-for-gadi-namasari-company.component';
import {
    ManjurinamaForGadiNamasariIndividualComponent
} from './manjurinama-for-gadi-namasari-individual/manjurinama-for-gadi-namasari-individual.component';
import {
    ManjurinamaForGadiNamasariPartnershipComponent
} from './manjurinama-for-gadi-namasari-partnership/manjurinama-for-gadi-namasari-partnership.component';
import {
    ManjurinamaForGadiNamasariProprietorshipComponent
} from './manjurinama-for-gadi-namasari-proprietorship/manjurinama-for-gadi-namasari-proprietorship.component';
import {LoanDeedProprietorshipComponent} from './loan-deed-proprietorship/loan-deed-proprietorship.component';
import {LetterOfSetOffProprietorshipComponent} from './letter-of-set-off-proprietorship/letter-of-set-off-proprietorship.component';
import {
    AssignmentOfReceivablesPartnershipComponent
} from './assignment-of-receivables-partnership/assignment-of-receivables-partnership.component';
import {KaloSuchiBorrowerPgCompanyComponent} from './kalo-suchi-borrower-pg-company/kalo-suchi-borrower-pg-company.component';
import {CorporateGuaranteeComponent} from './corporate-guarantee/corporate-guarantee.component';
import {PowerOfAttorneyProprietorshipComponent} from './power-of-attorney-proprietorship/power-of-attorney-proprietorship.component';
import {SupplementaryAgreementCompanyComponent} from './supplementary-agreement-company/supplementary-agreement-company.component';
import {
    AssignmentOfReceivablesProprietorshipComponent
} from './assignment-of-receivables-proprietorship/assignment-of-receivables-proprietorship.component';
import {
    SupplementaryAgreementPartnershipComponent
} from './supplementary-agreement-partnership/supplementary-agreement-partnership.component';
import {ConsentLetterCompanyComponent} from './consent-letter-company/consent-letter-company.component';
import {VehicleLoanDeedCompanyComponent} from './vehicle-loan-deed-company/vehicle-loan-deed-company.component';
import {ConsentLetterIndividualComponent} from './consent-letter-individual/consent-letter-individual.component';
import {KaloSuchiBorrowerIndividualComponent} from './kalo-suchi-borrower-individual/kalo-suchi-borrower-individual.component';

@NgModule({
    declarations: [PersonalGuaranteeJointBorrowerComponent,
        PersonalGuaranteeCompanyComponent,
        PersonalGuaranteeIndividualComponent,
        ManjurinamaForCompanyComponent,
        TrustReceiptNepaliLimitComponent,
        PromissoryNoteSingleBorrowerComponent,
        AssignmentOfReceivableComponent,
        AssignmentOfReceivablesPartnershipComponent,
        AssignmentOfReceivablesProprietorshipComponent,
        KaloSuchiBorrowerCompanyComponent,
        KaloSuchiBorrowerPgCompanyComponent,
        DeedHypoOfMachineryComponent,
        HypoOfStockComponent,
        LoanDeedCompanyComponent,
        LoanDeedPartnershipComponent,
        LoanDeedIndividualComponent,
        PromissoryNoteCompanyComponent,
        PromissoryNoteJointComponent,
        CorporateGuaranteeComponent,
        LetterOfSetOffCompanyComponent,
        LetterOfSetOffProprietorshipComponent,
        LetterOfContinuityCompanyComponent,
        LetterOfContinuityPartnershipComponent,
        PromissoryNotePartnershipComponent,
        LetterOfContinuityProprietorshipComponent,
        ManjurinamaForGadiNamasariCompanyComponent,
        ManjurinamaForGadiNamasariIndividualComponent,
        ManjurinamaForGadiNamasariPartnershipComponent,
        ManjurinamaForGadiNamasariProprietorshipComponent,
        PowerOfAttorneyCompanyComponent,
        LetterOfSetOffPartnershipComponent,
        LoanDeedProprietorshipComponent,
        PowerOfAttorneyPartnershipComponent,
        PowerOfAttorneyProprietorshipComponent,
        SupplementaryAgreementCompanyComponent,
        ConsentLetterCompanyComponent,
        SupplementaryAgreementPartnershipComponent,
        VehicleLoanDeedCompanyComponent,
        ConsentLetterIndividualComponent,
        KaloSuchiBorrowerIndividualComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NbCardModule,
        NbButtonModule,
        NgxPrintModule,
        MegaOfferLetterTemplateModule,
    ],
    exports: [
        AssignmentOfReceivableComponent,
        AssignmentOfReceivablesPartnershipComponent,
        DeedHypoOfMachineryComponent,
        HypoOfStockComponent,
        ManjurinamaForCompanyComponent,
        PersonalGuaranteeCompanyComponent,
        PersonalGuaranteeJointBorrowerComponent,
        PersonalGuaranteeIndividualComponent,
        PromissoryNoteSingleBorrowerComponent,
        TrustReceiptNepaliLimitComponent,
        LoanDeedCompanyComponent,
        LoanDeedPartnershipComponent,
        LoanDeedIndividualComponent,
        PromissoryNoteCompanyComponent,
        PromissoryNoteJointComponent,
        PowerOfAttorneyPartnershipComponent,
        KaloSuchiBorrowerCompanyComponent,
        LetterOfSetOffCompanyComponent,
        LetterOfSetOffProprietorshipComponent,
        LetterOfContinuityCompanyComponent,
        LetterOfContinuityPartnershipComponent,
        PromissoryNotePartnershipComponent,
        LetterOfContinuityProprietorshipComponent,
        ManjurinamaForGadiNamasariCompanyComponent,
        ManjurinamaForGadiNamasariIndividualComponent,
        ManjurinamaForGadiNamasariPartnershipComponent,
        ManjurinamaForGadiNamasariProprietorshipComponent,
        PowerOfAttorneyCompanyComponent,
        LetterOfSetOffPartnershipComponent,
        LoanDeedProprietorshipComponent,
        KaloSuchiBorrowerPgCompanyComponent,
        CorporateGuaranteeComponent,
        PowerOfAttorneyProprietorshipComponent,
        SupplementaryAgreementCompanyComponent,
        AssignmentOfReceivablesProprietorshipComponent,
        SupplementaryAgreementPartnershipComponent,
        ConsentLetterCompanyComponent,
        VehicleLoanDeedCompanyComponent,
        ConsentLetterIndividualComponent,
        KaloSuchiBorrowerIndividualComponent
    ],
})

export class MegaModule {
}
