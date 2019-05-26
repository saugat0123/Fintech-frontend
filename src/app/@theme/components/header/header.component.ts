import {Component, Input, OnInit} from '@angular/core';

import {NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../@core/utils';
import {UserService} from '../../../@core/service/user.service';
import {User} from '../../../feature/admin/modal/user';
import {filter, map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
    selector: 'app-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

    static LOGOUT = 'Log out';
    contextMenuTag = 'user-context-menu';

    @Input() position = 'normal';

    user: User;

    userMenu = [{title: HeaderComponent.LOGOUT}, {title: 'Profile'}];

    constructor(private sidebarService: NbSidebarService,
                private menuService: NbMenuService,
                private userService: UserService,
                private layoutService: LayoutService,
                private themeService: NbThemeService,
                private router: Router) {
    }

    ngOnInit() {
        this.userService.getLoggedInUser()
            .subscribe((res: any) => this.user = res.detail);

        console.log(this.themeService.currentTheme);

        this.menuService.onItemClick().pipe(
            filter(({tag}) => tag === this.contextMenuTag),
            map(({item: {title}}) => title),
            filter((title) => title === HeaderComponent.LOGOUT)
        ).subscribe(() => {
            this.logout();
        });
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    goToHome() {
        this.menuService.navigateHome();
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
