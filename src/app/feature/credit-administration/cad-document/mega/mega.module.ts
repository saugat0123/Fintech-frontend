import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDeedCompanyComponent } from './loan-deed-company/loan-deed-company.component';
import { AssignmentOfReceivableComponent } from './assignment-of-receivable/assignment-of-receivable.component';
import { DeedHypoOfMachineryComponent } from './deed-hypo-of-machinery/deed-hypo-of-machinery.component';
import { HyopOfStockComponent } from './hyop-of-stock/hyop-of-stock.component';



@NgModule({
  declarations: [LoanDeedCompanyComponent, AssignmentOfReceivableComponent, DeedHypoOfMachineryComponent, HyopOfStockComponent],
  imports: [
    CommonModule
  ]
})
export class MegaModule { }
