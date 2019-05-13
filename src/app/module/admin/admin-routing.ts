import {ValuatorComponent} from './component/valuator/valuator.component';
import {SectorComponent} from './component/sector/sector/sector.component';
import {SubSectorComponent} from './component/sector/sub-sector/sub-sector.component';
import {UIComponent} from './component/loan-config/loan-configuration/ui.component';
import {NepseComponent} from './component/nepse/nepse.component';
import {SegmentComponent} from './component/segment/segment/segment.component';
import {SubSegmentComponent} from './component/segment/sub-segment/sub-segment.component';
import {DocumentComponent} from './component/document/document.component';
import {CompanyComponent} from './component/company/company.component';

import {BranchComponent} from './component/branch/branch.component';
import {LoanTemplateComponent} from './component/loan-config/loan-template/loan-template.component';
import {LoanConfigComponent} from './component/loan-config/loan-config.component';

import {UserComponent} from './component/user/user.component';
import {ApprovallimitComponent} from './component/approvallimit/approvallimit.component';
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';
import {Routes} from '@angular/router';
import {RoleHierarchyComponent} from './component/role-hierarchy/role-hierarchy.component';


// import {SecurityComponent} from './component/loan-config/loan-main-template/security/security.component';


export const adminRoutes: Routes = [

    {path: 'document', component: DocumentComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'template', component: LoanTemplateComponent},
    {path: 'config', component: LoanConfigComponent},
    {path: 'valuator', component: ValuatorComponent},
    {path: 'sector', component: SectorComponent},
    {path: 'subSector', component: SubSectorComponent},
    {path: 'configLoan', component: UIComponent},
    {path: 'nepse', component: NepseComponent},
    {path: 'segment', component: SegmentComponent},
    {path: 'sub-segment', component: SubSegmentComponent},
    {path: 'user', component: UserComponent},
    {path: 'approvalLimit', component: ApprovallimitComponent},
    {path: 'company', component: CompanyComponent},
    {path: 'role', component: RolePermissionComponent},
    {path: 'roleList', component: ListRoleComponent},
    {path: 'roleHierarchy', component: RoleHierarchyComponent},

];








