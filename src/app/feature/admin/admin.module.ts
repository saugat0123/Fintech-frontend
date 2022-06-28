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
import {RolePermissionComponent} from './component/role-permission/role-permission.component';
import {BranchFormComponent} from './component/branch/branch-form/branch-form.component';
import {RoleFormComponent} from './component/role-permission/role-form/role-form.component';
import {ListRoleComponent} from './component/role-permission/list-role/list-role.component';
import {ValuatorComponent} from './component/valuator/valuator.component';
import {ValuatorFormComponent} from './component/valuator/valuator-form/valuator-form.component';


import {UIComponent} from './component/loan-config/loan-configuration/ui.component';


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
import {ThemeModule} from '../../@theme/theme.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {UpdateModalComponent} from '../../@theme/components';
import {NgxPrintModule} from 'ngx-print';
import {UserGuideComponent} from '../../@theme/components/user-guide/user-guide.component';
import {CatalogueComponent} from './component/catalogue/catalogue.component';
import {EmailConfigurationComponent} from './component/email-configuration/email-configuration.component';
import {EmailValidatorDirective} from '../../@core/directive/email-validator.directive';
import {RoleEditComponent} from './component/role-permission/list-role/role-edit/role-edit.component';
import {CoreModule} from '../../@core/core.module';
import {InactiveValuatorCommentComponent} from './component/valuator/inactive-valuator-comment/inactive-valuator-comment.component';
import {PreferenceComponent} from './component/preference/preference.component';
import {UserHistoryComponent} from './component/user/user-history/user-history.component';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../../environments/environment';
import { FinancialConfigComponent } from './component/preference/financial-config/financial-config.component';
import { FinancialConfigModalComponent } from './component/preference/financial-config/financial-config-modal/financial-config-modal.component';
import {NbDialogModule} from '@nebular/theme';
import {NepaliCalendarModule} from '../nepali-calendar/nepali-calendar.module';
import { CadRoleHierarchyComponent } from './component/role-hierarchy/cad-role-hierarchy/cad-role-hierarchy.component';
import { RoleAddComponent } from './component/user/role-add/role-add.component';
import {TransferLoanModule} from '../transfer-loan/transfer-loan.module';

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
    RolePermissionComponent,
    RoleFormComponent,
    RolePermissionComponent,
    ValuatorComponent,
    ValuatorFormComponent,
    UIComponent,
    UserGuideComponent,
    DocumentComponent,
    UpdateDocumentComponent,
    DocumentFormComponent,
    CompanyComponent,
    CompanyFormComponent,
    RoleFormComponent,
    ListRoleComponent,
    RoleHierarchyComponent,
    CatalogueComponent,
    EmailConfigurationComponent,
    EmailValidatorDirective,
    RoleEditComponent,
    InactiveValuatorCommentComponent,
    PreferenceComponent,
    UserHistoryComponent,
    FinancialConfigComponent,
    FinancialConfigModalComponent,
    CadRoleHierarchyComponent,
    RoleAddComponent,
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
    TransferLoanModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAP_API_KEY
    }),
    NepaliCalendarModule
  ],
  exports: [
    UserComponent
  ],

  entryComponents: [
    BranchFormComponent,
    ValuatorFormComponent,
    DocumentFormComponent,
    AddLoanComponent,
    UpdateModalComponent,
    UserFormComponent,
    CompanyFormComponent,
    TemplateAddModelComponent,
    RoleFormComponent,
    RoleEditComponent,
    InactiveValuatorCommentComponent,
    UserHistoryComponent,
    FinancialConfigModalComponent,
    RoleAddComponent
  ]

})
export class AdminModule {
}
