import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {BaseComponent} from './component/base/base.component';
import {LoginComponent} from './component/login/login.component';
import {NotificationComponent} from './component/dashboard/notification/notification.component';
import {PendingLoanComponent} from './component/dashboard/pending-loan/pending-loan.component';
import {HeaderComponent} from './component/base/header/header.component';
import {SidebarComponent} from './component/base/sidebar/sidebar.component';
import {FooterComponent} from './component/base/footer/footer.component';
import {HttpClientModule} from '@angular/common/http';
import {RestApiService} from './shared-service/authentication/rest-api.service';
import {CommonService} from './shared-service/baseservice/common-baseservice';
import {CommonDataService} from './shared-service/baseservice/common-dataService';
import {SharedModule} from './module/shared/shared.module';
import {Sidebar1Component} from './component/base/sidebar/sidebar1/sidebar1.component';
import {AddLoanComponent} from "./module/admin/component/loan-config/add-loan/add-loan.component";
import {AddDocumentComponent} from "./module/admin/component/document/add-document/add-document.component";
import {AddSubSectorComponent} from "./module/admin/component/sector/sub-sector/add-sub-sector/add-sub-sector.component";
import {AddSectorComponent} from "./module/admin/component/sector/sector/add-sector/add-sector.component";
import {AddValuatorComponent} from "./module/admin/component/valuator/add-valuator/add-valuator.component";
import {AddSubSegmentComponent} from "./module/admin/component/segment/add-sub-segment/add-sub-segment.component";
import {AddSegmentComponent} from "./module/admin/component/segment/add-segment/add-segment.component";
import {BulkUploadComponent} from "./module/admin/component/nepse/bulk-upload/bulk-upload.component";
import {AddNepseComponent} from "./module/admin/component/nepse/add-nepse/add-nepse.component";
import {AddModelComponent} from "./module/admin/component/branch/add-model/add-model.component";
import {AddApprovalLimitComponent} from "./module/admin/component/approvallimit/add-approval-limit/add-approval-limit.component";



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
    Sidebar1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    SharedModule
  ],

  providers: [CommonService, RestApiService, CommonDataService],
  bootstrap: [AppComponent],


})
export class AppModule {
}
