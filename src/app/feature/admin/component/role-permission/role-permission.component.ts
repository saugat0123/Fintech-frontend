import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Role} from '../../modal/role';
import {RoleFormComponent} from './role-form/role-form.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {RolePermissionService} from './role-permission.service';
import {RoleService} from './role.service';
import {PermissionService} from '../../../../@core/service/permission.service';

declare var $;

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnInit {
    roleList: Array<Role>;
    allPermission: any = [];
    rolePermissionList: any = [];
    compareCheckedPermission: any = [];
    permissions: any = {};
    rolePerm: any = [];
    roleId;
    globalMsg: string;
    apiList: any = [];
    spinner = false;
    tempRightList = [];
    activeCount: number;
    inactiveCount: number;
    roleCount: number;
    isDisabled = false;

    constructor(
        private service: RolePermissionService,
        private roleService: RoleService,
        private permissionService: PermissionService,
        private router: Router,
        private modalService: NgbModal,
        private alertService: AlertService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: RolePermissionComponent) {
        other.roleService.getStatus().subscribe((response: any) => {
            other.activeCount = response.detail.active;
            other.inactiveCount = response.detail.inactive;
            other.roleCount = response.detail.roles;
        });

        other.roleService.getActiveRoles().subscribe((response: any) => {
            other.roleList = response.detail;
        });
    }

    ngOnInit() {
        RolePermissionComponent.loadData(this);
    }

    onOpen() {
        const modalRef = this.modalService.open(RoleFormComponent, {backdrop: 'static', size: 'lg'});
        ModalUtils.resolve(modalRef.result, RolePermissionComponent.loadData, this);
    }

    roleChanged(id) {
        this.roleId = id;
        this.rolePerm = [];

        this.service.detail(id).subscribe((response: any) => {
            this.rolePermissionList = response.detail;

            this.permissionService.getAll().subscribe((permissionResponse: any) => {
                this.allPermission = permissionResponse.detail;
                this.checkPermission();
            });
        });
    }

    updateCheckedOptions(permId, isChecked) {
        this.permissions = {
            id: null,
            permission: {
                id: permId
            },
            role: {
                id: this.roleId
            },
            lastModified: new Date(),
            del: false,
            apiRights: []
        };

        const apiSection = document.getElementById(permId);

        if (isChecked) {
            this.rolePerm.push(this.permissions);

            apiSection.classList.remove('hide');
            apiSection.classList.add('show');

        } else {

            apiSection.classList.remove('show');
            apiSection.classList.add('hide');

            for (let i = 0; i < this.rolePerm.length; i++) {

                if (this.rolePerm[i].permission.id.toString() === (permId)) {

                    if (this.rolePerm[i].id !== null) {
                        this.rolePerm[i].del = true;
                        this.permissions.id = this.rolePerm[i].id;
                    } else {
                        this.rolePerm.splice(i, 1);
                    }
                }
            }
        }

    }


    updateCheckapiOptions(permId, apiId, events, index) {

        for (let i = 0; i < this.rolePerm.length; i++) {
            if (this.rolePerm[i].permission.id.toString() === permId.toString()) {
                if (this.rolePerm[i].id === null) {
                    const apiUrl = {
                        id: apiId,
                        checked: events
                    };
                    this.rolePerm[i].apiRights.push(apiUrl);
                }


                for (let j = 0; j < this.rolePerm[i].apiRights.length; j++) {
                    if (this.rolePerm[i].apiRights[j].id.toString() === apiId) {
                        this.rolePerm[i].apiRights[j].checked = events;

                    }

                }
            }
        }
    }

    save() {
        this.isDisabled = true;
        this.spinner = true;

        this.service.save(this.rolePerm).subscribe(result => {

                this.rolePerm = [];
                this.spinner = false;
                // this.roleChanged(this.roleId);
                this.isDisabled = false;
                RolePermissionComponent.loadData(this);
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Role & Permission!'));

            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Role & Permission!'));
            });
    }

    checkPermission() {
        this.rolePerm = [];
        this.compareCheckedPermission = [];

        for (let i = 0; i < this.allPermission.length; i++) {

            let isMatch = false;

            for (let j = 0; j < this.rolePermissionList.length; j++) {

                if (this.allPermission[i].id === this.rolePermissionList[j].permission.id) {
                    isMatch = true;

                    this.allPermission[i].checked = true;
                    this.apiList = this.allPermission[i].apiList;
                    this.tempRightList = this.getCheckApiRight(this.apiList, this.rolePermissionList[j].apiRights);
                    this.allPermission[i].apiRights = this.tempRightList;
                    this.compareCheckedPermission.push(this.allPermission[i]);
                    this.permissions = {
                        id: this.rolePermissionList[j].id,
                        permission: {
                            id: this.rolePermissionList[j].permission.id
                        },
                        role: {
                            id: this.roleId
                        },
                        lastModified: new Date(),
                        del: false,
                        apiRights: this.tempRightList,
                        version: this.rolePermissionList[j].version
                    };

                    this.rolePerm.push(this.permissions);

                    break;
                }
            }

            if (!isMatch) {
                this.allPermission[i].checked = false;
                this.apiList = this.allPermission[i].apiList;
                this.tempRightList = this.getCheckApiRight(this.apiList, []);
                this.allPermission[i].apiRights = this.tempRightList;
                this.compareCheckedPermission.push(this.allPermission[i]);
            }

        }
    }


    getCheckApiRight(tempRight, selectedRight) {
        this.tempRightList = [];

        for (let x = 0; x < tempRight.length; x++) {

            let isRightMatch = false;

            for (let y = 0; y < selectedRight.length; y++) {

                if (selectedRight[y].id === tempRight[x].id) {
                    isRightMatch = true;
                    tempRight[x].checked = true;
                    this.tempRightList.push(tempRight[y]);
                    break;
                }
            }

            if (!isRightMatch) {
                tempRight[x].checked = false;
                this.tempRightList.push(tempRight[x]);
            }
        }

        return this.tempRightList;
    }
}
