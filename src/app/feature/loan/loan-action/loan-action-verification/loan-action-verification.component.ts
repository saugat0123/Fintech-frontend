import {Component, Input, OnInit} from '@angular/core';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {NbDialogRef} from '@nebular/theme';
import {User} from '../../../admin/modal/user';
import {Role} from '../../../admin/modal/role';
import {LoanFormService} from '../../component/loan-form/service/loan-form.service';
import {DocAction} from '../../model/docAction';

@Component({
  selector: 'app-loan-action-verification',
  templateUrl: './loan-action-verification.component.html',
  styleUrls: ['./loan-action-verification.component.scss']
})
export class LoanActionVerificationComponent implements OnInit {
  @Input() toUser: User;
  @Input() toRole: Role;
  @Input() individualCombine;
  @Input() action;
  @Input() isSolUserPresent;
  forwardAction;
  transferAction;
  falseCredential = false;
  falseCredentialMessage = '';

  constructor(
      private http: HttpClient,
      public nbDialogRef: NbDialogRef<LoanActionVerificationComponent>,
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
    this.http.post(ApiConfig.TOKEN, params.toString(), {headers})
    .subscribe(() => {
      this.nbDialogRef.close(true);
    }, error => {
      this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
      this.falseCredential = true;
    });
  }

}
