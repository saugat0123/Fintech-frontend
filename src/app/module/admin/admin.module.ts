import {NgModule} from '@angular/core';

import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BranchComponent} from './component/branch/branch.component';
import {LoanConfigComponent} from './component/loan-config/loan-config.component';
import {LoanTemplateComponent} from './component/loan-config/loan-template/loan-template.component';
import {TemplateAddModelComponent} from './component/loan-config/loan-template/template-add-model/template-add-model.component';

import {AddLoanComponent} from './component/loan-config/add-loan/add-loan.component';
import {UserComponent} from './component/user/user.component';
import {AddUserComponent} from './component/user/add-user/add-user.component';
import {ApprovallimitComponent} from './component/approvallimit/approvallimit.component';
import {AddApprovalLimitComponent} from './component/approvallimit/add-approval-limit/add-approval-limit.component';
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {AddModelComponent} from './component/branch/add-model/add-model.component';
import {AddRoleComponent} from './component/role-permission/add-role/add-role.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';
import {ValuatorComponent} from './component/valuator/valuator.component';
import {AddValuatorComponent} from './component/valuator/add-valuator/add-valuator.component';
import {SectorComponent} from './component/sector/sector/sector.component';
import {SubSectorComponent} from './component/sector/sub-sector/sub-sector.component';
import {AddSectorComponent} from './component/sector/sector/add-sector/add-sector.component';
import {AddSubSectorComponent} from './component/sector/sub-sector/add-sub-sector/add-sub-sector.component';

import {UIComponent} from './component/loan-config/loan-configuration/ui.component';
import {NepseComponent} from './component/nepse/nepse.component';
import {SegmentComponent} from './component/segment/segment/segment.component';
import {SubSegmentComponent} from './component/segment/sub-segment/sub-segment.component';
import {AddSegmentComponent} from './component/segment/add-segment/add-segment.component';
import {AddNepseComponent} from './component/nepse/add-nepse/add-nepse.component';
import {AddSubSegmentComponent} from './component/segment/add-sub-segment/add-sub-segment.component';

import {CompanyComponent} from './component/company/company.component';
import {AddCompanyComponent} from './component/company/add-company/add-company.component';

import {DocumentComponent} from './component/document/document.component';
import {UpdateDocumentComponent} from './component/document/update-document/update-document.component';
import {AddDocumentComponent} from './component/document/add-document/add-document.component';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin-routing';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';

import {UpdateModalComponent} from '../../common/update-modal/update-modal.component';
import {MsgModalComponent} from '../../common/msg-modal/msg-modal.component';
import { RoleHierarchyComponent } from './component/role-hierarchy/role-hierarchy.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuestionComponent } from './component/eligibility/question/question.component';
import { AllRequestsComponent } from './component/all-requests/all-requests.component';
import { EligibleRequestsComponent } from './component/eligibility/eligible-requests/eligible-requests.component';
import { NonEligibleRequestsComponent } from './component/eligibility/non-eligible-requests/non-eligible-requests.component';
import { NewRequestsComponent } from './component/eligibility/new-requests/new-requests.component';

// import { SecurityComponent } from './component/loan-config/loan-main-template/security/security.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NgSelectModule} from '@ng-select/ng-select';
import {CompanyInfoComponent} from '../loan/component/loan-main-template/company-info/company-info.component';
import {BasicInfoComponent} from '../loan/component/loan-main-template/basic-info/basic-info.component';

@NgModule({
    declarations: [
        BranchComponent,
        AddModelComponent,
        LoanConfigComponent,
        LoanTemplateComponent,
        TemplateAddModelComponent,
        BasicInfoComponent,
        CompanyInfoComponent,
        AddLoanComponent,
        UserComponent,
        AddUserComponent,
        ApprovallimitComponent,
        AddApprovalLimitComponent,
        RolePermissionComponent,
        AddRoleComponent,
        RolePermissionComponent,

        ValuatorComponent,
        AddValuatorComponent,
        SectorComponent,
        SubSectorComponent,
        AddSectorComponent,
        AddSubSectorComponent,

        UIComponent,
        NepseComponent,
        SegmentComponent,
        SubSegmentComponent,
        AddSegmentComponent,
        AddNepseComponent,
        AddSubSegmentComponent,
        DocumentComponent,
        UpdateDocumentComponent,
        AddDocumentComponent,
        AddSubSegmentComponent,
        CompanyComponent,
        AddCompanyComponent,
        AddRoleComponent,
        ListRoleComponent,
        RoleHierarchyComponent,
        QuestionComponent,
        AllRequestsComponent,
        EligibleRequestsComponent,
        NonEligibleRequestsComponent,
        NewRequestsComponent
        // SecurityComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        RouterModule.forChild(adminRoutes),
        SharedModule,
        DragDropModule,
        NgSelectModule
    ],

    entryComponents: [
        AddApprovalLimitComponent,
        AddModelComponent,
        AddNepseComponent,
        AddSegmentComponent,
        AddSubSegmentComponent,
        AddValuatorComponent,
        AddSectorComponent,
        AddSubSectorComponent,
        AddDocumentComponent,
        AddLoanComponent,
        UpdateModalComponent,
        AddUserComponent,
        AddCompanyComponent,
        MsgModalComponent,
        TemplateAddModelComponent,
        AddRoleComponent
    ]

})
export class AdminModule {
}
