import {Component, Input, OnInit} from '@angular/core';
import {Alert, AlertType} from '../../model/Alert';
import {ToastService} from '../../../@core/utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Status} from '../../../@core/Status';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent {
    spinner = false;

    @Input()
    data: any = {};

    @Input()
    service: any;

    constructor(
        private activeModalService: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    deleteRecord() {
        this.spinner = true;
        this.service.save(this.data).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'DELETED SUCCESSFULLY'));
                this.activeModalService.close();
            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, 'DELETE UNSUCCESSFUL'));
                this.activeModalService.dismiss();
            }
        );
    }

    closeModal() {
      this.activeModalService.dismiss();
    }
}
