import {Component, Input, OnInit} from '@angular/core';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CreditMemoFullRoutes} from '../../credit-memo-full-routes';
import {DocAction} from '../../../loan/model/docAction';

@Component({
  selector: 'app-user-verification-modal',
  templateUrl: './user-verification-modal.component.html'
})
export class UserVerificationModalComponent {
  @Input()
  actionData;

  @Input()
  creditMemoService;

  private securityUrl = ApiConfig.TOKEN;
  private headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
  });

  spinner = false;

  constructor(private http: HttpClient,
              private activeModalService: NgbActiveModal,
              private toastService: ToastService,
              private router: Router) {
  }

  verify(formValue) {
    this.spinner = true;
    const data: { email: string, password: string } = formValue.value;
    data.email = localStorage.getItem('username');
    const verificationString = 'grant_type=password&username=' + data.email + '&password=' + data.password;
    this.http.post(this.securityUrl, verificationString, {headers: this.headers})
        .subscribe(
            () => {
              this.creditMemoService.performMemoAction(this.actionData).subscribe(response => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully performed memo action'));
                const savedCreditMemo = response.detail;
                this.navigateTo(savedCreditMemo.currentStage.docAction);
                this.activeModalService.close();
              }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to perform specified action'));
                this.activeModalService.dismiss();
              });
            },
            error => {
              this.toastService.show(new Alert(AlertType.ERROR, error.error.errorDescription));
              this.spinner = false;
            }
        );
  }

  navigateTo(action) {
    switch (action) {
      case DocAction.value(DocAction.FORWARD):
        this.router.navigate([CreditMemoFullRoutes.INBOX]);
        break;
      case DocAction.value(DocAction.BACKWARD):
        this.router.navigate([CreditMemoFullRoutes.INBOX]);
        break;
      case DocAction.value(DocAction.APPROVED):
        this.router.navigate([CreditMemoFullRoutes.APPROVE]);
        break;
      case DocAction.value(DocAction.REJECT):
        this.router.navigate([CreditMemoFullRoutes.REJECT]);
        break;
    }
  }

  onClose() {
    this.activeModalService.dismiss();
  }

}
