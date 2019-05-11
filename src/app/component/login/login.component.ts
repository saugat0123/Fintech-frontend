import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import {baseApi} from '../../shared-service/authentication/api-list.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

    spinner = false;
    msg;
    private securityUrl = baseApi.tokenUrl;

    constructor(
        private http: HttpClient,
        private router: Router,
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
                    localStorage.setItem('at', data.access_token);
                    localStorage.setItem('rt', data.refresh_token);
                    localStorage.setItem('ty', data.token_type);
                    localStorage.setItem('et', data.expires_in);
                    this.router.navigate(['/home/dashboard']);
                },
                error => {
                    this.spinner = false;
                    this.msg = 'INVALID USERNAME OR PASSWORD';
                }
            );
    }
}
