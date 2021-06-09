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
import {DocumentFormComponent} from './component/document/document-form/document-form.component';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin-routing';
import {CommonModule} from '@angular/common';
import {RoleHierarchyComponent} from './component/role-hierarchy/role-hierarchy.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {QuestionComponent} from './component/eligibility/question/question.component';
import {EligibleRequestsComponent} from './component/eligibility/eligible-requests/eligible-requests.component';
import {NonEligibleRequestsComponent} from './component/eligibility/non-eligible-requests/non-eligible-requests.component';
import {NewRequestsComponent} from './component/eligibility/new-requests/new-requests.component';
import {ThemeModule} from '../../@theme/theme.module';
// import { SecurityComponent } from './component/loan-config/loan-main-template/security/security.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {UpdateModalComponent} from '../../@theme/components';
import {OpeningAccountComponent} from './component/opening-account/opening-account.component';
import {OpenOpeningComponentComponent} from './component/opening-account/open-opening-component/open-opening-component.component';
import {NgxPrintModule} from 'ngx-print';
import {OpeningAccountPrintComponent} from './component/opening-account/opening-account-print/opening-account-print.component';
import {GeneralQuestionComponent} from './component/eligibility/general-question/general-question.component';
import {EligibilityDocumentViewComponent} from './component/eligibility/eligibility-document-view/eligibility-document-view.component';
import {UserGuideComponent} from '../../@theme/components/user-guide/user-guide.component';
import {CatalogueComponent} from './component/catalogue/catalogue.component';
import {EmailConfigurationComponent} from './component/email-configuration/email-configuration.component';
import {EmailValidatorDirective} from '../../@core/directive/email-validator.directive';
import {RoleEditComponent} from './component/role-permission/list-role/role-edit/role-edit.component';
import {EligibilitySummaryComponent} from './component/eligibility/eligibility-summary/eligibility-summary.component';
import {CoreModule} from '../../@core/core.module';
import {AccountTypeConfigComponent} from './component/opening-account/config/account-type-config/account-type-config.component';
import {AccountCategoryConfigComponent} from './component/opening-account/config/account-category-config/account-category-config.component';
import {AccountTypeFormComponent} from './component/opening-account/config/account-type-config/account-type-form/account-type-form.component';
import {AccountCategoryFormComponent} from './component/opening-account/config/account-category-config/account-category-form/account-category-form.component';
import {InactiveValuatorCommentComponent} from './component/valuator/inactive-valuator-comment/inactive-valuator-comment.component';
import {PreferenceComponent} from './component/preference/preference.component';
import {UserHistoryComponent} from './component/user/user-history/user-history.component';
import {ShareValueFormComponent} from './component/nepse/share-value-form/share-value-form.component';
import {ShareListComponent} from './component/nepse/share-list/share-list.component';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../../environments/environment';
import {BaseInterestComponent} from './component/base-interest/base-interest.component';
import {BaseInterestFormComponent} from './component/base-interest/base-interest-form/base-interest-form.component';
import {BlacklistComponent} from './component/blacklist/blacklist.component';
import {BlacklistFormComponent} from './component/blacklist/blacklist-form/blacklist-form.component';
import {NotificationMasterComponent} from './component/notification-master/notification-master.component';
import {AccountDocumentFormComponent} from './component/opening-account/config/account-category-config/account-document-form/account-document-form.component';
import {RemarkModalComponent} from './component/opening-account/remark-modal/remark-modal.component';
import {AccountNumberModalComponent} from './component/opening-account/account-no-modal/account-no-modal.component';
import { GroupConfigComponent } from './component/preference/group-config/group-config.component';
import { FinancialConfigComponent } from './component/preference/financial-config/financial-config.component';
import { FinancialConfigModalComponent } from './component/preference/financial-config/financial-config-modal/financial-config-modal.component';
import {NbDialogModule} from '@nebular/theme';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import { CadRoleHierarchyComponent } from './component/role-hierarchy/cad-role-hierarchy/cad-role-hierarchy.component';
import { CbsGroupExecutorComponent } from './component/preference/cbs-group-executor/cbs-group-executor.component';
import { RoleAddComponent } from './component/user/role-add/role-add.component';
import { EligibilityLoanConfigComponent } from './component/eligibility/eligibility-loan-config/eligibility-loan-config.component';
import { LoanConfigFormComponent } from './component/eligibility/eligibility-loan-config/loan-config-form/loan-config-form.component';
import { LoanConfigDeleteModalComponent } from './component/eligibility/eligibility-loan-config/loan-config-delete-modal/loan-config-delete-modal.component';

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
        DocumentFormComponent,
        SubSegmentFormComponent,
        CompanyComponent,
        CompanyFormComponent,
        RoleFormComponent,
        ListRoleComponent,
        RoleHierarchyComponent,
        QuestionComponent,
        EligibleRequestsComponent,
        NonEligibleRequestsComponent,
        NewRequestsComponent,
        OpeningAccountComponent,
        OpenOpeningComponentComponent,
        OpeningAccountPrintComponent,
        GeneralQuestionComponent,
        EligibilityDocumentViewComponent,
        CatalogueComponent,
        EmailConfigurationComponent,
        EmailValidatorDirective,
        RoleEditComponent,
        EligibilitySummaryComponent,
        AccountTypeConfigComponent,
        AccountCategoryConfigComponent,
        AccountTypeFormComponent,
        AccountCategoryFormComponent,
        InactiveValuatorCommentComponent,
        PreferenceComponent,
        UserHistoryComponent,
        ShareValueFormComponent,
        ShareListComponent,
        BaseInterestComponent,
        BaseInterestFormComponent,
        BlacklistComponent,
        BlacklistFormComponent,
        NotificationMasterComponent,
        AccountDocumentFormComponent,
        RemarkModalComponent,
        AccountNumberModalComponent,
        GroupConfigComponent,
        FinancialConfigComponent,
        FinancialConfigModalComponent,
        CadRoleHierarchyComponent,
        CbsGroupExecutorComponent,
        RoleAddComponent,
        EligibilityLoanConfigComponent,
        LoanConfigFormComponent,
        LoanConfigDeleteModalComponent,
        // SecurityComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminRoutes),
    ThemeModule,
    DragDropModule,
    NgSelectModule,
    NgxPrintModule,
    NbDialogModule.forRoot(),
    CoreModule,
    AgmCoreModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAP_API_KEY
    }),
    NepaliCalendarModule
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
        DocumentFormComponent,
        AddLoanComponent,
        UpdateModalComponent,
        UserFormComponent,
        CompanyFormComponent,
        TemplateAddModelComponent,
        RoleFormComponent,
        EligibilityDocumentViewComponent,
        RoleEditComponent,
        AccountTypeFormComponent,
        AccountCategoryFormComponent,
        InactiveValuatorCommentComponent,
        UserHistoryComponent,
        ShareValueFormComponent,
        BaseInterestFormComponent,
        BlacklistFormComponent,
        AccountDocumentFormComponent,
        RemarkModalComponent,
        AccountNumberModalComponent,
        FinancialConfigModalComponent,
        RoleAddComponent,
        LoanConfigDeleteModalComponent

    ]

})
export class AdminModule {
}
