import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../admin/modal/user';
import {Role} from '../../../admin/modal/role';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NbDialogRef} from '@nebular/theme';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {DocAction} from '../../../loan/model/docAction';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-verification-action-model',
  templateUrl: './verification-action-model.component.html',
  styleUrls: ['./verification-action-model.component.scss']
})
export class VerificationActionModelComponent implements OnInit {
  @Input() toUser: User;
  @Input() toRole: Role;
  @Input() individualCombine;
  @Input() action;
  @Input() isSolUserPresent;
  forwardAction;
  transferAction;
  falseCredential = false;
  falseCredentialMessage = '';
  spinner = false;

  constructor(
      private http: HttpClient,
      public nbDialogRef: NbDialogRef<VerificationActionModelComponent>,
      private customerLoanService: LoanFormService
  ) {
  }

  ngOnInit() {
    this.forwardAction = DocAction.value(DocAction.FORWARD);
    this.transferAction = DocAction.value(DocAction.TRANSFER);
    if (!ObjectUtil.isEmpty(this.individualCombine)) {
      this.individualCombine.actions.forEach(action =>
          this.customerLoanService.detail(action.customerLoanId).subscribe(value => {
            action.loanName = value.detail.loan.name;
          }));
    }
  }

  onLogin(dataValue) {
    const params = new URLSearchParams();
    params.append('username', LocalStorageUtil.getStorage().username);
    params.append('password', dataValue.value.password);
    params.append('grant_type', 'password');
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });

    this.spinner = true;
    this.http.post(ApiConfig.TOKEN, params.toString(), {headers})
        .subscribe(() => {
          this.spinner = false;
          this.nbDialogRef.close(true);
        }, error => {
          this.spinner = false;
          this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? 'Hi kabita' : error.error.errorDescription;
          this.falseCredential = true;
        });
  }

}

