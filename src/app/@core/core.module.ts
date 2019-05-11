import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {throwIfAlreadyLoaded} from './module-import-guard';
import {AnalyticsService, LayoutService, PlayerService, StateService} from './utils';
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
    PlayerService,
    StateService,
];

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        // NbAuthModule,
    ],
    declarations: [],
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
