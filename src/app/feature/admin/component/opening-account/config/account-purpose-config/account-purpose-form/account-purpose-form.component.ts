import {Component, Input, OnInit} from '@angular/core';
import {AccountPurpose} from '../../../../../modal/accountPurpose';
import {Action} from '../../../../../../../@core/Action';
import {Violation} from '../../../../../../../@core/utils/modal/Violation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountPurposeService} from '../../../service/account-purpose.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../../@core/utils';
import {CustomValidator} from '../../../../../../../@core/validator/custom-validator';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-account-purpose-form',
  templateUrl: './account-purpose-form.component.html',
  styleUrls: ['./account-purpose-form.component.scss']
})
export class AccountPurposeFormComponent implements OnInit {

  @Input() model: AccountPurpose;

  @Input() action: Action = Action.ADD;

  errors: Array<Violation>;

  modelForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
      private service: AccountPurposeService,
      private modalRef: NgbActiveModal,
      private toastService: ToastService) {
  }

  get name() {
    return this.modelForm.get('name');
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.modelForm = this.formBuilder.group(
        {
          id: [this.model.id === undefined ? '' : this.model.id],
          name: [this.model.name === undefined ? '' : this.model.name, [Validators.required, CustomValidator.notEmpty]],
        }
    );
  }

  save() {
    switch (this.action) {
      case Action.ADD:

        this.service.save(this.modelForm.value).subscribe(
            () => {

              this.modalRef.close(ModalResponse.SUCCESS);
              const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Account Purpose');
              this.toastService.show(alert);

            }, (err) => {

              if (err.error.errors) {
                this.errors = err.error.errors;
              }

              const alert = new Alert(AlertType.ERROR, 'Failed to create Account Purpose');
              this.toastService.show(alert);
            }
        );
        break;
      case Action.UPDATE:
        this.model.name = this.modelForm.get('name').value;
        this.service.update(this.model.id, this.modelForm.value)
        .subscribe(
            () => {
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Account Purpose'));

              this.modalRef.close(ModalResponse.SUCCESS);

            }, (err) => {

              console.error(err);

              if (err.error.errors) {
                this.errors = err.error.errors;
              }

              this.toastService.show(new Alert(AlertType.ERROR, 'Failed to Update Account Purpose'));
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
