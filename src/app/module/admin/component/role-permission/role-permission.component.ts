import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonPageService} from '../../../../shared-service/baseservice/common-pagination-service';
import {Router} from '@angular/router';
import {Role} from '../../modal/role';

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
    rights: any = [];
    spinner = false;
    tempRightList = [];
    permRight = [];
    activeCount: number;
    inactiveCount: number;
    roleCount: number;


    constructor(
        private dataService: CommonDataService,
        private commonService: CommonService,
        private commonPageService: CommonPageService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);
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
            rights: []
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

    updateCheckRightOptions(permId, rightId, events, index) {
        for (let i = 0; i < this.roleperm.length; i++) {
            if (this.roleperm[i].permission.id.toString() === permId.toString()) {
                this.roleperm[i].rights[index].checked = events;
            }
        }
    }

    save() {
        this.spinner = false;
        console.log(this.roleperm);
        this.commonService.saveOrEdit(this.roleperm, 'v1/roleRightPermission').subscribe(result => {
            this.globalMsg = 'SUCCESSFULLY ADDED ROLE AND PERMISSION';
            this.dataService.getGlobalMsg(this.globalMsg);
            this.dataService.getAlertMsg('true');
            this.roleperm = [];
            this.spinner = false;
            this.roleChanged(this.roleId);
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
                    this.rights = this.rolePermissionList[j].rights;
                    this.tempRightList = this.getCheckRight(this.rights);
                    this.allPermission[i].rights = this.tempRightList;
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
                        rights: this.tempRightList
                    };

                    this.roleperm.push(this.permissions);

                    break;
                }
            }

            if (!isMatch) {
                this.allPermission[i].checked = false;
                this.tempRightList = this.getCheckRight([]);
                this.allPermission[i].rights = this.tempRightList;
                this.compareCheckedPermission.push(this.allPermission[i]);
            }

        }
    }


    getCheckRight(tempRight) {
        this.tempRightList = [];

        for (let x = 0; x < this.rightList.length; x++) {

            let isRightMatch = false;

            for (let y = 0; y < tempRight.length; y++) {

                if (this.rightList[x].id === tempRight[y].id) {
                    isRightMatch = true;
                    tempRight[y].checked = true;
                    this.tempRightList.push(tempRight[y]);
                    break;
                }

            }
            if (!isRightMatch) {
                this.rightList[x].checked = false;
                this.tempRightList.push(this.rightList[x]);
            }


        }

        return this.tempRightList;

    }
}
