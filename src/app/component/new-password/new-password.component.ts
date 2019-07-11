import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../feature/admin/modal/user';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../@core/utils/api/ApiConfig';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../@core/utils';
import {MessageModalComponent} from '../../@theme/components/message-modal/message-modal.component';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  newPasswordForm: FormGroup;
  user: User = new User();
  api = ApiConfig.URL + '/v1/user/resetPassword';

  constructor(
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private httpClient: HttpClient,
      private router: Router,
      private ngbModal: NgbModal
  ) {
  }

  get newPassword() {
    return this.newPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }

  ngOnInit() {
    this.newPasswordForm = this.formBuilder.group({
      newPassword: [undefined, Validators.required],
      confirmPassword: [undefined, Validators.required]
    });
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.user.username = paramsValue.username;
          this.user.resetPasswordToken = paramsValue.reset;
        });
  }

  ok() {
    this.user.password = this.newPassword.value;
    this.httpClient.post(this.api, this.user).subscribe((response: any) => {
      const modalRef = this.ngbModal.open(MessageModalComponent, {backdrop: 'static'});
      modalRef.componentInstance.header = 'Password Changed Successfully';
      modalRef.componentInstance.body = 'Your password has been changed successfully!';

      modalRef.result.then(
          close => {
            if (close === ModalResponse.SUCCESS) {
              this.router.navigate(['/login']);
            }
          },
          dismiss => {
            console.log(dismiss);
          }
      );
    }, error => {
      console.error(error);
      const modalRef = this.ngbModal.open(MessageModalComponent, {backdrop: 'static'});
      modalRef.componentInstance.header = 'Error';
      modalRef.componentInstance.body = error.error.message;

      modalRef.result.then(
          close => {
            if (close === ModalResponse.SUCCESS) {
              this.router.navigate(['/login']);
            }
          },
          dismiss => {
            console.log(dismiss);
          }
      );
    });
  }

}
