import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDeedCompanyComponent } from './loan-deed-company/loan-deed-company.component';
import { PersonalGuaranteeJointBorrowerComponent } from './personal-guarantee-joint-borrower/personal-guarantee-joint-borrower.component';
import {ReactiveFormsModule} from '@angular/forms';
import { PersonalGuaranteePersonToPersonComponent } from './personal-guarantee-person-to-person/personal-guarantee-person-to-person.component';
import { ManjurinamaForCompanyComponent } from './manjurinama-for-company/manjurinama-for-company.component';
import { TrustReceiptNepaliLimitComponent } from './trust-receipt-nepali-limit/trust-receipt-nepali-limit.component';
import { PromissoryNoteSingleBorrowerComponent } from './promissory-note-single-borrower/promissory-note-single-borrower.component';
import { AssignmentOfReceivableComponent } from './assignment-of-receivable/assignment-of-receivable.component';
import { DeedHypoOfMachineryComponent } from './deed-hypo-of-machinery/deed-hypo-of-machinery.component';
import { HypoOfStockComponent } from './hypo-of-stock/hypo-of-stock.component';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {LoanDeedMultipleComponent} from './loan-deed-multiple/loan-deed-multiple.component';
import {LoanDeedSingleComponent} from './loan-deed-single/loan-deed-single.component';
import {PromissoryNoteJointComponent} from './promissory-note-joint/promissory-note-joint.component';
import {NgxPrintModule} from 'ngx-print';
import {LoanDeedIndividualComponent} from './loan-deed-individual/loan-deed-individual.component';
import {LoanDeedIndividualPrintComponent} from './loan-deed-individual/loan-deed-individual-print/loan-deed-individual-print.component';
import { HomeLoanComponent } from './home-loan/home-loan.component';
import { HomeLoanPrintComponent } from './home-loan/home-loan-print/home-loan-print.component';


@NgModule({
  declarations: [LoanDeedCompanyComponent,
    PersonalGuaranteeJointBorrowerComponent,
    PersonalGuaranteePersonToPersonComponent,
    ManjurinamaForCompanyComponent,
    TrustReceiptNepaliLimitComponent,
    PromissoryNoteSingleBorrowerComponent,
    AssignmentOfReceivableComponent,
    DeedHypoOfMachineryComponent,
    HypoOfStockComponent,
    LoanDeedMultipleComponent,
    LoanDeedSingleComponent,
    PromissoryNoteJointComponent,
    LoanDeedIndividualComponent,
    LoanDeedIndividualPrintComponent,
    HomeLoanComponent,
    HomeLoanPrintComponent
],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NgxPrintModule
  ],
  exports: [
    AssignmentOfReceivableComponent,
    DeedHypoOfMachineryComponent,
    HypoOfStockComponent,
    LoanDeedCompanyComponent,
    ManjurinamaForCompanyComponent,
    PersonalGuaranteeJointBorrowerComponent,
    PersonalGuaranteePersonToPersonComponent,
    PromissoryNoteSingleBorrowerComponent,
    TrustReceiptNepaliLimitComponent,
    LoanDeedMultipleComponent,
    LoanDeedSingleComponent,
    PromissoryNoteJointComponent,
    LoanDeedIndividualComponent,
    LoanDeedIndividualPrintComponent,
    LoanDeedIndividualComponent,
    LoanDeedIndividualPrintComponent,
    HomeLoanComponent
  ],
  entryComponents: [DeedHypoOfMachineryComponent
  ]

})
export class MegaModule { }
