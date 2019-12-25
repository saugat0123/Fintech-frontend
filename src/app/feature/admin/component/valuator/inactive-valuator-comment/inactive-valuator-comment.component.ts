import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-inactive-valuator-comment',
    templateUrl: './inactive-valuator-comment.component.html'
})
export class InactiveValuatorCommentComponent {
    @Input()
    data: any = {};

    @Input()
    valuatorService: any;

    inactiveCode = null;
    spinner = false;

    constructor(
        private activeModalService: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    setInactiveComment(comment) {
        this.spinner = true;
        this.data.inactiveComment = comment;
        if (this.inactiveCode !== null) {
            this.data.state = this.inactiveCode;
        }
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
