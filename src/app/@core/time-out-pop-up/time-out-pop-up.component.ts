import {Component, OnInit} from '@angular/core';
import {ApiConfig} from '../utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from '../../feature/admin/component/user/user.service';
import {ProductModeService, ProductUtils} from '../../feature/admin/service/product-mode.service';
import {LocalStorageUtil} from '../utils/local-storage-util';
import {User} from '../../feature/admin/modal/user';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../utils';
import {Alert, AlertType} from '../../@theme/model/Alert';

@Component({
    selector: 'app-time-out-pop-up',
    templateUrl: './time-out-pop-up.component.html',
    styleUrls: ['./time-out-pop-up.component.scss']
})
export class TimeOutPopUpComponent implements OnInit {
    spinner = false;
    msg;
    private securityUrl = ApiConfig.TOKEN;

    constructor(
        private http: HttpClient,
        private router: Router,
        private userService: UserService,
        private productModeService: ProductModeService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService,
    ) {
    }

    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });

    ngOnInit(): void {
    }


    onLogin(datavalue) {
        this.spinner = true;
        const userName = LocalStorageUtil.getStorage().username;
        const loginData: { email: string, password: string } = datavalue.value;
        const datas = `grant_type=password&username=${userName}&password=${loginData.password}`;
        this.http.post(this.securityUrl, datas, {headers: this.headers})
            .subscribe(async (loginResponse: any) => {
                    this.activeModal.close();
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Logged In'));
                    this.spinner = false;
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
                        window.location.reload();
                    }, error => {
                        console.error(error);
                    });
                },
                ((error) => {
                    this.spinner = false;
                    if (error.status === 401) {
                        this.msg = 'USER IS INACTIVE PLEASE ACTIVATE USER FIRST';
                    } else if (error.status === 400) {
                        this.msg = 'INVALID PASSWORD';
                    }
                })
            );
    }


}
