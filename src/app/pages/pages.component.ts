import {Component} from '@angular/core';

@Component({
    selector: 'app-pages',
    template: `
        <app-base-layout>
            <nb-menu [items]="menu"></nb-menu>
            <router-outlet></router-outlet>
        </app-base-layout>
    `,
})
export class PagesComponent {
    menu = [];
}
