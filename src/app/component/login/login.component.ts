import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import {ApiConfig} from '../../@core/utils/api/ApiConfig';
import {UserService} from '../../feature/admin/component/user/user.service';
import {User} from '../../feature/admin/modal/user';
import {ProductMode, ProductModeService} from '../../feature/admin/service/product-mode.service';
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
        const data: { email: string, password: string } = datavalue.value;
        const datas = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        this.http.post(this.securityUrl, datas, {headers: this.headers})
            .subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                (data: any) => {
                    const storage = LocalStorageUtil.getStorage();
                    storage.at = data.access_token;
                    storage.rt = data.refresh_token;
                    storage.ty = data.token_type;
                    storage.et = data.expires_in;
                    LocalStorageUtil.setStorage(storage);

                    this.userService.getLoggedInUser().subscribe((res: any) => {
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
                        this.userService.getAuthenticatedUserBranches().subscribe((response: any) => {
                            storage.branch = response.detail;
                            LocalStorageUtil.setStorage(storage);
                        });
                        this.router.navigate(['/home/dashboard']);
                    });

                    this.productModeService.getAll().subscribe((response: any) => {
                        const productMode: ProductMode[] = response.detail;
                        console.log(response);
                        storage.productMode = JSON.stringify(productMode);
                        LocalStorageUtil.setStorage(storage);
                    }, error => {
                        console.error(error);
                    });

                },
                error => {
                    this.spinner = false;
                    this.msg = 'INVALID USERNAME OR PASSWORD';
                }
            );
    }
}
