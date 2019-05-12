import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
import {NotificationComponent} from './component/dashboard/notification/notification.component';
import {PendingLoanComponent} from './component/dashboard/pending-loan/pending-loan.component';
import {HttpClientModule} from '@angular/common/http';
import {RestApiService} from './shared-service/authentication/rest-api.service';
import {CommonService} from './shared-service/baseservice/common-baseservice';
import {CommonDataService} from './shared-service/baseservice/common-dataService';
import {SharedModule} from './pages/shared/shared.module';
import {CommonLocation} from './shared-service/baseservice/common-location';
import {QuillModule} from 'ngx-quill';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ThemeModule} from './@theme/theme.module';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotificationComponent,
        PendingLoanComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,

        ThemeModule.forRoot(),
        SharedModule,
        QuillModule,
        RouterModule,
        AppRoutingModule,
        ThemeModule
    ],

    providers: [CommonService, RestApiService, CommonDataService, CommonLocation, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule {
}
