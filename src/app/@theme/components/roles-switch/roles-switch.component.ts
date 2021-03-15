import {Component, OnInit} from '@angular/core';
import {User} from '../../../feature/admin/modal/user';
import {UserService} from '../../../@core/service/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Role} from '../../../feature/admin/modal/role';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {ProductModeService, ProductUtils} from '../../../feature/admin/service/product-mode.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-roles-switch',
    templateUrl: './roles-switch.component.html',
    styleUrls: ['./roles-switch.component.scss']
})
export class RolesSwitchComponent implements OnInit {

    user = new User();
    falseCredential;
    falseCredentialMessage;
    roleList = [];
    selectedRole = new Role();
    spinner = false;


    constructor(private userService: UserService, private modalService: NgbModal,
                private http: HttpClient, private router: Router,
                private productModeService: ProductModeService) {
    }

    ngOnInit() {
        this.spinner = true;
        this.userService.getLoggedInUser().subscribe((res: any) => {
            this.user = res.detail;
            this.roleList = this.user.roleList;
            if (!ObjectUtil.isEmpty(this.user.primaryUserId)) {
                this.roleList = [];
                this.userService.detail(this.user.primaryUserId).subscribe((resp: any) => {
                    const secUser = resp.detail;
                    this.roleList = secUser.roleList;
                    this.roleList.push(secUser.role);
                    this.roleList = this.roleList.filter(obj => obj.id !== this.user.role.id);

                });

            }
            this.spinner = false;
        }, error =>   this.spinner = false);
    }

    verifyUserOpen(obj, template) {
        this.selectedRole = obj;
        this.modalService.open(template, {backdrop: false});
    }

    switchRole(dataValue) {
        this.userService.switchUserRole(this.selectedRole).subscribe((res: any) => {
            const userName = res.detail;

            this.onLogin(userName, dataValue.value.password);

        });
    }


    onLogin(username, password) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('grant_type', 'password');
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
        });
        this.spinner = true;
        this.http.post(ApiConfig.TOKEN, params.toString(), {headers})
            .subscribe(async (loginResponse: any) => {
                this.selectedRole = new Role();
                this.modalService.dismissAll();
                LocalStorageUtil.clearStorage();
                const storage = LocalStorageUtil.getStorage();
                storage.at = loginResponse.access_token;
                storage.rt = loginResponse.refresh_token;
                storage.ty = loginResponse.token_type;
                storage.et = loginResponse.expires_in;
                LocalStorageUtil.setStorage(storage);

                await this.userService.getLoggedInUser().toPromise().then((res: any) => {
                    const user: User = res.detail;
                    storage.userId = (user.id).toString();
                    storage.username = user.username;
                    storage.userFullName = user.name;
                    storage.userProfilePicture = user.profilePicture;
                    storage.roleAccess = user.role.roleAccess;
                    storage.roleName = user.role.roleName;
                    storage.roleType = user.role.roleType;
                    storage.roleId = (user.role.id).toString();
                    LocalStorageUtil.setStorage(storage);
                    this.spinner = false;
                }, error => console.error(error));
                await this.productModeService.getProductUtils().subscribe((response: any) => {
                    storage.productUtil = response.detail;
                    LocalStorageUtil.setStorage(storage);
                }, error => {
                    console.error(error);
                });
                await this.productModeService.getBankUtils().subscribe((response: any) => {
                    storage.bankUtil = response.detail;
                    LocalStorageUtil.setStorage(storage);
                }, error => {
                    console.error(error);
                });
                await this.userService.getAuthenticatedUserBranches().toPromise().then((response: any) => {
                    storage.branch = response.detail;
                    LocalStorageUtil.setStorage(storage);
                }, error => console.error(error));
                await this.productModeService.getAll().toPromise().then((response: any) => {
                    const productMode: ProductUtils = response.detail;
                    console.log(response);
                    storage.productMode = JSON.stringify(productMode);
                    LocalStorageUtil.setStorage(storage);
                }, error => {
                    console.error(error);
                });

                location.reload();
                location.assign('/home/dashboard');

            }, error => {
                this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
                this.falseCredential = true;
                this.spinner = false;
            });
    }

    onClose() {
        this.modalService.dismissAll();
    }

}
