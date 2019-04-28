import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {User} from '../../../../module/admin/modal/user';

@Component({
    selector: 'app-sidebar1',
    templateUrl: './sidebar1.component.html',
    styleUrls: ['./sidebar1.component.css']
})
export class Sidebar1Component implements OnInit {
    user: User = new User();
    currentApi;
    navList: any;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/user/authenticated').subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
        this.currentApi = 'v1/nav';
        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.navList = response.detail;
        });

    }

}
