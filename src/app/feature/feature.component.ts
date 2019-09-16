import {Component, OnInit} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';
import {FeatureMenuService} from './FeatureMenuService';
import {NgxSpinnerService} from 'ngx-spinner';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {RoleType} from './admin/modal/roleType';

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

                if (localStorage.getItem('roleType') === RoleType[RoleType.COMMITTEE]) {
                    const tempMenu = {
                        id: null,
                        title: 'Pull Document',
                        link: '/home/loan/pull',
                        icon: 'fas fa-angle-double-down'
                    };
                    this.menus.push(tempMenu);
                }
            },
            (error) => {
                console.log(error);
            });

        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.spinner.show();
            } else if (event instanceof RouteConfigLoadEnd) {
                this.spinner.hide();
            }
        });
    }
}

