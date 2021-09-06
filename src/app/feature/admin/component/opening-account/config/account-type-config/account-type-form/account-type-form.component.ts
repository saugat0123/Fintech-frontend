import {Component, Input, OnInit, ElementRef} from '@angular/core';
import {AccountType} from '../../../../../modal/accountType';
import {Action} from '../../../../../../../@core/Action';
import {Violation} from '../../../../../../../@core/utils/modal/Violation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../../@core/utils';
import {CustomValidator} from '../../../../../../../@core/validator/custom-validator';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {AccountTypeService} from '../../../service/account-type.service';

@Component({
  selector: 'app-account-type-form',
  templateUrl: './account-type-form.component.html',
  styleUrls: ['./account-type-form.component.scss']
})
export class AccountTypeFormComponent implements OnInit {
  @Input() model: AccountType;

  @Input() action: Action = Action.ADD;

  errors: Array<Violation>;
  submitted: boolean;
  modelForm: FormGroup;
  spinner = false;

  constructor(
      private formBuilder: FormBuilder,
      private service: AccountTypeService,
      private modalRef: NgbActiveModal,
      private toastService: ToastService,
      private el: ElementRef,
      ) {
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
      this.spinner = true;
      this.submitted = true;
      if (this.modelForm.invalid) {
          this.spinner = false;
          this.scrollToFirstInvalidControl();
          return;
      }

      switch (this.action) {
      case Action.ADD:

        this.service.save(this.modelForm.value).subscribe(
            () => {

              this.modalRef.close(ModalResponse.SUCCESS);
              this.spinner =  false;
              const alert = new Alert(AlertType.SUCCESS, 'Successfully Saved Account Type');
              this.toastService.show(alert);

            }, (err) => {

              if (err.error.errors) {
                this.errors = err.error.errors;
              }
              this.spinner = false;
              const alert = new Alert(AlertType.ERROR, 'Failed to create Account Type');
              this.toastService.show(alert);
            }
        );
        break;
      case Action.UPDATE:
        this.model.name = this.modelForm.get('name').value;
        this.service.update(this.model.id, this.modelForm.value)
        .subscribe(
            () => {
              this.spinner = false;
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Account Type'));

              this.modalRef.close(ModalResponse.SUCCESS);

            }, (err) => {

              console.error(err);

              if (err.error.errors) {
                this.errors = err.error.errors;
              }

              this.spinner = false;
              this.toastService.show(new Alert(AlertType.ERROR, 'Failed to Update Account Type'));
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
