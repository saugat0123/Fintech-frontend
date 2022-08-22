import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalGuaranteeJointBorrowerComponent } from './personal-guarantee-joint-borrower/personal-guarantee-joint-borrower.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PersonalGuaranteeCompanyComponent } from './personal-guarantee-company/personal-guarantee-company.component';
import { PersonalGuaranteeIndividualComponent } from './personal-guarantee-individual/personal-guarantee-individual.component';
import { ManjurinamaForCompanyComponent } from './manjurinama-for-company/manjurinama-for-company.component';
import { TrustReceiptNepaliLimitComponent } from './trust-receipt-nepali-limit/trust-receipt-nepali-limit.component';
import { PromissoryNoteSingleBorrowerComponent } from './promissory-note-single-borrower/promissory-note-single-borrower.component';
import { AssignmentOfReceivableComponent } from './assignment-of-receivable/assignment-of-receivable.component';
import { DeedHypoOfMachineryComponent } from './deed-hypo-of-machinery/deed-hypo-of-machinery.component';
import { HypoOfStockComponent } from './hypo-of-stock/hypo-of-stock.component';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {LoanDeedInstitutionPartnershipFormComponent} from './loan-deed-institution-partnership-form/loan-deed-institution-partnership-form.component';
import {LoanDeedIndividualComponent} from './loan-deed-individual/loan-deed-individual.component';
import {LoanDeedInstitutionPrivateLimitedComponent} from './loan-deed-institution-private-limited/loan-deed-institution-private-limited.component';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';
import {PromissoryNoteJointComponent} from './promissory-note-joint/promissory-note-joint.component';
import {KaloSuchiBorrowerCompanyComponent} from './kalo-suchi-borrower-company/kalo-suchi-borrower-company.component';
import {PowerOfAttorneyCompanyComponent} from './power-of-attorney-company/power-of-attorney-company.component';
import {NgxPrintModule} from 'ngx-print';
import {MegaOfferLetterTemplateModule} from '../../mega-offer-letter-template/mega-offer-letter-template.module';
import { LetterOfContinuityCompanyComponent } from './letter-of-continuity-company/letter-of-continuity-company.component';
import { LetterOfContinuityPartnershipComponent } from './letter-of-continuity-partnership/letter-of-continuity-partnership.component';
import { PromissoryNotePartnershipFirmComponent} from './promissory-note-partnership-firm/promissory-note-partnership-firm.component';
import { LetterOfContinuityProprietorshipComponent } from './letter-of-continuity-proprietorship/letter-of-continuity-proprietorship.component';
import { LetterOfSetOffCompanyComponent } from './letter-of-set-off-company/letter-of-set-off-company.component';
import { ManjurinamaForGadiNamasariCompanyComponent } from './manjurinama-for-gadi-namasari-company/manjurinama-for-gadi-namasari-company.component';
import { ManjurinamaForGadiNamasariIndividualComponent } from './manjurinama-for-gadi-namasari-individual/manjurinama-for-gadi-namasari-individual.component';
import { ManjurinamaForGadiNamasariPartnershipComponent } from './manjurinama-for-gadi-namasari-partnership/manjurinama-for-gadi-namasari-partnership.component';
import { ManjurinamaForGadiNamasariProprietorshipComponent } from './manjurinama-for-gadi-namasari-proprietorship/manjurinama-for-gadi-namasari-proprietorship.component';



@NgModule({
  declarations: [PersonalGuaranteeJointBorrowerComponent,
    PersonalGuaranteeCompanyComponent,
    PersonalGuaranteeIndividualComponent,
    ManjurinamaForCompanyComponent,
    TrustReceiptNepaliLimitComponent,
    PromissoryNoteSingleBorrowerComponent,
    AssignmentOfReceivableComponent,
    DeedHypoOfMachineryComponent,
    HypoOfStockComponent,
    LoanDeedInstitutionPrivateLimitedComponent,
    LoanDeedInstitutionPartnershipFormComponent,
    LoanDeedIndividualComponent,
    PromissoryNoteCompanyComponent,
    PromissoryNoteJointComponent,
    CorporateGuaranteeComponent,
    LetterOfSetOffCompanyComponent,
    LetterOfContinuityCompanyComponent,
    LetterOfContinuityPartnershipComponent,
    PromissoryNotePartnershipFirmComponent,
    LetterOfContinuityProprietorshipComponent,
    ManjurinamaForGadiNamasariCompanyComponent,
    ManjurinamaForGadiNamasariIndividualComponent,
    ManjurinamaForGadiNamasariPartnershipComponent,
    ManjurinamaForGadiNamasariProprietorshipComponent,
    PowerOfAttorneyCompanyComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NgxPrintModule,
    MegaOfferLetterTemplateModule
  ],
  exports: [
    AssignmentOfReceivableComponent,
    DeedHypoOfMachineryComponent,
    HypoOfStockComponent,
    ManjurinamaForCompanyComponent,
    PersonalGuaranteeCompanyComponent,
    PersonalGuaranteeJointBorrowerComponent,
    PersonalGuaranteeIndividualComponent,
    PromissoryNoteSingleBorrowerComponent,
    TrustReceiptNepaliLimitComponent,
    LoanDeedInstitutionPrivateLimitedComponent,
    LoanDeedInstitutionPartnershipFormComponent,
    LoanDeedIndividualComponent,
    PromissoryNoteCompanyComponent,
    PromissoryNoteJointComponent,
    CorporateGuaranteeComponent,
    KaloSuchiBorrowerCompanyComponent,
    KaloSuchiBorrowerPgCompanyComponent,
    LetterOfSetOffCompanyComponent,
    LetterOfContinuityCompanyComponent,
    LetterOfContinuityPartnershipComponent,
    PromissoryNotePartnershipFirmComponent,
    LetterOfContinuityProprietorshipComponent,
    DeedHypoOfMachineryComponent,
    ManjurinamaForGadiNamasariCompanyComponent,
    ManjurinamaForGadiNamasariIndividualComponent,
    ManjurinamaForGadiNamasariPartnershipComponent,
    ManjurinamaForGadiNamasariProprietorshipComponent,
    PowerOfAttorneyCompanyComponent
  ],
})
export class MegaModule { }
