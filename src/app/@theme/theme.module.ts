import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbBadgeModule,
    NbButtonModule,
    NbCalendarKitModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NbCardModule,
    NbCheckboxModule,
    NbContextMenuModule,
    NbDatepickerModule,
    NbDialogModule,
    NbIconModule,
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
    NbToggleModule,
    NbTooltipModule,
    NbUserModule,
    NbWindowModule
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
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import { OverlaySpinnerComponent } from './components/overlay-spinner/overlay-spinner.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import {ChartModule} from '../chart/chart.module';
import { JsonParsePipe } from './pipes/json-parse.pipe';
import { RolesSwitchComponent } from './components/roles-switch/roles-switch.component';

// import {NbSecurityModule} from '@nebular/security';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule, ChartModule];

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
    NbTooltipModule,
    NbCalendarKitModule,
    NbIconModule,
    NbToggleModule,
    NbEvaIconsModule,
    NbBadgeModule

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
    NotificationComponent,
    OverlaySpinnerComponent,
    DeleteModalComponent,

];

const ENTRY_COMPONENTS = [
    SearchResultComponent,
    MessageModalComponent,
    ProfileComponent,
    ChangePasswordComponent,
    UpdateModalComponent,
    DeleteModalComponent,

];

const PIPES = [
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    NumberWithCommasPipe,
    EvaIconsPipe,
    JsonParsePipe
];

const NB_THEME_PROVIDERS = [
    ...NbThemeModule.forRoot(
        {
            name: 'default',
        },
        [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME],
    ).providers,
    ...NbSidebarModule.forRoot().providers,
    ...NbMenuModule.forRoot().providers,
    ...NbDatepickerModule.forRoot().providers,
    ...NbDialogModule.forRoot().providers,
    ...NbWindowModule.forRoot().providers,
    ...NbToastrModule.forRoot().providers
];

@NgModule({
    imports: [...BASE_MODULES, ...NB_MODULES, RouterModule, NgxSpinnerModule],
    exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES, NgxSpinnerModule],
    declarations: [...COMPONENTS, ...PIPES, ProfileComponent, ChangePasswordComponent, RolesSwitchComponent],
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
