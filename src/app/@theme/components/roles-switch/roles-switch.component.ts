import {Component, OnInit} from '@angular/core';
import {User} from '../../../feature/admin/modal/user';
import {UserService} from '../../../@core/service/user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Role} from '../../../feature/admin/modal/role';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';

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

    constructor(private userService: UserService, private modalService: NgbModal,
                private http: HttpClient,) {
    }

    ngOnInit() {
        this.userService.getLoggedInUser().subscribe((res: any) => {
            this.user = res.detail;
            this.roleList = this.user.roleList;
            if (!ObjectUtil.isEmpty(this.user.primaryUserId)) {
                this.roleList = [];
                this.userService.detail(this.user.primaryUserId).subscribe((resp: any) => {
                    this.user = resp.detail;

                });

            }
        });
    }

    verifyUserOpen(obj, template) {
        this.selectedRole = obj;
        this.modalService.open(template);
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
        this.http.post(ApiConfig.TOKEN, params.toString(), {headers})
            .subscribe(() => {
                this.selectedRole = new Role();
                this.modalService.dismissAll();
            }, error => {
                this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
                this.falseCredential = true;
            });
    }

}
