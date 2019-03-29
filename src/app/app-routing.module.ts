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
import {UIComponent} from './component/admin/loan-config/ui/ui.component';
import {DistrictComponent} from './component/admin/address/district/district.component';
import {MunicipalityComponent} from './component/admin/address/municipality/municipality.component';
import {ProvinceComponent} from './component/admin/address/province/province.component';
import {NepseComponent} from './component/admin/nepse/nepse.component';
import {SegmentComponent} from './component/admin/segment/segment/segment.component';
import {SubSegmentComponent} from './component/admin/segment/sub-segment/sub-segment.component';




const routes: Routes = [
  {

    path: 'home', component: BaseComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'branch', component: BranchComponent },
      { path: 'template', component: LoanTemplateComponent },
      { path: 'config', component: LoanConfigComponent },
      { path: 'ui', component: UIComponent},
      { path: 'district', component: DistrictComponent},
      { path: 'municipality', component: MunicipalityComponent},
      { path: 'province', component: ProvinceComponent},
      { path: 'nepse', component: NepseComponent},
      { path: 'segment', component: SegmentComponent},
      { path: 'sub-segment', component: SubSegmentComponent},
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
