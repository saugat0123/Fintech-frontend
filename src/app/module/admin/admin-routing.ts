import {KycInfoComponent} from './component/loan-config/loan-main-template/kyc-info/kyc-info.component';
import {ValuatorComponent} from './component/valuator/valuator.component';
import {SectorComponent} from './component/sector/sector/sector.component';
import {SubSectorComponent} from './component/sector/sub-sector/sub-sector.component';
import {UIComponent} from './component/loan-config/ui/ui.component';
import {NepseComponent} from './component/nepse/nepse.component';
import {SegmentComponent} from './component/segment/segment/segment.component';
import {SubSegmentComponent} from './component/segment/sub-segment/sub-segment.component';
import {CompanyInfoComponent} from './component/loan-config/loan-main-template/company-info/company-info.component';
import {DocumentComponent} from './component/document/document.component';
import {CompanyComponent} from './component/company/company.component';

import {BranchComponent} from './component/branch/branch.component';
import {LoanTemplateComponent} from './component/loan-config/loan-template/loan-template.component';
import {LoanConfigComponent} from './component/loan-config/loan-config.component';
import {BasicInfoComponent} from './component/loan-config/loan-main-template/basic-info/basic-info.component';
import {UserComponent} from './component/user/user.component';
import {ApprovallimitComponent} from './component/approvallimit/approvallimit.component';
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';
import {Routes} from '@angular/router';
import {LoanUiComponent} from './component/loan-ui/loan-ui.component';
import {SecurityComponent} from './component/loan-config/loan-main-template/security/security.component';
import {LoanComponent} from './component/loan-config/loan-main-template/loan/loan.component';


export const adminRoutes: Routes = [

    {path: 'document', component: DocumentComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'template', component: LoanTemplateComponent},
    {path: 'config', component: LoanConfigComponent},
    {path: 'valuator', component: ValuatorComponent},
    {path: 'sector', component: SectorComponent},
    {path: 'subSector', component: SubSectorComponent},
    {path: 'ui', component: UIComponent},
    {path: 'nepse', component: NepseComponent},
    {path: 'segment', component: SegmentComponent},
    {path: 'sub-segment', component: SubSegmentComponent},
    {path: 'user', component: UserComponent},
    {path: 'approvalLimit', component: ApprovallimitComponent},
    {path: 'company', component: CompanyComponent},
    {path: 'role', component: RolePermissionComponent},
    {path: 'roleList', component: ListRoleComponent},
    {path: 'loanType', component: LoanComponent},
    {
        path: 'loan', component: LoanUiComponent,
        children: [
            {path: 'basic-info', component: BasicInfoComponent},
            {path: 'kyc-info', component: KycInfoComponent},
            {path: 'company-info', component: CompanyInfoComponent},
            {path: 'security', component: SecurityComponent}

        ]
    }
];








