import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Valuator} from '../../../modal/valuator';

@Component({
    selector: 'app-inactive-valuator-comment',
    templateUrl: './inactive-valuator-comment.component.html'
})
export class InactiveValuatorCommentComponent {
    @Input()
    data: Valuator = new Valuator();

    @Input()
    valuatorService: any;
    spinner = false;

    constructor(
        private activeModalService: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    setInactiveComment() {
        this.spinner = true;
        this.valuatorService.save(this.data).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED STATUS'));
                this.activeModalService.close();
            }, error => {
                this.activeModalService.dismiss();
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            }
        );
    }

    closeModal() {
        this.activeModalService.dismiss();
    }
}
