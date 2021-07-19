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
import {CatalogueComponent} from './component/catalogue/catalogue.component';
import {UserGuideComponent} from '../../@theme/components/user-guide/user-guide.component';
import {EmailConfigurationComponent} from './component/email-configuration/email-configuration.component';
import {EligibilitySummaryComponent} from './component/eligibility/eligibility-summary/eligibility-summary.component';
import {AccountTypeConfigComponent} from './component/opening-account/config/account-type-config/account-type-config.component';
import {AccountCategoryConfigComponent} from './component/opening-account/config/account-category-config/account-category-config.component';
import {PreferenceComponent} from './component/preference/preference.component';
import {CreditMemoTypeComponent} from "../credit-memo/component/credit-memo-type/credit-memo-type.component";



// import {SecurityComponent} from './component/loan-config/loan-main-template/security/security.component';


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
    {path: 'user-guide', component: UserGuideComponent},
    {path: 'preference-master', component: PreferenceComponent},
    {
        path: 'eligibility',
        children: [
            {path: 'question', component: QuestionComponent},
            {path: 'general-question', component: GeneralQuestionComponent},
            {path: 'new-requests', component: NewRequestsComponent},
            {path: 'eligible', component: EligibleRequestsComponent},
            {path: 'non-eligible', component: NonEligibleRequestsComponent},
            {path: 'eligibility-summary', component: EligibilitySummaryComponent},
            {path: 'credit-memo-type', component: CreditMemoTypeComponent},


        ]
    },
    {path: 'role', component: RolePermissionComponent},
    {path: 'roleList', component: ListRoleComponent},
    {path: 'roleHierarchy', component: RoleHierarchyComponent},
    {path: 'openingAccount', component: OpeningAccountComponent},
    {path: 'openOpeningAccount', component: OpenOpeningComponentComponent},
    {
        path: 'openingAccountConfig',
        children: [
            {path: 'accountType', component: AccountTypeConfigComponent},
            {path: 'accountCategory', component: AccountCategoryConfigComponent}
        ]
    },
    {path: 'catalogue', component: CatalogueComponent},
    {path: 'email-config', component: EmailConfigurationComponent},

];








