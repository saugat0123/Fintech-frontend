import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../feature/admin/component/user/user.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../model/Alert';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';


@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {

    error: string;
    passwordForm: FormGroup;
    changePasswordObject = {
        username: undefined,
        oldPassword: undefined,
        newPassword: undefined
    };

    constructor(
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.passwordForm = this.formBuilder.group({
            oldPassword: [undefined, Validators.required],
            newPassword: [undefined, Validators.required],
            confirmPassword: [undefined, Validators.required]
        });
    }

    ngAfterViewInit() {
    }

  onChangePassword() {
        this.changePasswordObject.username = LocalStorageUtil.getStorage().username;
        this.changePasswordObject.oldPassword = this.passwordForm.get('oldPassword').value;
        this.changePasswordObject.newPassword = this.passwordForm.get('newPassword').value;
        if (this.passwordForm.get('newPassword').value as string === this.passwordForm.get('confirmPassword').value as string) {
            this.userService.updateUserPassword(this.changePasswordObject).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, response.detail));
              this.modalService.dismissAll();
              LocalStorageUtil.clearStorage();
              this.router.navigate(['/login']);
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            });
        } else {
          this.error = 'Confirm password did not match';
        }
    }

    onClose() {
        this.modalService.dismissAll();
    }

}
