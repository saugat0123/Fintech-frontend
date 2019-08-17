import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {Role} from '../../modal/role';
import {RoleFormComponent} from './role-form/role-form.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {BreadcrumbService} from '../../../../@theme/components/breadcrum/breadcrumb.service';
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
    title = 'Role and Permission';

    roleList: Array<Role>;
    rightList: any;
    allPermission: any = [];
    rolePermissionList: any = [];
    compareCheckedPermission: any = [];
    permissions: any = {};
    roleperm: any = [];
    roleId;
    globalMsg: string;
    apiList: any = [];
    spinner = false;
    tempRightList = [];
    permRight = [];
    activeCount: number;
    inactiveCount: number;
    roleCount: number;
    isDisabled = false;

    constructor(
        private commonService: CommonService,
        private service: RolePermissionService,
        private roleService: RoleService,
        private permissionService: PermissionService,
        private router: Router,
        private modalService: NgbModal,
        private alertService: AlertService,
        private breadcrumbService: BreadcrumbService,
        private toastService: ToastService
    ) {
    }

    static loadData(other: RolePermissionComponent) {
        other.roleService.getActiveRoles().subscribe((response: any) => {
            other.roleList = response.detail;
        });

        other.roleService.getStatus().subscribe((response: any) => {
            other.activeCount = response.detail.active;
            other.inactiveCount = response.detail.inactive;
            other.roleCount = response.detail.roles;

        });
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);

        RolePermissionComponent.loadData(this);
        this.service.getRights().subscribe((response: any) => {
            console.log(response.detail);
            this.rightList = response.detail;
        });
    }


    roleChanged(id) {
        this.roleId = id;
        this.roleperm = [];

        this.service.detail(id).subscribe((response: any) => {

            this.rolePermissionList = response.detail;
            // tslint:disable-next-line:no-shadowed-variable
            this.permissionService.getAll().subscribe((response: any) => {
                this.allPermission = response.detail;
                this.checkPermission();
            });

        });

    }

    updateCheckedOptions(permId, events) {
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
        }
        ;


        if (events) {
            this.roleperm.push(this.permissions);
            $('#' + permId).collapse('show');
        } else {

            const element = document.getElementById(permId);
            element.className = 'row collapse';
            $('#' + permId).collapse('hide');
            for (let i = 0; i < this.roleperm.length; i++) {

                if (this.roleperm[i].permission.id.toString() === (permId)) {

                    if (this.roleperm[i].id !== null) {
                        this.roleperm[i].del = true;
                        this.permissions.id = this.roleperm[i].id;
                    } else {
                        this.roleperm.splice(i, 1);
                    }
                }
            }
        }

    }


    onOpen() {
        const modalRef = this.modalService.open(RoleFormComponent, {backdrop: 'static'});

        ModalUtils.resolve(modalRef.result, RolePermissionComponent.loadData, this);
    }

    updateCheckapiOptions(permId, apiId, events, index) {

        for (let i = 0; i < this.roleperm.length; i++) {
            if (this.roleperm[i].permission.id.toString() === permId.toString()) {
                if (this.roleperm[i].id === null) {
                    const apiUrl = {
                        id: apiId,
                        checked: events
                    };
                    this.roleperm[i].apiRights.push(apiUrl);
                }


                for (let j = 0; j < this.roleperm[i].apiRights.length; j++) {
                    if (this.roleperm[i].apiRights[j].id.toString() === apiId) {
                        this.roleperm[i].apiRights[j].checked = events;

                    }

                }
            }
        }
    }

    save() {
        this.isDisabled = true;
        this.spinner = true;

        this.service.save(this.roleperm).subscribe(result => {

                this.roleperm = [];
                this.spinner = false;
                // this.roleChanged(this.roleId);
                this.isDisabled = false;
                this.router.navigateByUrl('/home').then(e => {
                    if (e) {
                        this.router.navigate(['/home/admin/role']);
                    }
                });
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Role & Permission!'));

            },
            error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Role & Permission!'));
            });
    }

    checkPermission() {
        this.roleperm = [];
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

                    this.roleperm.push(this.permissions);

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
