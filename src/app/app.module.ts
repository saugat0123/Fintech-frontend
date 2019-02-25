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
import { BranchComponent } from './component/branch/branch.component';
import { AddModelComponent } from './component/branch/add-model/add-model.component';
import { MsgModalComponent } from './common/msg-modal/msg-modal.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { MsgAlertComponent } from './common/msg-alert/msg-alert.component';
import { UpdateModalComponent } from './common/update-modal/update-modal.component';
import { DocumentComponent } from './component/document/document.component';
import { PopupModelComponent } from './component/document/popup-model/popup-model.component';
import { NewComponent } from './component/document/new/new.component';
import { RenewalComponent } from './component/document/renewal/renewal.component';
import { CadComponent } from './component/document/cad/cad.component';
import { TypeComponent } from './component/document/type/type.component';


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
    DocumentComponent,
    PopupModelComponent,
    NewComponent,
    RenewalComponent,
    CadComponent,
    TypeComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule
  ],
  providers: [CommonService, RestApiService, CommonDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
