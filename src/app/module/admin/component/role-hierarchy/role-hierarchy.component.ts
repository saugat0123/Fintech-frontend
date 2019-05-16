import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {RoleOrders} from '../../modal/roleOrders';

@Component({
    selector: 'app-role-hierarchy',
    templateUrl: './role-hierarchy.component.html',
    styleUrls: ['./role-hierarchy.component.css']
})
export class RoleHierarchyComponent implements OnInit {
    currentApi = 'v1/roleHierarchy';
    roleList;
    activeCount: number;
    inactiveCount: number;
    roleCount: number;
    roleHeirarchy = [];
    spinner = false;
    isDisabled = false;
    tempRoleOrders: RoleOrders[];


    constructor(private dataService: CommonDataService,
                private commonService: CommonService,
    ) {
    }


    ngOnInit() {

        this.commonService.getByAll(this.currentApi).subscribe((response: any) => {
            this.roleList = response.detail;
            console.log(response);
        });

        this.commonService.getByAll('v1/role/get/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.roleCount = response.detail.roles;

        });
    }


    drop(event: CdkDragDrop<RoleOrders[]>) {
        this.roleHeirarchy = [];

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        this.tempRoleOrders = event.container.data;

        for (let x = 0; x < this.tempRoleOrders.length; x++) {
            const roleOrder = x + 1;
            this.tempRoleOrders[x].roleOrder = roleOrder;
            this.roleHeirarchy.push(this.tempRoleOrders[x]);

        }

    }

    save() {
        this.spinner = true;
        this.isDisabled = true;
        this.commonService.saveOrEdit(this.roleHeirarchy, 'v1/roleHierarchy').subscribe((response: any) => {
            this.isDisabled = false;
            this.spinner = false;
            this.roleList = response.detail;

        });
    }

}
