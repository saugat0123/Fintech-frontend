import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {RoleOrders} from '../../modal/roleOrders';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {RoleHierarchyService} from './role-hierarchy.service';
import {RoleService} from '../role-permission/role.service';

@Component({
    selector: 'app-role-hierarchy',
    templateUrl: './role-hierarchy.component.html',
    styleUrls: ['./role-hierarchy.component.scss']
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
    length = false;
    title = 'Role Hierarchy';

    constructor(
        private service: RoleHierarchyService,
        private roleService: RoleService,
        private breadcrumbService: BreadcrumbService
    ) {
    }


    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.service.getAll().subscribe((response: any) => {
            this.roleList = response.detail;
            this.length = this.roleList.length > 0;

        });

        this.roleService.getStatus().subscribe((response: any) => {
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
        this.service.saveAll(this.roleHeirarchy).subscribe((response: any) => {
            this.isDisabled = false;
            this.spinner = false;
            this.roleList = response.detail;

        });
    }

}
