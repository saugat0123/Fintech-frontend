import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { CommonDataService } from './shared-service/baseservice/common-dataService';
import { BranchComponent } from './component/branch/branch.component';
import { AddModelComponent } from './component/branch/add-model/add-model.component';
import { MsgModalComponent } from './common/msg-modal/msg-modal.component';
import { MsgAlertComponent } from './common/msg-alert/msg-alert.component';
import { LoanConfigComponent } from './component/loan-config/loan-config.component';
import { LoanTemplateComponent } from './component/loan-template/loan-template.component';
import { TemplateAddModelComponent } from './component/loan-template/template-add-model/template-add-model.component';
import { BasicInfoComponent } from './component/loan-main-template/basic-info/basic-info.component';
import { LoanUiComponent } from './component/loan-ui/loan-ui.component';
import { AddLoanComponent } from './component/loan-config/add-loan/add-loan.component';
import { AddUserComponent } from './component/user/add-user/add-user.component';
import { UserComponent } from './component/user/user.component';
import { ApprovallimitComponent } from './component/approvallimit/approvallimit.component';
import { AddApprovalLimitComponent } from './component/approvallimit/add-approval-limit/add-approval-limit.component';
import { SharedModule } from './module/shared/shared.module';
import {QuillModule} from "ngx-quill";


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
    BranchComponent,
    AddModelComponent,
    MsgModalComponent,
    MsgAlertComponent,
    LoanConfigComponent,
    LoanTemplateComponent,
    TemplateAddModelComponent,
    BasicInfoComponent,
    LoanUiComponent,
    AddLoanComponent,
    UserComponent,
    AddUserComponent,
    ApprovallimitComponent,
    AddApprovalLimitComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    QuillModule
  ],
  providers: [CommonService, RestApiService, CommonDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
