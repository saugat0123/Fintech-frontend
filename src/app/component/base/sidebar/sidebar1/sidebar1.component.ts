import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sidebar1',
    templateUrl: './sidebar1.component.html',
    styleUrls: ['./sidebar1.component.css']
})
export class Sidebar1Component implements OnInit {
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
        this.currentApi = 'v1/nav';
        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.navList = response.detail;
        });

    }

}
