import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonDataService} from '../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../@core/service/baseservice/common-baseservice';

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
    currentApi;
    navList: any;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        protected router: Router
    ) {
    }

    ngOnInit() {
        this.currentApi = 'v1/nav';
        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.navList = response.detail;
            console.log(this.navList);
        });
    }
}
