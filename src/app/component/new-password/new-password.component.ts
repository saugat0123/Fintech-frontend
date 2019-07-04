import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../feature/admin/modal/user';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {ToastService} from '../../@core/utils';

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
      private toastService: ToastService,
      private router: Router
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
      // this.toastService.show(new Alert(AlertType.SUCCESS, 'Password Updated Successfully'));
      this.router.navigate(['/login']);
    }, error => {
      console.error(error);
      // this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

}
