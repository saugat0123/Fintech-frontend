import {Injectable} from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {NbToastStatus} from '@nebular/theme/components/toastr/model';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private service: NbToastrService) {

    }

    public show(alert: Alert) {
        const config = {status: this.getStatus(alert.type), duration: 6000};
        this.service.show(alert.type, alert.message, config);
    }

    private getStatus(type: AlertType): NbToastStatus {
        switch (type) {
            case AlertType.ERROR:
                return NbToastStatus.DANGER;
            case AlertType.SUCCESS:
                return NbToastStatus.SUCCESS;
            case AlertType.WARNING:
                return NbToastStatus.WARNING;
            case AlertType.INFO:
                return NbToastStatus.INFO;
            default:
                return NbToastStatus.DEFAULT;

        }
    }
}
