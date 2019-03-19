import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './component/base/base.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './component/login/login.component';
import { BranchComponent } from './component/admin/branch/branch.component';
import { LoanTemplateComponent } from './component/admin/loan-config/loan-template/loan-template.component';
import { LoanConfigComponent } from './component/admin/loan-config/loan-config.component';
import { LoanUiComponent } from './component/loan-ui/loan-ui.component';
import { BasicInfoComponent } from './component/admin/loan-config/loan-main-template/basic-info/basic-info.component';
import { UserComponent } from './component/user/user.component';
import { ApprovallimitComponent } from './component/admin/approvallimit/approvallimit.component';




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


      { path: 'user', component: UserComponent },
      { path: 'approvalLimit', component: ApprovallimitComponent }

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
