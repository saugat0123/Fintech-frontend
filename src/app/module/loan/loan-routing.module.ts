import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoanFormComponent} from './component/loan-form/loan-form.component';


export const  routes: Routes = [
    {path: 'loanForm', component: LoanFormComponent}]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
