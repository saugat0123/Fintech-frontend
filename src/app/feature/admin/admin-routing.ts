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
import {ApprovalLimitComponent} from './component/approvallimit/approval-limit.component';
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';
import {Routes} from '@angular/router';

import {QuestionComponent} from './component/eligibility/question/question.component';
import {NewRequestsComponent} from './component/eligibility/new-requests/new-requests.component';
import {NonEligibleRequestsComponent} from './component/eligibility/non-eligible-requests/non-eligible-requests.component';
import {EligibleRequestsComponent} from './component/eligibility/eligible-requests/eligible-requests.component';
import {RoleHierarchyComponent} from './component/role-hierarchy/role-hierarchy.component';
import {GeneralQuestionComponent} from './component/eligibility/general-question/general-question.component';
import {OpeningAccountComponent} from './component/opening-account/opening-account.component';
import {OpenOpeningComponentComponent} from './component/opening-account/open-opening-component/open-opening-component.component';
import {RejectedOpeningAccountComponent} from './component/opening-account/rejected-opening-account/rejected-opening-account.component';
import {ApprovalOpeningAccountComponent} from './component/opening-account/approval-opening-account/approval-opening-account.component';
import {CatalogueComponent} from './component/catalogue/catalogue.component';




export const adminRoutes: Routes = [

    {path: 'document', component: DocumentComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'loan-template.ts', component: LoanTemplateComponent},
    {path: 'config', component: LoanConfigComponent},
    {path: 'valuator', component: ValuatorComponent},
    {path: 'sector', component: SectorComponent},
    {path: 'subSector', component: SubSectorComponent},
    {path: 'configLoan', component: UIComponent},
    {path: 'nepse', component: NepseComponent},
    {path: 'segment', component: SegmentComponent},
    {path: 'sub-segment', component: SubSegmentComponent},
    {path: 'user', component: UserComponent},
    {path: 'approvalLimit', component: ApprovalLimitComponent},
    {path: 'company', component: CompanyComponent},
    {
        path: 'eligibility',
        children: [
            {path: 'question', component: QuestionComponent},
            {path: 'general-question', component: GeneralQuestionComponent},
            {path: 'new-requests', component: NewRequestsComponent},
            {path: 'eligible', component: EligibleRequestsComponent},
            {path: 'non-eligible', component: NonEligibleRequestsComponent}
        ]
    },
    {path: 'role', component: RolePermissionComponent},
    {path: 'roleList', component: ListRoleComponent},
    {path: 'roleHierarchy', component: RoleHierarchyComponent},
    {path: 'openingAccount', component: OpeningAccountComponent},
    {path: 'rejectedOpeningAccount', component: RejectedOpeningAccountComponent},
    {path: 'approvalOpeningAccount', component: ApprovalOpeningAccountComponent},
    {path: 'openOpeningAccount', component: OpenOpeningComponentComponent},
    {path: 'catalogue', component: CatalogueComponent}

];








