import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDeedCompanyComponent } from './loan-deed-company/loan-deed-company.component';
import { PersonalGuaranteeJointBorrowerComponent } from './personal-guarantee-joint-borrower/personal-guarantee-joint-borrower.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PersonalGuaranteeCompanyComponent } from './personal-guarantee-company/personal-guarantee-company.component';
import { PersonalGuaranteePersonToPersonComponent } from './personal-guarantee-person-to-person/personal-guarantee-person-to-person.component';
import { ManjurinamaForCompanyComponent } from './manjurinama-for-company/manjurinama-for-company.component';
import { TrustReceiptNepaliLimitComponent } from './trust-receipt-nepali-limit/trust-receipt-nepali-limit.component';
import { PromissoryNoteSingleBorrowerComponent } from './promissory-note-single-borrower/promissory-note-single-borrower.component';
import { AssignmentOfReceivableComponent } from './assignment-of-receivable/assignment-of-receivable.component';
import { DeedHypoOfMachineryComponent } from './deed-hypo-of-machinery/deed-hypo-of-machinery.component';
import { HypoOfStockComponent } from './hypo-of-stock/hypo-of-stock.component';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {LoanDeedMultipleComponent} from './loan-deed-multiple/loan-deed-multiple.component';
import {LoanDeedIndividualComponent} from './loan-deed-individual/loan-deed-individual.component';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';
import {PromissoryNoteJointComponent} from './promissory-note-joint/promissory-note-joint.component';
import {KaloSuchiBorrowerCompanyComponent} from './kalo-suchi-borrower-company/kalo-suchi-borrower-company.component';
import {NgxPrintModule} from 'ngx-print';
import { CorporateGuaranteeComponent } from './corporate-guarantee/corporate-guarantee.component';
import {KaloSuchiBorrowerPgCompanyComponent} from './kalo-suchi-borrower-pg-company/kalo-suchi-borrower-pg-company.component';
import {MegaOfferLetterTemplateModule} from '../../mega-offer-letter-template/mega-offer-letter-template.module';
import { LetterOfContinuityCompanyComponent } from './letter-of-continuity-company/letter-of-continuity-company.component';

@NgModule({
  declarations: [LoanDeedCompanyComponent,
    PersonalGuaranteeJointBorrowerComponent,
    PersonalGuaranteeCompanyComponent,
    PersonalGuaranteePersonToPersonComponent,
    ManjurinamaForCompanyComponent,
    TrustReceiptNepaliLimitComponent,
    PromissoryNoteSingleBorrowerComponent,
    AssignmentOfReceivableComponent,
    KaloSuchiBorrowerCompanyComponent,
    KaloSuchiBorrowerPgCompanyComponent,
    DeedHypoOfMachineryComponent,
    HypoOfStockComponent,
    LoanDeedMultipleComponent,
    LoanDeedIndividualComponent,
    PromissoryNoteCompanyComponent,
    PromissoryNoteJointComponent,
    CorporateGuaranteeComponent,
    LetterOfContinuityCompanyComponent],
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
    LoanDeedCompanyComponent,
    ManjurinamaForCompanyComponent,
    PersonalGuaranteeCompanyComponent,
    PersonalGuaranteeJointBorrowerComponent,
    PersonalGuaranteePersonToPersonComponent,
    PromissoryNoteSingleBorrowerComponent,
    TrustReceiptNepaliLimitComponent,
    LoanDeedMultipleComponent,
    LoanDeedIndividualComponent,
    PromissoryNoteCompanyComponent,
    PromissoryNoteJointComponent,
    CorporateGuaranteeComponent,
    KaloSuchiBorrowerCompanyComponent,
    CorporateGuaranteeComponent,
    LetterOfContinuityCompanyComponent,
    KaloSuchiBorrowerPgCompanyComponent
  ],
  entryComponents: [DeedHypoOfMachineryComponent
  ]

})
export class MegaModule { }
