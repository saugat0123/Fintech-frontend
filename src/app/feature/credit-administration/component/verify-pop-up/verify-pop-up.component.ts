import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastService} from '../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';

@Component({
  selector: 'app-verify-pop-up',
  templateUrl: './verify-pop-up.component.html',
  styleUrls: ['./verify-pop-up.component.scss']
})
export class VerifyPopUpComponent implements OnInit {

  @Output() returnAuthorizedState: EventEmitter<any> = new EventEmitter();
  private securityUrl = ApiConfig.TOKEN;
  private headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
  });

  isAuthorized = false;
  falseCredential = false;
  falseCredentialMessage = '';

  constructor(private toastService: ToastService, private http: HttpClient,
              private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  async onLogin(dataValue) {
    this.isAuthorized = false;
    const data: { email: string, password: string } = dataValue.value;
    data.email = LocalStorageUtil.getStorage().username;
    const requestBody = 'grant_type=password&username=' + data.email + '&password=' + data.password;
    await this.http.post(this.securityUrl, requestBody, {headers: this.headers})
        .toPromise().then((res: any) => {
          this.isAuthorized = true;
        }, error => {
          this.isAuthorized = false;
          this.falseCredential = true;
        });
    this.returnAuthorizedState.emit(this.isAuthorized);
    return this.isAuthorized;
  }

  onClose() {
    this.modalService.dismissAll();
  }

}
