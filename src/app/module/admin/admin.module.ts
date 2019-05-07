import {NgModule} from '@angular/core';

import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BranchComponent} from './component/branch/branch.component';
import {LoanConfigComponent} from './component/loan-config/loan-config.component';
import {LoanTemplateComponent} from './component/loan-config/loan-template/loan-template.component';
import {TemplateAddModelComponent} from './component/loan-config/loan-template/template-add-model/template-add-model.component';
import {BasicInfoComponent} from './component/loan-config/loan-main-template/basic-info/basic-info.component';
import {AddLoanComponent} from './component/loan-config/add-loan/add-loan.component';
import {UserComponent} from './component/user/user.component';
import {AddUserComponent} from './component/user/add-user/add-user.component';
import {ApprovallimitComponent} from './component/approvallimit/approvallimit.component';
import {AddApprovalLimitComponent} from './component/approvallimit/add-approval-limit/add-approval-limit.component';
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {AddModelComponent} from './component/branch/add-model/add-model.component';
import {AddRoleComponent} from './component/role-permission/add-role/add-role.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';

import {KycInfoComponent} from './component/loan-config/loan-main-template/kyc-info/kyc-info.component';
import {ValuatorComponent} from './component/valuator/valuator.component';
import {AddValuatorComponent} from './component/valuator/add-valuator/add-valuator.component';
import {SectorComponent} from './component/sector/sector/sector.component';
import {SubSectorComponent} from './component/sector/sub-sector/sub-sector.component';
import {AddSectorComponent} from './component/sector/sector/add-sector/add-sector.component';
import {AddSubSectorComponent} from './component/sector/sub-sector/add-sub-sector/add-sub-sector.component';

import {UIComponent} from './component/loan-config/ui/ui.component';
import {NepseComponent} from './component/nepse/nepse.component';
import {SegmentComponent} from './component/segment/segment/segment.component';
import {SubSegmentComponent} from './component/segment/sub-segment/sub-segment.component';
import {AddSegmentComponent} from './component/segment/add-segment/add-segment.component';
import {AddNepseComponent} from './component/nepse/add-nepse/add-nepse.component';
import {AddSubSegmentComponent} from './component/segment/add-sub-segment/add-sub-segment.component';
import {CompanyInfoComponent} from './component/loan-config/loan-main-template/company-info/company-info.component';
import {CompanyComponent} from './component/company/company.component';
import {AddCompanyComponent} from './component/company/add-company/add-company.component';

import {DocumentComponent} from './component/document/document.component';
import {UpdateDocumentComponent} from './component/document/update-document/update-document.component';
import {AddDocumentComponent} from './component/document/add-document/add-document.component';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin-routing';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {LoanUiComponent} from './component/loan-ui/loan-ui.component';
import {UpdateModalComponent} from '../../common/update-modal/update-modal.component';
import {MsgModalComponent} from '../../common/msg-modal/msg-modal.component';
import { QuestionComponent } from './component/question/question.component';

// import { SecurityComponent } from './component/loan-config/loan-main-template/security/security.component';

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
        KycInfoComponent,
        ValuatorComponent,
        AddValuatorComponent,
        SectorComponent,
        SubSectorComponent,
        AddSectorComponent,
        AddSubSectorComponent,
        LoanUiComponent,
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
        QuestionComponent
        // SecurityComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(adminRoutes),
        SharedModule
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
