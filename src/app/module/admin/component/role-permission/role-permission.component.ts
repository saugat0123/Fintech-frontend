import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Role} from '../../modal/role';
import {AddRoleComponent} from './add-role/add-role.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../common/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../common/alert/alert.service';
import {Alert, AlertType} from '../../../../common/alert/Alert';

declare var $;

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    styleUrls: ['./role-permission.component.css']
})
export class RolePermissionComponent implements OnInit {
    title = 'Role and Permission';
    currentApi: string;
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
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private router: Router,
        private modalService: NgbModal,
        private alertService: AlertService,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.currentApi = 'v1/role';
        this.commonService.getByAll(this.currentApi + '/active').subscribe((response: any) => {
            this.roleList = response.detail;
        });
        this.commonService.getByAll('v1/roleRightPermission/rights').subscribe((response: any) => {
            this.rightList = response.detail;
        });

        this.commonService.getByAll(this.currentApi + '/get/statusCount').subscribe((response: any) => {

            this.activeCount = response.detail.active;
            this.inactiveCount = response.detail.inactive;
            this.roleCount = response.detail.branches;

        });
    }


    roleChanged(id) {
        this.roleId = id;
        this.roleperm = [];
        this.commonService.getByAll('v1/roleRightPermission/' + id).subscribe((response: any) => {
            this.rolePermissionList = response.detail;
            // tslint:disable-next-line:no-shadowed-variable
            this.commonService.getByAll('v1/permission').subscribe((response: any) => {
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
        this.modalService.open(AddRoleComponent);
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

        this.commonService.saveOrEdit(this.roleperm, 'v1/roleRightPermission').subscribe(result => {

            this.roleperm = [];
            this.spinner = false;
            // this.roleChanged(this.roleId);
            this.isDisabled = false;
            this.router.navigateByUrl('/home').then(e => {
                if (e) {

                    this.router.navigate(['/home/role']);

                }
            });
            this.alertService.notify(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY ADDED ROLE AND PERMISSION'));

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
