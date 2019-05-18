import {Component, OnInit} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';
import {FeatureMenuService} from './FeatureMenuService';


export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-grid-a-outline',
        link: '/home/dashboard',
        home: true,
    },
    {
        title: 'Admin',
        icon: 'fa fa-sun',
        link: '/home/admin',
        children: [
            {
                title: 'Branch',
                link: '/home/admin/branch',
            },
            {
                title: 'Loan Configuration',
                link: '/home/admin/config',
            },
            {
                title: 'Role & Permission',
                link: '/home/admin/role',
            },
            {
                title: 'Valuator',
                link: '/home/admin/valuator',
            },
            {
                title: 'Sector',
                link: '/home/admin/sector',
            },
            {
                title: 'User',
                link: '/home/admin/user',
            },
            {
                title: 'Approval Limit',
                link: '/home/admin/approvalLimit',
            },
            {
                title: 'Nepse Company',
                link: '/home/admin/nepse',
            },
            {
                title: 'Segment',
                link: '/home/admin/segment',
            },
            {
                title: 'Sub Segment',
                link: '/home/admin/sub-segment',
            },
            {
                title: 'Company',
                link: '/home/admin/company',
            },
            {
                title: 'Sub Sector',
                link: '/home/admin/subSector',
            },
            {
                title: 'Document',
                link: '/home/admin/document',
            },
            {
                title: 'Eligibility',
                children: [
                    {
                        title: 'Question',
                        link: '/home/admin/eligibility/question'
                    },
                    {
                        title: 'New Request',
                        link: '/home/admin/eligibility/new-requests'
                    },
                    {
                        title: 'Eligible',
                        link: '/home/admin/eligibility/eligible'
                    },
                    {
                        title: 'None Eligible',
                        link: '/home/admin/eligibility/non-eligible'
                    }
                ]
            },
        ]
    },
    {
        title: 'Memo',
        icon: 'icon ion-md-browsers',
        link: '/home/memo',
        children: [
            {
                title: 'Compose',
                link: '/home/memo/compose',
            },
            {
                title: 'Under Review',
                link: '/home/memo/underReview',
            },
            {
                title: 'Memo Types',
                link: '/home/memo/type',
            },
        ],
    }
];


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

