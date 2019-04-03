
import { KycInfoComponent } from './component/admin/loan-config/loan-main-template/kyc-info/kyc-info.component';
import { ValuatorComponent } from './component/admin/valuator/valuator.component';
import { SectorComponent } from './component/admin/sector/sector/sector.component';
import { SubSectorComponent } from './component/admin/sector/sub-sector/sub-sector.component';
import {UIComponent} from './component/admin/loan-config/ui/ui.component';
import {DistrictComponent} from './component/admin/address/district/district.component';
import {MunicipalityComponent} from './component/admin/address/municipality/municipality.component';
import {ProvinceComponent} from './component/admin/address/province/province.component';
import {NepseComponent} from './component/admin/nepse/nepse.component';
import {SegmentComponent} from './component/admin/segment/segment/segment.component';
import {SubSegmentComponent} from './component/admin/segment/sub-segment/sub-segment.component';
import { CompanyInfoComponent } from './component/admin/loan-config/loan-main-template/company-info/company-info.component';
import { DocumentComponent } from './component/admin/document/document.component';


import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './component/base/base.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {LoginComponent} from './component/login/login.component';
import {BranchComponent} from './component/admin/branch/branch.component';
import {LoanTemplateComponent} from './component/admin/loan-config/loan-template/loan-template.component';
import {LoanConfigComponent} from './component/admin/loan-config/loan-config.component';
import {LoanUiComponent} from './component/loan-ui/loan-ui.component';
import {BasicInfoComponent} from './component/admin/loan-config/loan-main-template/basic-info/basic-info.component';
import {UserComponent} from './component/user/user.component';
import {ApprovallimitComponent} from './component/admin/approvallimit/approvallimit.component';
import {RolePermissionComponent} from './component/admin/role-permission/role-permission.component';


const routes: Routes = [
  { path: 'home', component: BaseComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'document', component: DocumentComponent },
      { path: 'branch', component: BranchComponent },
      { path: 'template', component: LoanTemplateComponent },
      { path: 'config', component: LoanConfigComponent },
      { path: 'valuator', component: ValuatorComponent },
      { path: 'sector', component: SectorComponent },
      { path: 'subSector', component: SubSectorComponent },
      { path: 'ui', component: UIComponent},
      { path: 'district', component: DistrictComponent},
      { path: 'municipality', component: MunicipalityComponent},
      { path: 'province', component: ProvinceComponent},
      { path: 'nepse', component: NepseComponent},
      { path: 'segment', component: SegmentComponent},
      { path: 'sub-segment', component: SubSegmentComponent},
      { path: 'user', component: UserComponent },
      { path: 'approvalLimit', component: ApprovallimitComponent },
      { path: 'template', component: LoanTemplateComponent},
      { path: 'config', component: LoanConfigComponent},
      { path: 'role', component: RolePermissionComponent},
      { path: 'loan', component: LoanUiComponent,
        children: [
          { path: 'basic-info', component: BasicInfoComponent},
          { path: 'kyc-info', component: KycInfoComponent},
          { path: 'company-info', component: CompanyInfoComponent},
          {path: 'dashboard', component: DashboardComponent},
        ]
      }
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
