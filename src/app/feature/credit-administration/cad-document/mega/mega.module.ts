import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanDeedCompanyComponent } from './loan-deed-company/loan-deed-company.component';
import { LoanDeedMultipleComponent } from './loan-deed-multiple/loan-deed-multiple.component';
import { LoanDeedSingleComponent } from './loan-deed-single/loan-deed-single.component';
import {PromissoryNoteCompanyComponent} from './promissory-note-company/promissory-note-company.component';
import {PromissoryNoteJointComponent} from './promissory-note-joint/promissory-note-joint.component';

@NgModule({
  declarations: [LoanDeedCompanyComponent, LoanDeedMultipleComponent, LoanDeedSingleComponent, PromissoryNoteCompanyComponent, PromissoryNoteJointComponent],
  imports: [
    CommonModule
  ]
})
export class MegaModule { }
