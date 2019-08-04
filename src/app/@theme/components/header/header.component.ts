import {Component, Input, OnInit} from '@angular/core';

import {NbDialogService, NbMenuService, NbSearchService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {LayoutService, ToastService} from '../../../@core/utils';
import {UserService} from '../../../@core/service/user.service';
import {filter, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchResultComponent} from './header-form/searchResult.component';
import {ProfileComponent} from '../profile/profile.component';
import {NotificationComponent} from '../../../feature/loan/component/notification/notification.component';
import {WebNotificationService} from '../../../feature/loan/component/notification/service/web-notification.service';
import {NotificationService} from '../../../feature/loan/component/notification/service/notification.service';
import {Status} from '../../../@core/Status';
import {Message} from '../../../feature/loan/component/notification/model/message';
import {Alert, AlertType} from '../../model/Alert';

@Component({
    selector: 'app-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

    static LOGOUT = 'Log out';
    static PROFILE = 'Profile';
    contextMenuTag = 'user-context-menu';

    @Input() position = 'normal';

    userFullName: string;
    username: string;
    userProfilePicture;
    roleName;

    userMenu = [{title: HeaderComponent.PROFILE}, {title: HeaderComponent.LOGOUT}];

    notificationCount: number;
    notifications: Array<Message> = new Array<Message>();
    notificationSearchObject = {
        toId: localStorage.getItem('userId'),
        status: Status.ACTIVE
    };

    constructor(private sidebarService: NbSidebarService,
                private menuService: NbMenuService,
                private userService: UserService,
                private layoutService: LayoutService,
                private themeService: NbThemeService,
                private router: Router,
                private searchService: NbSearchService,
                private notificationComponent: NotificationComponent,
                private modalService: NgbModal,
                private dialogService: NbDialogService,
                private dataService: WebNotificationService,
                private notificationService: NotificationService,
                private toastService: ToastService) {

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

        this.menuService.onItemClick().pipe();
        this.dataService.currentNotification.subscribe(message => this.notificationCount = message);
        this.dataService.currentNotificationMessage.subscribe(message => {
            if (message) {
                this.notifications = message;
            }
        });

        this.getSavedNotifications();
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

    clearRealtimeCount() {
        this.notificationCount = 0;
        console.log(this.notifications);
    }

    summaryClick(message: Message
    ) {
        message.status = Status.INACTIVE;
        this.notificationService.save(message).subscribe((response: any) => {
            this.router.navigateByUrl('/home/dashboard/', {skipLocationChange: true}).then(e => {
                if (e) {
                    this.router.navigate(['/home/loan/summary'], {
                        queryParams: {
                            loanConfigId: message.loanConfigId,
                            customerId: message.customerId
                        }
                    });
                }
            });
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Error updating notification status'));
        });
    }

    getSavedNotifications() {
        this.notificationService.getPaginationWithSearchObject(this.notificationSearchObject, 1, 10).subscribe((response: any) => {
            const mes: Array<Message> = response.detail.content;
            console.log(response);
            this.notifications.push(...mes);

        }, error => {
            console.error(error);
        });
    }

}
