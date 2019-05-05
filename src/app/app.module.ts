import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbActiveModal, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
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
import {CommonLocation} from './shared-service/baseservice/common-location';


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

  providers: [CommonService, RestApiService, CommonDataService, CommonLocation],
  bootstrap: [AppComponent],



})
export class AppModule {
}
