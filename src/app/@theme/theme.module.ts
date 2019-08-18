import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NbCardModule,
    NbChatModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbDialogModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbMenuModule,
    NbPopoverModule,
    NbProgressBarModule,
    NbRadioModule,
    NbRouteTabsetModule,
    NbSearchModule,
    NbSelectModule,
    NbSidebarModule,
    NbSpinnerModule,
    NbStepperModule,
    NbTabsetModule,
    NbThemeModule,
    NbToastrModule,
    NbTooltipModule,
    NbUserModule,
    NbWindowModule,
} from '@nebular/theme';

import {
    AlertComponent,
    BreadcrumbComponent,
    FooterComponent,
    HeaderComponent,
    PagingComponent,
    SpinnerComponent,
    UpdateModalComponent,
    ValidationErrorComponent
} from './components';

import {CapitalizePipe, EvaIconsPipe, NumberWithCommasPipe, PluralPipe, RoundPipe, TimingPipe} from './pipes';
import {DEFAULT_THEME} from './styles/theme.default';
import {COSMIC_THEME} from './styles/theme.cosmic';
import {CORPORATE_THEME} from './styles/theme.corporate';
import {BaseLayout} from './layouts';
import {RouterModule} from '@angular/router';
import {IconCardComponent} from './components/iconcard/icon-card.component';
import {SearchResultComponent} from './components/header/header-form/searchResult.component';
import {MessageModalComponent} from './components/message-modal/message-modal.component';
import {ProfileComponent} from './components/profile/profile.component';
import {NotificationComponent} from './components/notification/notification.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {CKEditorModule} from 'ng2-ckeditor';

// import {NbSecurityModule} from '@nebular/security';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule];

const NB_MODULES = [
    NbCardModule,
    NbLayoutModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbSearchModule,
    NbSidebarModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbContextMenuModule,
    NgbModule,
    // NbSecurityModule, // *nbIsGranted directive,
    NbProgressBarModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NbStepperModule,
    NbButtonModule,
    NbListModule,
    NbToastrModule,
    NbInputModule,
    NbAccordionModule,
    NbDatepickerModule,
    NbDialogModule,
    NbWindowModule,
    NbAlertModule,
    NbSpinnerModule,
    NbRadioModule,
    NbSelectModule,
    NbChatModule,
    NbTooltipModule,
    NbCalendarKitModule
];

const COMPONENTS = [
    HeaderComponent,
    FooterComponent,
    SearchResultComponent,
    BaseLayout,
    IconCardComponent,
    AlertComponent,
    BreadcrumbComponent,
    SpinnerComponent,
    UpdateModalComponent,
    PagingComponent,
    ValidationErrorComponent,
    MessageModalComponent,
    NotificationComponent
];

const ENTRY_COMPONENTS = [
    SearchResultComponent,
    MessageModalComponent,
    ProfileComponent,
    ChangePasswordComponent
];

const PIPES = [
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    NumberWithCommasPipe,
    EvaIconsPipe,
];

const NB_THEME_PROVIDERS = [
    ...NbThemeModule.forRoot(
        {
            name: 'corporate',
        },
        [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME],
    ).providers,
    ...NbSidebarModule.forRoot().providers,
    ...NbMenuModule.forRoot().providers,
    ...NbDatepickerModule.forRoot().providers,
    ...NbDialogModule.forRoot().providers,
    ...NbWindowModule.forRoot().providers,
    ...NbToastrModule.forRoot().providers
    // ...NbChatModule.forRoot({
    //     messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    // }).providers,
];

@NgModule({
    imports: [...BASE_MODULES, ...NB_MODULES, RouterModule],
    exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
    declarations: [...COMPONENTS, ...PIPES, ProfileComponent, ChangePasswordComponent],
    entryComponents: [...ENTRY_COMPONENTS],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ThemeModule,
            providers: [...NB_THEME_PROVIDERS],
        };
    }
}
