import {Component, Input, OnInit} from '@angular/core';

import {NbDialogService, NbMenuService, NbSearchService, NbSidebarService, NbThemeService} from '@nebular/theme';
import {LayoutService} from '../../../@core/utils';
import {UserService} from '../../../@core/service/user.service';
import {filter, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchResultComponent} from './header-form/searchResult.component';
import {ProfileComponent} from '../profile/profile.component';

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
    constructor(private sidebarService: NbSidebarService,
                private menuService: NbMenuService,
                private userService: UserService,
                private layoutService: LayoutService,
                private themeService: NbThemeService,
                private router: Router,
                private searchService: NbSearchService,
                private dialogService: NbDialogService,
                private modalService: NgbModal) {

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


}
