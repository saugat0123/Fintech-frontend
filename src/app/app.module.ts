import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
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
import {CKEditorModule} from 'ng2-ckeditor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {EngToNepaliNumberPipe} from './@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from './@core/pipe/currency-formatter.pipe';
import {NepaliCurrencyWordPipe} from './@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from './@core/pipe/nepali-to-eng-number.pipe';
import {NepaliWordPipe} from './@core/pipe/nepali-word.pipe';
import {NepaliPercentWordPipe} from './@core/pipe/nepali-percent-word.pipe';
import {TimeOutPopUpComponent} from './@core/time-out-pop-up/time-out-pop-up.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResentForgotPasswordComponent,
        LoginBaseComponent,
        NewPasswordComponent,
        TimeOutPopUpComponent,

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
        CKEditorModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })

    ],
    providers: [AddressService, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy,
    }, {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true},
        DatePipe, EngToNepaliNumberPipe, CurrencyFormatterPipe, NepaliCurrencyWordPipe , NepaliToEngNumberPipe, NepaliWordPipe,
        NepaliPercentWordPipe],
    bootstrap: [AppComponent],
    exports: [

    ],
    entryComponents: [TimeOutPopUpComponent]

})
export class AppModule {
}

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
