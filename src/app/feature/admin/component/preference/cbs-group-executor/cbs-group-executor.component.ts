import {Component, OnInit} from '@angular/core';
import {CbsGroupService} from '../../../../cbs-group/service/cbs-group.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-cbs-group-executor',
    templateUrl: './cbs-group-executor.component.html',
    styleUrls: ['./cbs-group-executor.component.scss']
})
export class CbsGroupExecutorComponent implements OnInit {
    spinner = false;

    constructor(private cbsService: CbsGroupService, private toastService: ToastService) {
    }

    ngOnInit() {
    }

    submit() {
        this.spinner = true;
        this.cbsService.executeRemote().subscribe((res: any) => {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Executed!'));

            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
                this.spinner = false;
            }
        );
    }

}
