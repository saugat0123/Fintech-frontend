import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../shared-service/baseservice/common-baseservice';
import {User} from '../../../module/admin/modal/user';
import {CommonDataService} from '../../../shared-service/baseservice/common-dataService';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    user: User = new User();

    constructor(private commonService: CommonService,
                private dataService: CommonDataService) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/user/authenticated').subscribe(
            (response: any) => {
                this.user = response.detail;
                this.dataService.setUser(response.detail);
                console.log(response.detail);
            }
        );
    }

    logout() {
        localStorage.clear();
    }

}
