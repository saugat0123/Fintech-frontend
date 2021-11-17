import {Component, OnInit} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';
import {FeatureMenuService} from './FeatureMenuService';
import {NgxSpinnerService} from 'ngx-spinner';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {RoleType} from './admin/modal/roleType';
import {LocalStorageUtil} from '../@core/utils/local-storage-util';

@Component({
  selector: 'app-pages',
  template: `
    <app-base-layout appMouseScrollDisable>
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
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.spinner.show();
      } else if (event instanceof RouteConfigLoadEnd) {
        this.spinner.hide();
      }
    });
  }

  ngOnInit() {
    this.items = this.menuService.getMenus().subscribe(res => {
          this.menus = [...res.detail];
          const storage = LocalStorageUtil.getStorage();
            if (storage.roleType === RoleType[RoleType.COMMITTEE] || (storage.roleType.toLowerCase() === RoleType.APPROVAL.toLowerCase() && storage.roleName.toLowerCase() === 'hsov')) {
            const tempMenu = {
              id: null,
              title: 'Pull',
              link: '/home/loan/pull',
              icon: 'arrowhead-down-outline'
            };
            this.menus.push(tempMenu);
          }
          storage.menus = this.menus;
          LocalStorageUtil.setStorage(storage);
        },
        (error) => {
          console.log(error);
        });


  }


}

