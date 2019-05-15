import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

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
            this.roleCount = response.detail.branches;

        });
    }


    drop(event: CdkDragDrop<string[]>) {
        this.roleHeirarchy = [];

            if (event.previousContainer === event.container) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            } else {
                transferArrayItem(event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
            }


        for (let x = 1; x <= event.container.data.length; x++) {
            const roleOrder = x + 1;
            event.container.data[x].roleOrder = roleOrder;

            this.roleHeirarchy.push(event.container.data[x]);

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
