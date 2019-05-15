import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';

@Component({
    selector: 'app-role-hierarchy',
    templateUrl: './role-hierarchy.component.html',
    styleUrls: ['./role-hierarchy.component.css']
})
export class RoleHierarchyComponent implements OnInit {
    currentApi = 'v1/role';
    roleList;
    activeCount: number;
    inactiveCount: number;
    roleCount: number;

    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
    ) {
    }

    ngOnInit() {

        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.roleList = response.detail;
            console.log(response);
        });

        this.commonService.getByAll(this.currentApi + '/get/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.roleCount = response.detail.branches;

        });
    }

    roleChanged(val) {
        alert(val);
        this.roleList.splice(val, 1);
    }

}
