import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import {ResentForgotPasswordComponent} from './component/resent-forgot-password/resent-forgot-password.component';
import {LoginBaseComponent} from './component/login-base/login-base.component';
import {NewPasswordComponent} from './component/new-password/new-password.component';
import {RequestInterceptor} from './@core/service/authentication/request-interceptor.service';
import {NbAccordionModule} from '@nebular/theme';
import {ReactiveFormsModule} from '@angular/forms';

// import { GroupComponent } from './group/group.component';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResentForgotPasswordComponent,
        LoginBaseComponent,
        NewPasswordComponent,

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
        NgxPrintModule,
        NbDatepickerModule.forRoot(),
        NbAccordionModule,
        ReactiveFormsModule,
    ],
    providers: [AddressService, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy,
    }, { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        DatePipe],
    bootstrap: [AppComponent],
    exports: [],
    entryComponents: []
})
export class AppModule {
}
