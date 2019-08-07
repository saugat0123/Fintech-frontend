import {Component, Input, OnInit} from '@angular/core';

import {NbMenuService, NbSearchService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../@core/utils';
import {UserService} from '../../../@core/service/user.service';
import {filter, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchResultComponent} from './header-form/searchResult.component';
import {ProfileComponent} from '../profile/profile.component';
import {SocketService} from '../../../@core/service/socket.service';
import {NotificationService} from '../notification/service/notification.service';
import {ChangePasswordComponent} from '../change-password/change-password.component';

@Component({
    selector: 'app-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

    static LOGOUT = 'Log out';
    static PROFILE = 'Profile';
    static CHANGE_PASSWORD = 'Change Password';
    contextMenuTag = 'user-context-menu';

    @Input() position = 'normal';

    userId: number;
    userFullName: string;
    username: string;
    userProfilePicture;
    roleName;

    userMenu = [{title: HeaderComponent.PROFILE}, {title: HeaderComponent.CHANGE_PASSWORD}, {title: HeaderComponent.LOGOUT}, ];

    notificationCount;

    constructor(private sidebarService: NbSidebarService,
                private menuService: NbMenuService,
                private userService: UserService,
                private layoutService: LayoutService,
                private themeService: NbThemeService,
                private router: Router,
                private searchService: NbSearchService,
                private modalService: NgbModal,
                private socketService: SocketService,
                private notificationService: NotificationService) {

        this.searchService.onSearchSubmit()
            .subscribe((searchData: any) => {
                const modalRef = this.modalService.open(SearchResultComponent, {backdrop: 'static'});
                modalRef.componentInstance.searchData = searchData.term;
                modalRef.result.then(
                    close => {
                        if (close) {
                            console.log(close);
                            this.router.navigate(['/home/loan/summary'], {
                                queryParams: {
                                    loanConfigId: close.loanConfigId,
                                    customerId: close.customerId
                                }
                            });
                        }
                    },
                    dismiss => {
                        console.log(dismiss);
                    }
                );
            }, error => console.error(error));
    }

    ngOnInit() {
        this.userId = Number(localStorage.getItem('userId'));
        this.userFullName = localStorage.getItem('userFullName');
        this.userProfilePicture = localStorage.getItem('userProfilePicture');
        this.roleName = localStorage.getItem('roleName');

        this.menuService.onItemClick().pipe(
            filter(({tag}) => tag === this.contextMenuTag),
            map(({item: {title}}) => title),
            filter((title) => title === HeaderComponent.LOGOUT)
        ).subscribe(() => {
            this.logout();
        });
        this.menuService.onItemClick().pipe(
            filter(({tag}) => tag === this.contextMenuTag),
            map(({item: {title}}) => title),
            filter((title) => title === HeaderComponent.PROFILE)
        ).subscribe(() => {
            this.open();
        });
        this.menuService.onItemClick().pipe(
            filter(({tag}) => tag === this.contextMenuTag),
            map(({item: {title}}) => title),
            filter((title) => title === HeaderComponent.CHANGE_PASSWORD)
        ).subscribe(() => {
            this.changePasswordDialog();
        });

        this.menuService.onItemClick().pipe();
        this.setupNotification();
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

    userGuide() {
        this.router.navigate(['/home/admin/user-guide']);
    }

    open() {
        this.modalService.open(ProfileComponent, {size: 'lg'});
    }
    changePasswordDialog() {
        this.modalService.dismissAll();
        this.modalService.open(ChangePasswordComponent, {size: 'lg', backdrop: 'static'});
    }

    setupNotification(): void {
        this.socketService.initializeWebSocketConnection();
        this.notificationService.fetchNotifications();
        this.notificationService.notificationCount.subscribe((value => this.notificationCount = value));
    }

}
