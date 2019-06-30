import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import {ApiConfig} from '../../@core/utils/api/ApiConfig';
import {UserService} from '../../feature/admin/component/user/user.service';
import {User} from '../../feature/admin/modal/user';

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
        private userService: UserService
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
        console.log("asdasdasdasdasd");
        this.spinner = true;
        const data: { email: string, password: string } = datavalue.value;
        const datas = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        this.http.post(this.securityUrl, datas, {headers: this.headers})
            .subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                (data: any) => {
                    localStorage.setItem('at', data.access_token);
                    localStorage.setItem('rt', data.refresh_token);
                    localStorage.setItem('ty', data.token_type);
                    localStorage.setItem('et', data.expires_in);

                    this.userService.getLoggedInUser()
                    .subscribe((res: any) => {
                        const user: User = res.detail;
                        localStorage.setItem('userId', (user.id).toString());
                        localStorage.setItem('username', user.username);
                        localStorage.setItem('userFullName', user.name);
                        localStorage.setItem('userProfilePicture', user.profilePicture);
                        localStorage.setItem('roleAccess', user.role.roleAccess);
                        localStorage.setItem('roleName', user.role.roleName);
                        localStorage.setItem('roleType', user.role.roleType);

                        this.router.navigate(['/home/dashboard']);
                    });
                },
                error => {
                    this.spinner = false;
                    this.msg = 'INVALID USERNAME OR PASSWORD';
                }
            );
    }
}
