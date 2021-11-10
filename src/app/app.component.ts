import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {environment} from '../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {VersionCheckService} from './feature/version-check/version-check.service';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
    `
})

export class AppComponent implements OnInit {
    title = 'sb-frontend';
    menu: [];

    public constructor (private titleService: Title,
                        public translate: TranslateService,
                        private versionCheckService: VersionCheckService) {
        this.titleService.setTitle(environment.client);
        translate.addLangs(['en', 'np']);

        translate.setDefaultLang('en');
    }

    ngOnInit(): void {
        if (environment.production) {
            this.versionCheckService.initVersionCheck(environment.versionCheckUrl);
        }
    }
}
