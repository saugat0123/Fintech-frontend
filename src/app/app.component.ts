import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {environment} from '../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
    title = 'sb-frontend';
    menu: [];

    public constructor(private titleService: Title,
                       public translate: TranslateService) {
        this.titleService.setTitle(environment.client);
        translate.addLangs(['en', 'np']);

        translate.setDefaultLang('en');
    }
}
