import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import {baseApi} from '../../shared-service/authentication/api-list.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

    private spinner: boolean = false;
    private securityUrl = baseApi.tokenUrl;
    private modalRef: BsModalRef;
    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });

    constructor(
        private http: HttpClient,
        private router: Router,
        private modalService: BsModalService
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        document.body.className = 'hold-transition login-page';
    }

    ngOnDestroy(): void {
        document.body.className = '';
    }

    openLoginModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    loginClick(datavalue) {
        this.spinner = true;
        const data: { email: string, password: string } = datavalue.value;
        const datas = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        this.http.post(this.securityUrl, datas, {headers: this.headers})
            .subscribe(
                (data: any) => {
                    localStorage.setItem('at', data.access_token);
                    localStorage.setItem('rt', data.refresh_token);
                    localStorage.setItem('ty', data.token_type);
                    localStorage.setItem('et', data.expires_in);
                    this.router.navigate(['/home/dashboard']);
                },
                error => {
                }
            );
    }
}
