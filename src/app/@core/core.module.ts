import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {AnalyticsService, LayoutService, StateService, ToastService} from './utils';
import {PermissionService} from './service/permission.service';
import {CurrencyFormatterPipe} from './pipe/currency-formatter.pipe';
import {NaturalNumberValidatorDirective} from './directive/natural-number-validator.directive';
import {PositiveDecimalNumberValidatorDirective} from './directive/positive-decimal-number-validator.directive';
import {SafePipe} from '../feature/memo/pipe/safe.pipe';
import {NepaliWordPipe} from './pipe/nepali-word.pipe';
import {ReplacePipe} from './utils/replace.pipe';
import {RoundvaluePipe} from './pipe/roundvalue.pipe';
import {BooleanConvertPipe} from './pipe/boolean-convert.pipe';
import {DecimalNumberDirective} from './directive/decimal-number.directive';
import {NepaliToEngNumberPipe} from './pipe/nepali-to-eng-number.pipe';
import {LoanStatusPipe} from './pipe/loan-status-pipe';
import {EngToNepaliNumberPipe} from './pipe/eng-to-nepali-number.pipe';
// import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
// import { NbSecurityModule, NbRoleProvider } from '@nebular/security';

const socialLinks = [
    {
        url: 'https://github.com/akveo/nebular',
        target: '_blank',
        icon: 'socicon-github',
    },
    {
        url: 'https://www.facebook.com/akveo/',
        target: '_blank',
        icon: 'socicon-facebook',
    },
    {
        url: 'https://twitter.com/akveo_inc',
        target: '_blank',
        icon: 'socicon-twitter',
    },
];

const DATA_SERVICES = [];
/*
export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}*/

export const NB_CORE_PROVIDERS = [
    ...DATA_SERVICES,
    /* ...NbAuthModule.forRoot({

       strategies: [
         NbDummyAuthStrategy.setup({
           name: 'email',
           delay: 3000,
         }),
       ],
       forms: {
         login: {
           socialLinks: socialLinks,
         },
         register: {
           socialLinks: socialLinks,
         },
       },
     }).providers,

     NbSecurityModule.forRoot({
       accessControl: {
         guest: {
           view: '*',
         },
         user: {
           parent: 'guest',
           create: '*',
           edit: '*',
           remove: '*',
         },
       },
     }).providers,

     {
       provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
     },*/
    AnalyticsService,
    LayoutService,
    StateService,
    ToastService,
    PermissionService,
    LoanStatusPipe,

];

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        // NbAuthModule,
        CurrencyFormatterPipe,
        PositiveDecimalNumberValidatorDirective,
        NaturalNumberValidatorDirective,
        SafePipe,
        NepaliWordPipe,
        ReplacePipe,
        RoundvaluePipe,
        BooleanConvertPipe,
        DecimalNumberDirective,
        NepaliToEngNumberPipe,
        LoanStatusPipe,
        EngToNepaliNumberPipe
    ],
    declarations: [CurrencyFormatterPipe,
        NaturalNumberValidatorDirective,
        PositiveDecimalNumberValidatorDirective,
        SafePipe,
        NepaliWordPipe,
        ReplacePipe,
        RoundvaluePipe,
        BooleanConvertPipe,
        DecimalNumberDirective,
        NepaliToEngNumberPipe,
        LoanStatusPipe,
        EngToNepaliNumberPipe
    ],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: CoreModule,
            providers: [
                ...NB_CORE_PROVIDERS,
            ],
        };
    }
}
