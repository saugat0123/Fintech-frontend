import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDeedCompanyComponent } from './loan-deed-company/loan-deed-company.component';
import { PersonalGuaranteeCompanyComponent } from './personal-guarantee-company/personal-guarantee-company.component';
import {ReactiveFormsModule} from "@angular/forms";
import { PersonalGuaranteePersonToPersonComponent } from './personal-guarantee-person-to-person/personal-guarantee-person-to-person.component';
import { PersonalGuaraneeJointBorrowerComponent } from './personal-guaranee-joint-borrower/personal-guaranee-joint-borrower.component';
import { ManjurinamaForCompanyComponent } from './manjurinama-for-company/manjurinama-for-company.component';
import { TrustReceiptNepaliLimitComponent } from './trust-receipt-nepali-limit/trust-receipt-nepali-limit.component';
import { PromissoryNoteSingleBorrowerComponent } from './promissory-note-single-borrower/promissory-note-single-borrower.component';
import { AssignmentOfReceivableComponent } from './assignment-of-receivable/assignment-of-receivable.component';
import { DeedHypoOfMachineryComponent } from './deed-hypo-of-machinery/deed-hypo-of-machinery.component';
import { HypoOfStockComponent } from './hypo-of-stock/hypo-of-stock.component';



@NgModule({
  declarations: [LoanDeedCompanyComponent, PersonalGuaranteeCompanyComponent, PersonalGuaranteePersonToPersonComponent, PersonalGuaraneeJointBorrowerComponent, ManjurinamaForCompanyComponent, TrustReceiptNepaliLimitComponent, PromissoryNoteSingleBorrowerComponent, AssignmentOfReceivableComponent, DeedHypoOfMachineryComponent, HypoOfStockComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class MegaModule { }
