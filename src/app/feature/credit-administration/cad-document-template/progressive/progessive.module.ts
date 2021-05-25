import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterOfArrangementsComponent } from './letter-of-arrangements/letter-of-arrangements.component';
import { LetterOfContinuityComponent } from './letter-of-continuity/letter-of-continuity.component';
import { LetterOfDisbursementComponent } from './letter-of-disbursement/letter-of-disbursement.component';
import { LetterOfInstallmentsComponent } from './letter-of-installments/letter-of-installments.component';
import { GuaranteeBondCorporateComponent } from './guarantee-bond-corporate/guarantee-bond-corporate.component';
import {ReactiveFormsModule} from "@angular/forms";
import { IndemnityDeedComponent } from './indemnity-deed/indemnity-deed.component';
import { PromissoryNoteGuarantorComponent } from './promissory-note-guarantor/promissory-note-guarantor.component';
import { LetterOfAgreementComponent } from './letter-of-agreement/letter-of-agreement.component';
import { HirePurchaseDeedComponent } from './hire-purchase-deed/hire-purchase-deed.component';



@NgModule({
  declarations: [
      LetterOfArrangementsComponent,
    LetterOfContinuityComponent,
    LetterOfDisbursementComponent,
    LetterOfInstallmentsComponent,
    GuaranteeBondCorporateComponent,
    IndemnityDeedComponent,
    PromissoryNoteGuarantorComponent,
    LetterOfAgreementComponent,
    HirePurchaseDeedComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        LetterOfArrangementsComponent,
        LetterOfContinuityComponent,
        LetterOfDisbursementComponent,
        LetterOfInstallmentsComponent,
        GuaranteeBondCorporateComponent,
        IndemnityDeedComponent,
        PromissoryNoteGuarantorComponent,
        LetterOfAgreementComponent,
        HirePurchaseDeedComponent
    ]
})
export class ProgessiveModule { }
