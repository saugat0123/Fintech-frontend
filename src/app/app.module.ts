import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { BaseComponent } from './component/base/base.component';
import { LoginComponent } from './component/login/login.component';
import { NotificationComponent } from './component/dashboard/notification/notification.component';
import { PendingLoanComponent } from './component/dashboard/pending-loan/pending-loan.component';
import { HeaderComponent } from './component/base/header/header.component';
import { SidebarComponent } from './component/base/sidebar/sidebar.component';
import { FooterComponent } from './component/base/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { RestApiService } from './shared-service/authentication/rest-api.service';
import { CommonService } from './shared-service/baseservice/common-baseservice';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { CommonDataService } from './shared-service/baseservice/common-dataService';

import { MsgModalComponent } from './common/msg-modal/msg-modal.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { MsgAlertComponent } from './common/msg-alert/msg-alert.component';
import { UpdateModalComponent } from './common/update-modal/update-modal.component';
import { BranchComponent } from './component/admin/branch/branch.component';
import { LoanConfigComponent } from './component/admin/loan-config/loan-config.component';
import { LoanTemplateComponent } from './component/admin/loan-config/loan-template/loan-template.component';
import { TemplateAddModelComponent } from './component/admin/loan-config/loan-template/template-add-model/template-add-model.component';
import { BasicInfoComponent } from './component/admin/loan-config/loan-main-template/basic-info/basic-info.component';
import { LoanUiComponent } from './component/loan-ui/loan-ui.component';
import { AddLoanComponent } from './component/admin/loan-config/add-loan/add-loan.component';
import { UserComponent } from './component/user/user.component';
import { AddUserComponent } from './component/user/add-user/add-user.component';
import { ApprovallimitComponent } from './component/admin/approvallimit/approvallimit.component';
import { AddApprovalLimitComponent } from './component/admin/approvallimit/add-approval-limit/add-approval-limit.component';
import { RolePermissionComponent } from './component/admin/role-permission/role-permission.component';
import { AddModelComponent } from './component/admin/branch/add-model/add-model.component';
import { Sidebar1Component } from './component/base/sidebar/sidebar1/sidebar1.component';
import { AddRoleComponent } from './component/admin/role-permission/add-role/add-role.component';

import { KycInfoComponent } from './component/admin/loan-config/loan-main-template/kyc-info/kyc-info.component';
import { ValuatorComponent } from './component/admin/valuator/valuator.component';
import { AddValuatorComponent } from './component/admin/valuator/add-valuator/add-valuator.component';
import { SectorComponent } from './component/admin/sector/sector/sector.component';
import { SubSectorComponent } from './component/admin/sector/sub-sector/sub-sector.component';
import { AddSectorComponent } from './component/admin/sector/sector/add-sector/add-sector.component';
import { AddSubSectorComponent } from './component/admin/sector/sub-sector/add-sub-sector/add-sub-sector.component';

import { UIComponent } from './component/admin/loan-config/ui/ui.component';
import { MatCheckboxModule, MatRadioModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DistrictComponent } from './component/admin/address/district/district.component';
import { MunicipalityComponent } from './component/admin/address/municipality/municipality.component';
import { ProvinceComponent } from './component/admin/address/province/province.component';
import { NepseComponent } from './component/admin/nepse/nepse.component';
import { SegmentComponent } from './component/admin/segment/segment/segment.component';
import { SubSegmentComponent } from './component/admin/segment/sub-segment/sub-segment.component';
import { AddSegmentComponent } from './component/admin/segment/add-segment/add-segment.component';
import { AddDistrictComponent } from './component/admin/address/add-district/add-district.component';
import { AddMunicipalityComponent } from './component/admin/address/add-municipality/add-municipality.component';
import { AddProvinceComponent } from './component/admin/address/add-province/add-province.component';
import { AddNepseComponent } from './component/admin/nepse/add-nepse/add-nepse.component';
import { AddSubSegmentComponent } from './component/admin/segment/add-sub-segment/add-sub-segment.component';
import { CompanyInfoComponent } from './component/admin/loan-config/loan-main-template/company-info/company-info.component';
import { BulkUploadComponent } from './component/admin/nepse/bulk-upload/bulk-upload.component';
import {FileSelectDirective} from 'ng2-file-upload';
import { CompanyComponent } from './component/admin/company/company.component';
import { AddCompanyComponent } from './component/admin/company/add-company/add-company.component';

import { DocumentComponent } from './component/admin/document/document.component';
import { UpdateDocumentComponent } from './component/admin/document/update-document/update-document.component';
import { AddDocumentComponent } from './component/admin/document/add-document/add-document.component';
import {ListRoleComponent} from './component/admin/role-permission/list-role/list-role.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    DashboardComponent,
    LoginComponent,
    NotificationComponent,
    PendingLoanComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SpinnerComponent,
    BranchComponent,
    AddModelComponent,
    MsgModalComponent,
    PaginationComponent,
    MsgAlertComponent,
    UpdateModalComponent,
    LoanConfigComponent,
    LoanTemplateComponent,
    TemplateAddModelComponent,
    BasicInfoComponent,
    CompanyInfoComponent,
    LoanUiComponent,
    AddLoanComponent,
    UserComponent,
    AddUserComponent,
    ApprovallimitComponent,
    AddApprovalLimitComponent,
    RolePermissionComponent,
    Sidebar1Component,
    AddRoleComponent,
    RolePermissionComponent,
    KycInfoComponent,
    ValuatorComponent,
    AddValuatorComponent,
    SectorComponent,
    SubSectorComponent,
    AddSectorComponent,
    AddSubSectorComponent,

    UIComponent,
    DistrictComponent,
    MunicipalityComponent,
    ProvinceComponent,
    NepseComponent,
    SegmentComponent,
    SubSegmentComponent,
    AddSegmentComponent,
    AddDistrictComponent,
    AddMunicipalityComponent,
    AddProvinceComponent,
    AddNepseComponent,
    AddSubSegmentComponent,
    DocumentComponent,
    UpdateDocumentComponent,
    AddDocumentComponent,
    AddSubSegmentComponent,
    BulkUploadComponent,
      ListRoleComponent,
      FileSelectDirective,
      CompanyComponent,
      AddCompanyComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatRadioModule,
    ReactiveFormsModule
  ],

  providers: [CommonService, RestApiService, CommonDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
