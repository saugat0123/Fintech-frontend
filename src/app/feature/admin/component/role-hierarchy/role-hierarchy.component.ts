import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {RoleOrders} from '../../modal/roleOrders';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
import {RoleHierarchyService} from './role-hierarchy.service';
import {RoleService} from '../role-permission/role.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ApprovalRoleHierarchyService} from '../../../loan/approval/approval-role-hierarchy.service';
import {ApprovalRoleHierarchy} from '../../../loan/approval/ApprovalRoleHierarchy';

@Component({
    selector: 'app-role-hierarchy',
    templateUrl: './role-hierarchy.component.html',
    styleUrls: ['./role-hierarchy.component.scss']
})
export class RoleHierarchyComponent implements OnInit {
    roleList = [];
    activeCount: number;
    inactiveCount: number;
    roleCount: number;
    roleHeirarchy = [];
    spinner = false;
    isDisabled = false;
    tempRoleOrders: RoleOrders[];
    length = false;
    title = 'Role Hierarchy';
    isOfferLetter = LocalStorageUtil.getStorage().productUtil.OFFER_LETTER;
    resetList = [];
    constructor(
        private service: RoleHierarchyService,
        private roleService: RoleService,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }


    ngOnInit() {
        this.isDisabled = true;
        this.breadcrumbService.notify(this.title);
        this.service.getAllActive().subscribe((response: any) => {
            this.roleList = response.detail;
            this.length = this.roleList.length > 0;
            this.roleHeirarchy = this.roleList;
        });

        this.roleService.getStatus().subscribe((response: any) => {
            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.roleCount = response.detail.roles;

        });
    }


    drop(event: CdkDragDrop<RoleOrders[]>) {
        this.roleHeirarchy = [];
        this.isDisabled = false;
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
            this.roleList = this.roleHeirarchy;
        }
    }

    removeItem(i: number) {
        this.isDisabled = false;
        this.roleHeirarchy.splice(i, 1);
    }

    save() {
        this.spinner = true;
        this.isDisabled = true;
        this.service.saveAll(this.roleHeirarchy).subscribe((response: any) => {
            this.spinner = false;
            this.roleList = response.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Role Order!'));

        });
    }
    reset() {
        this.isDisabled = false;
        this.service.resetRoleHierarchy().subscribe((res: any) => {
           this.roleList = this.roleList.concat(res.detail);
            const roleIds = this.roleList.map(d => d.role.id);
            this.roleList =  this.roleList
                .filter((value, index) => roleIds.indexOf(value.role.id) === index);
            this.roleHeirarchy = this.roleList;
            this.length = this.roleList.length > 0;
        }, error => {
            this.roleList = [];
            this.roleHeirarchy = [];
        });
    }
    checkIncludes(array , element) {
        if (array.includes(element)) {
            return true;
        }
    }

}
