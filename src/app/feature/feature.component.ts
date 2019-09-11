import {Component, OnInit} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';
import {FeatureMenuService} from './FeatureMenuService';
import {NgxSpinnerService} from 'ngx-spinner';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';

@Component({
    selector: 'app-pages',
    template: `
        <app-base-layout>
            <nb-menu [items]="menus"></nb-menu>
            <router-outlet></router-outlet>
        </app-base-layout>
    `,
})
export class FeatureComponent implements OnInit {
    // menu = MENU_ITEMS;
    menus: NbMenuItem[] = [];

    private items;

    constructor(private menuService: FeatureMenuService,
                private spinner: NgxSpinnerService,
                private router: Router) {
    }

    ngOnInit() {
        this.items = this.menuService.getMenus().subscribe(res => {
                this.menus = [...res.detail];
            },
            (error) => {
                console.log(error);
            });

        console.log(this.menus);

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.spinner.show();
            } else if (event instanceof RouteConfigLoadEnd) {
                this.spinner.hide();
            }
        });
    }
}

