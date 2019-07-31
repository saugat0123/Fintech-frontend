import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppConstant} from './@core/utils/appConstant';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
    title = 'sb-frontend';
    menu: [];

    public constructor(private titleService: Title) {
        this.titleService.setTitle(AppConstant.BANKNAME);
    }
}
