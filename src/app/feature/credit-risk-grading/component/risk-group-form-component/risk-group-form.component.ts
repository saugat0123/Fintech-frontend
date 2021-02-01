import {Component, Input, OnInit, ElementRef} from '@angular/core';
import {Action} from '../../../../@core/Action';
import {Violation} from '../../../../@core/utils/modal/Violation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../@core/utils';
import {CustomValidator} from '../../../../@core/validator/custom-validator';
import {Status} from '../../../../@core/Status';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CrgGroup} from '../../model/CrgGroup';
import {CrgGroupService} from '../../service/crg-group.service';

@Component({
    selector: 'app-risk-group-form-component',
    templateUrl: './risk-group-form.component.html',
    styleUrls: ['./risk-group-form.component.scss']
})
export class RiskGroupFormComponent implements OnInit {

    @Input()
    model: CrgGroup;

    @Input()
    action: Action = Action.ADD;

    errors: Array<Violation>;
    submitted: boolean;
    modelForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private service: CrgGroupService,
        private modalRef: NgbActiveModal,
        private toast: ToastService,
        private el: ElementRef
    ) {
    }

    get label() {
        return this.modelForm.get('label');
    }

    get description() {
        return this.modelForm.get('description');
    }

    get weightage() {
        return this.modelForm.get('weightage');
    }

    get status() {
        return this.modelForm.get('status');
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.modelForm = this.formBuilder.group(
            {
                id: [this.model.id === undefined ? '' : this.model.id],
                version: [this.model.version === undefined ? '' : this.model.version],
                label: [this.model.label === undefined ? '' : this.model.label, [Validators.required, CustomValidator.notEmpty]],
                description: [this.model.description === undefined ? '' : this.model.description,
                    [Validators.required, CustomValidator.notEmpty]],
                weightage: [this.model.weightage === undefined ? '' : this.model.weightage,
                    [Validators.required, CustomValidator.notEmpty]],
                status: [this.model.status === undefined ? Status.ACTIVE : this.model.status,
                    (this.action === Action.UPDATE) ? [Validators.required] : []]
            }
        );
    }

    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }

    save() {
        this.submitted = true;
        if (this.modelForm.invalid) {
            this.scrollToFirstInvalidControl();
            return;
        }

        switch (this.action) {
            case Action.ADD:

                this.service.save(this.modelForm.value).subscribe(
                    () => {

                        this.modalRef.close(ModalResponse.SUCCESS);

                        const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Risk Group Type');
                        this.toast.show(alert);

                    }, (err) => {

                        if (err.error.errors) {
                            this.errors = err.error.errors;
                        }

                        const alert = new Alert(AlertType.ERROR, 'Failed to create Risk Group Type');
                        this.toast.show(alert);
                    }
                );
                break;
            case Action.UPDATE:
                this.model.label = this.modelForm.get('label').value;
                this.model.description = this.modelForm.get('description').value;
                this.model.weightage = this.modelForm.get('weightage').value;
                this.model.status = this.modelForm.get('status').value;
                this.service.update(this.model.id, this.modelForm.value)
                    .subscribe(
                        () => {
                            this.toast.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Risk Group Type'));

                            this.modalRef.close(ModalResponse.SUCCESS);

                        }, (err) => {

                            console.log(err);

                            if (err.error.errors) {
                                this.errors = err.error.errors;
                                console.log(this.errors);
                            }

                            this.toast.show(new Alert(AlertType.ERROR, 'Failed to Update Risk Group Type'));
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

}
