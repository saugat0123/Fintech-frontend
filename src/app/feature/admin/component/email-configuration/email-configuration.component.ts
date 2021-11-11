import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {EmailConfigurationService} from './email-configuration.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {EmailConfig} from '../../modal/emailConfig';


@Component({
    selector: 'app-email-configuration',
    templateUrl: './email-configuration.component.html'
})
export class EmailConfigurationComponent implements OnInit {
    loading = false;
    emailConfig: FormGroup;
    emailConfigData: EmailConfig = new EmailConfig();
    notice = false;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private emailConfigService: EmailConfigurationService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.buildForm();
        this.emailConfigService.getAll().subscribe((res: any) => {

            if (res.detail instanceof Array && res.detail.length > 0) {
                this.emailConfigData = res.detail[0];
                this.notice = true;
                this.buildForm();
            }
        }, err => {
            if (err.status === 403) {
                this.router.navigate(['/home/error']);
            }
        });

    }

    buildForm() {
        this.emailConfig = this.formBuilder.group({
            username: [this.emailConfigData.username === undefined ? '' : this.emailConfigData.username, Validators.required],
            password: [this.emailConfigData.password === undefined ? '' : this.emailConfigData.password, Validators.required],
            domain: [this.emailConfigData.domain === undefined ? '' : this.emailConfigData.domain, Validators.required],
            host: [this.emailConfigData.host === undefined ? '' : this.emailConfigData.host, Validators.required],
            port: [this.emailConfigData.port === undefined ? '' : this.emailConfigData.port, Validators.required],
            testMail: [this.emailConfigData.testMail === undefined ? '' : this.emailConfigData.testMail, Validators.email],
            emailType: ['test']
        });
    }

    onSubmit() {

        this.emailConfigService.save(this.emailConfig.value).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Configuration'));
                this.loading = true;
                this.emailConfigService.refreshConfiguration().subscribe(() => {
                    this.emailConfigService.checkConfiguration(this.emailConfig.value).subscribe(() => {
                        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Send Test Email'));
                        this.loading = false;

                    }, err => {
                        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to send Email. Failed due to' +
                            ' credential, mail host server, outgoing port '));
                        this.loading = false;
                    });
                });

            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            }
        );
    }


}
