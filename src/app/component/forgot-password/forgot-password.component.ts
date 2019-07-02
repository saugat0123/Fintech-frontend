import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../@core/utils/api/ApiConfig';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  error: string;
  resetPasswordForm: FormGroup;
  api = ApiConfig.URL + '/v1/user/forgotPassword';

  constructor(
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private router: Router
  ) {
  }

  get username() {
    return this.resetPasswordForm.get('username');
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      username: [undefined, Validators.required]
    });
  }

  ok() {
    this.http.get(`${this.api}?username=${this.username.value}`).subscribe(
        (response: any) => {
          this.error = null;
          this.router.navigate(['/resentForgotPassword']);
        }, error => {
          this.error = error.error.message;
        }
    );
  }

}
