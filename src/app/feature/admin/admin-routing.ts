import {ValuatorComponent} from './component/valuator/valuator.component';
import {UIComponent} from './component/loan-config/loan-configuration/ui.component';
import {DocumentComponent} from './component/document/document.component';
import {CompanyComponent} from './component/company/company.component';

import {BranchComponent} from './component/branch/branch.component';
import {LoanTemplateComponent} from './component/loan-config/loan-template/loan-template.component';
import {LoanConfigComponent} from './component/loan-config/loan-config.component';

import {UserComponent} from './component/user/user.component';
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';
import {Routes} from '@angular/router';

import {RoleHierarchyComponent} from './component/role-hierarchy/role-hierarchy.component';
import {CatalogueComponent} from './component/catalogue/catalogue.component';
import {UserGuideComponent} from '../../@theme/components/user-guide/user-guide.component';
import {EmailConfigurationComponent} from './component/email-configuration/email-configuration.component';
import {PreferenceComponent} from './component/preference/preference.component';

export const adminRoutes: Routes = [

    {path: 'document', component: DocumentComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'loan-template.ts', component: LoanTemplateComponent},
    {path: 'config', component: LoanConfigComponent},
    {path: 'valuator', component: ValuatorComponent},
    {path: 'configLoan', component: UIComponent},
    {path: 'user', component: UserComponent},
    {path: 'company', component: CompanyComponent},
    {path: 'user-guide', component: UserGuideComponent},
    {path: 'preference-master', component: PreferenceComponent},
    {path: 'role', component: RolePermissionComponent},
    {path: 'roleList', component: ListRoleComponent},
    {path: 'roleHierarchy', component: RoleHierarchyComponent},
    {path: 'catalogue', component: CatalogueComponent},
    {path: 'email-config', component: EmailConfigurationComponent},

];








