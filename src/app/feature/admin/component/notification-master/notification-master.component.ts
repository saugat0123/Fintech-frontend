import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NotificationMaster} from '../../../../@core/model/notification-master';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NotificationMasterType} from '../../../../@core/model/enum/NotificationMasterType';
import {NotificationMasterService} from './notification-master.service';
import {ToastService} from '../../../../@core/utils';
import {Status} from '../../../../@core/Status';

@Component({
  selector: 'app-notification-master',
  templateUrl: './notification-master.component.html',
  styleUrls: ['./notification-master.component.scss']
})
export class NotificationMasterComponent implements OnInit {
  public layout: 'block' | 'grid' = 'block';
  public form: FormGroup;
  public notificationTypeInfo = new Map<NotificationMasterType, NotificationTypeInfo>([
    [NotificationMasterType.INSURANCE_EXPIRY_NOTIFY, {
      particular: 'Insurance expiry notification before',
      default: 30,
      figureType: 'days',
      options: [15, 30, 45, 60]
    }],
    [NotificationMasterType.COMPANY_REGISTRATION_EXPIRY_BEFORE, {
      particular: 'Company registration expiry before',
      default: 30,
      figureType: 'days',
      options: [15, 30, 45, 60]
    }],
      [
        NotificationMasterType.REVIEW_DATE_EXPIRY, {
        particular: 'Review Date expiry before',
        default: 30,
        figureType: 'days',
        options: [15, 30, 45, 60]
      }]
  ]);
  private notificationMasterList: Array<NotificationMaster> = new Array<NotificationMaster>();
  public statusEnum = Status;

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

  public submit(): void {
    const value = this.form.get('masters').value as NotificationMaster[];
    this.notificationMasterService.saveAll(value).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Saved successfully !'));
      this.getNotificationMaster();
    }, () => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save data !'));
    });
  }

  private getNotificationMaster(): void {
    this.notificationMasterService.getAll().subscribe((response: any) => {
      this.notificationMasterList = response.detail;
      this.buildForm();
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load data!'));
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      masters: this.formBuilder.array([])
    });
    this.notificationMasterList.forEach(v => {
      (this.form.get('masters') as FormArray).push(this.formBuilder.group({
        id: [ObjectUtil.setUndefinedIfNull(v.id)],
        notificationKey: [ObjectUtil.setUndefinedIfNull(NotificationMasterType[v.notificationKey])],
        value: [ObjectUtil.setUndefinedIfNull(v.value)],
        status: [ObjectUtil.setUndefinedIfNull(v.status)],
        version: [ObjectUtil.setUndefinedIfNull(v.version)]
      }));
    });
  }

  public updateStatus(id: number, $event: boolean): void {
    const master = new NotificationMaster();
    master.id = id;
    master.status = $event ? Status.ACTIVE : Status.INACTIVE;
    this.notificationMasterService.updateStatus(master).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated!!!'));
      this.getNotificationMaster();
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to update!!!'));
    });
  }
}

export interface NotificationTypeInfo {
  particular: string;
  default: number;
  figureType: string;
  options: number[];
}
