import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import {ApiConfig} from '../../@core/utils/api/ApiConfig';
import {UserService} from '../../feature/admin/component/user/user.service';
import {User} from '../../feature/admin/modal/user';
import {ProductModeService, ProductUtils} from '../../feature/admin/service/product-mode.service';
import {LocalStorageUtil} from '../../@core/utils/local-storage-util';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

    spinner = false;
    msg;
    private securityUrl = ApiConfig.TOKEN;

    constructor(
        private http: HttpClient,
        private router: Router,
        private userService: UserService,
        private productModeService: ProductModeService,
    ) {
    }

    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        document.body.className = 'hold-transition login-page';
    }

    ngOnDestroy(): void {
        document.body.className = '';
    }

    login(datavalue) {
        this.spinner = true;
        const loginData: { email: string, password: string } = datavalue.value;
        const datas = `grant_type=password&username=${loginData.email}&password=${loginData.password}`;
        this.http.post(this.securityUrl, datas, {headers: this.headers})
        .subscribe(async (loginResponse: any) => {
                const storage = LocalStorageUtil.getStorage();
                storage.at = loginResponse.access_token;
                storage.rt = loginResponse.refresh_token;
                storage.ty = loginResponse.token_type;
                storage.et = loginResponse.expires_in;
                LocalStorageUtil.setStorage(storage);

                await this.userService.getLoggedInUser().toPromise().then((res: any) => {
                  console.log(res);
                  console.log(storage);
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
                this.router.navigate(['/home/dashboard']);
            },
            ((error) => {
                if (error.status === 401) {
                    this.spinner = false;
                    this.msg = 'USER IS INACTIVE PLEASE ACTIVATE USER FIRST';
                } else if (error.status === 400) {
                    this.spinner = false;
                    this.msg = 'INVALID USERNAME OR PASSWORD';
                }
            })
        );
    }

}
