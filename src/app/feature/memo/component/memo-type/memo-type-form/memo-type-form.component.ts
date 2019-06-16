import {MemoType} from '../../../model/memoType';
import {MemoTypeService} from '../../../service/memo-type.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Action} from '../../../../../@core/Action';
import {Status} from '../../../../../@core/Status';
import {CustomValidator} from '../../../../../@core/validator/custom-validator';
import {Violation} from '../../../../../@core/utils/modal/Violation';


@Component({
    templateUrl: './memo-type-form.component.html',
    selector: 'app-memo-type-form',
})
export class MemoTypeFormComponent implements OnInit {

    @Input()
    model: MemoType;

    @Input()
    action: Action = Action.ADD;

    errors: Array<Violation>;

    modelForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private service: MemoTypeService,
        private modalRef: NgbActiveModal,
        private toast: ToastService) {
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm() {
        this.modelForm = this.formBuilder.group(
            {
                id: [this.model.id === undefined ? '' : this.model.id],
                name: [this.model.name === undefined ? '' : this.model.name, [Validators.required, CustomValidator.notEmpty]],
                status: [this.model.status === undefined ? Status.ACTIVE : this.model.status,
                    (this.action === Action.UPDATE) ? [Validators.required] : []]
            }
        );
    }

    save() {
        switch (this.action) {
            case Action.ADD:

                this.service.save(this.modelForm.value).subscribe(
                    () => {

                        this.modalRef.close(ModalResponse.SUCCESS);

                        const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Memo Type');
                        this.toast.show(alert);

                    }, (err) => {

                        if (err.error.errors) {
                            this.errors = err.error.errors;
                        }

                        const alert = new Alert(AlertType.ERROR, 'Failed to create Memo Type');
                        this.toast.show(alert);
                    }
                );
                break;
            case Action.UPDATE:
                this.model.name = this.modelForm.get('name').value;
                this.model.status = this.modelForm.get('status').value;
                this.service.update(this.model.id, this.modelForm.value)
                    .subscribe(
                        () => {
                            this.toast.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Memo Type'));

                            this.modalRef.close(ModalResponse.SUCCESS);

                        }, (err) => {

                            console.log(err);

                            if (err.error.errors) {
                                this.errors = err.error.errors;
                                console.log(this.errors);
                            }

                            this.toast.show(new Alert(AlertType.ERROR, 'Failed to Update Memo Type'));
                        }
                    );
                break;
            default:
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
