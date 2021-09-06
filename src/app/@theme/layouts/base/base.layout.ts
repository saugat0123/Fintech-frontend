import {Component, OnDestroy} from '@angular/core';
import {delay, takeWhile, withLatestFrom} from 'rxjs/operators';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';

import {StateService} from '../../../@core/utils';

// TODO: move layouts into the framework
@Component({
  selector: 'app-base-layout',
  styleUrls: ['./base.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'" windowMode>
      <nb-layout-header fixed class="disable-print">
        <app-header [position]="sidebar.id === 'start' ? 'normal': 'inverse'"></app-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar disable-print"
                  tag="menu-sidebar"
                  responsive
                  [end]="sidebar.id === 'end'">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>


      </nb-layout-column>
      <nb-layout-footer fixed>


        <app-footer></app-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
// tslint:disable-next-line:component-class-suffix
export class BaseLayout implements OnDestroy {

  layout: any = {};
  sidebar: any = {};

  private alive = true;

  currentTheme: string;

  constructor(protected stateService: StateService,
              protected menuService: NbMenuService,
              protected themeService: NbThemeService,
              protected bpService: NbMediaBreakpointsService,
              protected sidebarService: NbSidebarService) {
    this.stateService.onLayoutState()
    .pipe(takeWhile(() => this.alive))
    .subscribe((layout: string) => this.layout = layout);

    this.stateService.onSidebarState()
    .pipe(takeWhile(() => this.alive))
    .subscribe((sidebar: string) => {
      this.sidebar = sidebar;
    });

    const isBp = this.bpService.getByName('is');
    this.menuService.onItemSelect()
    .pipe(
        takeWhile(() => this.alive),
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
    )
    .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {

      if (bpTo.width <= isBp.width) {
        this.sidebarService.collapse('menu-sidebar');
      }
    });

    this.themeService.getJsTheme()
    .pipe(takeWhile(() => this.alive))
    .subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
