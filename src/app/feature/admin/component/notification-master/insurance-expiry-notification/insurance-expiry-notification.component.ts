import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationMasterService} from '../notification-master.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NotificationMaster} from '../../../../../@core/model/notification-master';
import {NotificationMasterType} from '../../../../../@core/model/enum/NotificationMasterType';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-insurance-expiry-notification',
  templateUrl: './insurance-expiry-notification.component.html',
  styleUrls: ['./insurance-expiry-notification.component.scss']
})
export class InsuranceExpiryNotificationComponent implements OnInit {
  form: FormGroup;
  model: NotificationMaster = new NotificationMaster();
  search = {
    notificationKey: NotificationMasterType[NotificationMasterType.INSURANCE_EXPIRY_NOTIFY]
  };
  default = 45;

  constructor(
      private formBuilder: FormBuilder,
      private notificationMasterService: NotificationMasterService,
      private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getNotificationMaster();
  }

  submit() {
    this.notificationMasterService.save(this.form.value as NotificationMaster)
    .subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Saved successfully !'));
      this.getNotificationMaster();
    }, () => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save data !'));
    });
  }

  private getNotificationMaster(): void {
    this.notificationMasterService.getOneWithSearch(this.search).subscribe((response: any) => {
      this.model = response.detail;
      this.buildForm();
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load data!'));
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [ObjectUtil.setUndefinedIfNull(this.model.id)],
      notificationKey: [ObjectUtil.setUndefinedIfNull(NotificationMasterType[this.model.notificationKey])],
      value: [ObjectUtil.setInputOrElseNext(this.model.value, this.default)],
      version: [ObjectUtil.setUndefinedIfNull(this.model.version)]
    });
  }

}
