import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationMasterService} from './notification-master.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';

@Component({
    selector: 'app-notification-master',
    templateUrl: './notification-master.component.html',
    styleUrls: ['./notification-master.component.scss']
})
export class NotificationMasterComponent implements OnInit {
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private notificationMasterService: NotificationMasterService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.buildForm();
    }

    submit() {
        this.notificationMasterService.saveExpiryDate(this.form.get('numOfDays').value).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Saved successfully !'));
        }, () => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save data !'));
        });
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            numOfDays: [45]
        });
    }
}
