import {Component, Input, OnInit} from '@angular/core';

import {NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../@core/utils';
import {UserService} from '../../../@core/service/user.service';
import {User} from '../../../module/admin/modal/user';

@Component({
    selector: 'app-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

    @Input() position = 'normal';

    user: User;

    userMenu = [{title: 'Profile'}, {title: 'Log out'}];

    constructor(private sidebarService: NbSidebarService,
                private menuService: NbMenuService,
                private userService: UserService,
                private layoutService: LayoutService,
                private themeService: NbThemeService) {
    }

    ngOnInit() {
        this.userService.getLoggedInUser()
            .subscribe((res: any) => this.user = res.detail);

        console.log(this.themeService.currentTheme);
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    goToHome() {
        this.menuService.navigateHome();
    }
}
