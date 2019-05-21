import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {RestApiService} from './@core/service/authentication/rest-api.service';
import {CommonService} from './@core/service/baseservice/common-baseservice';
import {CommonDataService} from './@core/service/baseservice/common-dataService';
import {CommonLocation} from './@core/service/baseservice/common-location';
import {QuillModule} from 'ngx-quill';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ThemeModule} from './@theme/theme.module';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
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
        ThemeModule
    ],

    providers: [CommonService, RestApiService, CommonDataService, CommonLocation, {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
