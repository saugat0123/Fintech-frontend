import {Component, OnInit} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';
import {FeatureMenuService} from './FeatureMenuService';

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

    constructor(private menuService: FeatureMenuService) {
    }

    ngOnInit() {
        this.items = this.menuService.getMenus().subscribe(res => {
                this.menus = [...res.detail];
            },
            () => {
            },
            () => console.log('request complete'));
    }
}

