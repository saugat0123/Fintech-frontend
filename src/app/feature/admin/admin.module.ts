import {NgModule} from '@angular/core';

import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BranchComponent} from './component/branch/branch.component';
import {LoanConfigComponent} from './component/loan-config/loan-config.component';
import {LoanTemplateComponent} from './component/loan-config/loan-template/loan-template.component';
import {TemplateAddModelComponent} from './component/loan-config/loan-template/template-add-model/template-add-model.component';

import {AddLoanComponent} from './component/loan-config/add-loan/add-loan.component';
import {UserComponent} from './component/user/user.component';
import {UserFormComponent} from './component/user/user-form/user-form.component';
import {ApprovalLimitComponent} from './component/approvallimit/approval-limit.component';
import {ApprovalLimitFormComponent} from './component/approvallimit/approval-limit-form/approval-limit-form.component';
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {BranchFormComponent} from './component/branch/branch-form/branch-form.component';
import {RoleFormComponent} from './component/role-permission/role-form/role-form.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';
import {ValuatorComponent} from './component/valuator/valuator.component';
import {ValuatorFormComponent} from './component/valuator/valuator-form/valuator-form.component';
import {SectorComponent} from './component/sector/sector/sector.component';
import {SubSectorComponent} from './component/sector/sub-sector/sub-sector.component';
import {SectorFormComponent} from './component/sector/sector/sector-form/sector-form.component';
import {SubSectorFormComponent} from './component/sector/sub-sector/sub-sector-form/sub-sector-form.component';

import {UIComponent} from './component/loan-config/loan-configuration/ui.component';
import {NepseComponent} from './component/nepse/nepse.component';
import {SegmentComponent} from './component/segment/segment/segment.component';
import {SubSegmentComponent} from './component/segment/sub-segment/sub-segment.component';
import {SegmentFormComponent} from './component/segment/segment/segment-form/segment-form.component';
import {NepseFormComponent} from './component/nepse/nepse-form/nepse-form.component';
import {SubSegmentFormComponent} from './component/segment/sub-segment/sub-segment-form/sub-segment-form.component';

import {CompanyComponent} from './component/company/company.component';
import {CompanyFormComponent} from './component/company/company-form/company-form.component';

import {DocumentComponent} from './component/document/document.component';
import {UpdateDocumentComponent} from './component/document/update-document/update-document.component';
import {AddDocumentComponent} from './component/document/add-document/add-document.component';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin-routing';
import {CommonModule} from '@angular/common';
import {RoleHierarchyComponent} from './component/role-hierarchy/role-hierarchy.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {QuestionComponent} from './component/eligibility/question/question.component';
import {AllRequestsComponent} from './component/all-requests/all-requests.component';
import {EligibleRequestsComponent} from './component/eligibility/eligible-requests/eligible-requests.component';
import {NonEligibleRequestsComponent} from './component/eligibility/non-eligible-requests/non-eligible-requests.component';
import {NewRequestsComponent} from './component/eligibility/new-requests/new-requests.component';
import {ThemeModule} from '../../@theme/theme.module';
// import { SecurityComponent } from './component/loan-config/loan-main-template/security/security.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NgSelectModule} from '@ng-select/ng-select';
import {MsgModalComponent, UpdateModalComponent} from '../../@theme/components';
import {OpeningAccountComponent} from './component/opening-account/opening-account.component';
import {OpenOpeningComponentComponent} from './component/opening-account/open-opening-component/open-opening-component.component';
import {ApprovalOpeningAccountComponent} from './component/opening-account/approval-opening-account/approval-opening-account.component';
import {RejectedOpeningAccountComponent} from './component/opening-account/rejected-opening-account/rejected-opening-account.component';
import {NgxPrintModule} from 'ngx-print';
import {OpeningAccountPrintComponent} from './component/opening-account/opening-account-print/opening-account-print.component';
import {GeneralQuestionComponent} from './component/eligibility/general-question/general-question.component';
import {EligibilityDocumentViewComponent} from './component/eligibility/eligibility-document-view/eligibility-document-view.component';
import {UserGuideComponent} from '../../@theme/components/user-guide/user-guide.component';
import {CatalogueComponent} from './component/catalogue/catalogue.component';
import {EmailConfigurationComponent} from './component/email-configuration/email-configuration.component';
import {EmailValidatorDirective} from '../../@core/directive/email-validator.directive';
import {NumberValidatorDirective} from '../../@core/directive/number-validator.directive';
import { RoleEditComponent } from './component/role-permission/list-role/role-edit/role-edit.component';

@NgModule({
    declarations: [
        BranchComponent,
        BranchFormComponent,
        LoanConfigComponent,
        LoanTemplateComponent,
        TemplateAddModelComponent,
        AddLoanComponent,
        UserComponent,
        UserFormComponent,
        ApprovalLimitComponent,
        ApprovalLimitFormComponent,
        RolePermissionComponent,
        RoleFormComponent,
        RolePermissionComponent,

        ValuatorComponent,
        ValuatorFormComponent,
        SectorComponent,
        SubSectorComponent,
        SectorFormComponent,
        SubSectorFormComponent,

        UIComponent,
        UserGuideComponent,
        NepseComponent,
        SegmentComponent,
        SubSegmentComponent,
        SegmentFormComponent,
        NepseFormComponent,
        SubSegmentFormComponent,
        DocumentComponent,
        UpdateDocumentComponent,
        AddDocumentComponent,
        SubSegmentFormComponent,
        CompanyComponent,
        CompanyFormComponent,
        RoleFormComponent,
        ListRoleComponent,
        RoleHierarchyComponent,
        QuestionComponent,
        AllRequestsComponent,
        EligibleRequestsComponent,
        NonEligibleRequestsComponent,
        NewRequestsComponent,
        OpeningAccountComponent,
        OpenOpeningComponentComponent,
        ApprovalOpeningAccountComponent,
        RejectedOpeningAccountComponent,
        OpeningAccountPrintComponent,
        GeneralQuestionComponent,
        EligibilityDocumentViewComponent,
        CatalogueComponent,
        EmailConfigurationComponent,
        EmailValidatorDirective,
        NumberValidatorDirective,
        RoleEditComponent

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
        ThemeModule,
        DragDropModule,
        NgSelectModule,
        NgxPrintModule
    ],

    entryComponents: [
        ApprovalLimitFormComponent,
        BranchFormComponent,
        NepseFormComponent,
        SegmentFormComponent,
        SubSegmentFormComponent,
        ValuatorFormComponent,
        SectorFormComponent,
        SubSectorFormComponent,
        AddDocumentComponent,
        AddLoanComponent,
        UpdateModalComponent,
        UserFormComponent,
        CompanyFormComponent,
        MsgModalComponent,
        TemplateAddModelComponent,
        RoleFormComponent,
        EligibilityDocumentViewComponent,
        RoleEditComponent
    ]

})
export class AdminModule {
}
