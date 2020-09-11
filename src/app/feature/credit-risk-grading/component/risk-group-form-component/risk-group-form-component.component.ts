import {Component, Input, OnInit} from '@angular/core';
import {Action} from '../../../../@core/Action';
import {Violation} from '../../../../@core/utils/modal/Violation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../@core/utils';
import {CustomValidator} from '../../../../@core/validator/custom-validator';
import {Status} from '../../../../@core/Status';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RiskGroupType} from '../../model/RiskGroupType';
import {RiskGradingService} from '../../service/risk-grading.service';

@Component({
  selector: 'app-risk-group-form-component',
  templateUrl: './risk-group-form-component.component.html',
  styleUrls: ['./risk-group-form-component.component.scss']
})
export class RiskGroupFormComponentComponent implements OnInit {

  @Input()
  model: RiskGroupType;

  @Input()
  action: Action = Action.ADD;

  errors: Array<Violation>;

  modelForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
      private service: RiskGradingService,
      private modalRef: NgbActiveModal,
      private toast: ToastService
  ) { }

  ngOnInit() {
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
        this.model.name = this.modelForm.get('name').value;
        this.model.status = this.modelForm.get('status').value;
        this.service.update(this.model.id, this.modelForm.value)
            .subscribe(
                () => {
                  this.toast.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Risk Group Type'));

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

  get name() {
    return this.modelForm.get('name');
  }

  get status() {
    return this.modelForm.get('status');
  }

}
