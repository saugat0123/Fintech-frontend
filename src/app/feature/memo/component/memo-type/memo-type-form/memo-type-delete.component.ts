import {MemoType} from '../../../model/memoType';
import {MemoTypeService} from '../../../service/memo-type.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Action} from '../../../../../@core/Action';
import {Violation} from '../../../../../@core/utils/modal/Violation';


@Component({
    templateUrl: './memo-type-delete.component.html',
    selector: 'app-memo-type-delete',
})
export class MemoTypeDeleteComponent {

    @Input()
    model: MemoType;

    @Input()
    action: Action = Action.DELETE;

    errors: Array<Violation>;

    modelForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private service: MemoTypeService,
        private modalRef: NgbActiveModal,
        private toast: ToastService) {
    }

    ok() {
        if (this.action === Action.DELETE) {
            this.service.delete(this.model.id).subscribe(() => {

                    this.modalRef.close(ModalResponse.SUCCESS);

                    const alert = new Alert(AlertType.SUCCESS, 'Successfully Removed Memo Type');
                    this.toast.show(alert);

                }, error => {

                    console.log(error);
                    const alert = new Alert(AlertType.ERROR, 'Unable to Remove Memo Type');
                    this.toast.show(alert);
                }
            );
        } else {
            console.log(`Invalid Action ${this.action}`);
        }
    }

    close() {
        this.modalRef.dismiss();
    }

    get name() {
        return this.modelForm.get('name');
    }

    get status() {
        return this.modelForm.get('status');
    }
}
