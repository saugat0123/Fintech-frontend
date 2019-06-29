import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonService} from './@core/service/baseservice/common-baseservice';
import {CommonDataService} from './@core/service/baseservice/common-dataService';
import {AddressService} from './@core/service/baseservice/address.service';
import {QuillModule} from 'ngx-quill';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ThemeModule} from './@theme/theme.module';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NbDatepickerModule} from '@nebular/theme';
import {NgxPrintModule} from 'ngx-print';
import {ForgotPasswordComponent} from './component/forgot-password/forgot-password.component';
import { ResentForgotPasswordComponent } from './component/resent-forgot-password/resent-forgot-password.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResentForgotPasswordComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,

        ThemeModule.forRoot(),
        QuillModule,
        RouterModule,
        AppRoutingModule,
        DragDropModule,
        ThemeModule,
        NgxPrintModule,
        NbDatepickerModule.forRoot(),
    ],
    providers: [CommonService, CommonDataService, AddressService, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }, DatePipe],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule {
}
