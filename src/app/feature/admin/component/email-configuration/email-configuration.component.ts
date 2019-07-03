import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {EmailConfigurationService} from './email-configuration.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';


@Component({
    selector: 'app-email-configuration',
    templateUrl: './email-configuration.component.html'
})
export class EmailConfigurationComponent implements OnInit {

    emailConfig: FormGroup;


    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private emailConfigService: EmailConfigurationService,
        private toastService: ToastService
    ) {
    }

    ngOnInit(): void {
        this.emailConfig = this.formBuilder.group({
            username: [undefined, Validators.required],
            password: [undefined, Validators.required],
            domain: [undefined, Validators.required],
            host: [undefined, Validators.required],
            port: [undefined, Validators.required],
            emailType: ['test']
        });
    }

    onSubmit() {

        this.emailConfigService.save(this.emailConfig.value).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Configuration'));
            }
        );
    }


}
