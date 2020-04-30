import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UpdateLoanDashboardComponent} from './component/update-loan-dashboard/update-loan-dashboard.component';
import {UpdateInsuranceComponent} from './component/update-insurance/update-insurance.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: UpdateLoanDashboardComponent
  },
  {
    path: 'insurance',
    component: UpdateInsuranceComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanUpdateRoutingModule { }
