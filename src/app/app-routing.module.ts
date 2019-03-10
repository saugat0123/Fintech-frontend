import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './component/base/base.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { BranchComponent } from './component/branch/branch.component';
import { LoanTemplateComponent } from './component/loan-template/loan-template.component';
import { LoanConfigComponent } from './component/loan-config/loan-config.component';
import { LoanUiComponent } from './component/loan-ui/loan-ui.component';
import { BasicInfoComponent } from './component/loan-main-template/basic-info/basic-info.component';


const routes: Routes = [
  {

    path: 'home', component: BaseComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'branch', component: BranchComponent },
      { path: 'template', component: LoanTemplateComponent },
      { path: 'config', component: LoanConfigComponent },
      {
        path: 'loan', component: LoanUiComponent, children: [
          { path: 'basic-info', component: BasicInfoComponent },
          { path: 'branch', component: BranchComponent },
          { path: 'dashboard', component: DashboardComponent },
        ]
      },



    ],

  },
  { path: '', component: LoginComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
