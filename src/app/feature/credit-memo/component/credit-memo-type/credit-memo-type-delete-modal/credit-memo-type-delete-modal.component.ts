import {Component, Input, OnInit} from '@angular/core';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Action} from '../../../../../@core/Action';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CreditMemoTypeService} from '../../../service/credit-memo-type';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Violation} from '../../../../../@core/utils/modal/Violation';
import {CreditMemoType} from '../../../model/credit-memo-type';

@Component({
  selector: 'app-credit-memo-type-delete-modal',
  templateUrl: './credit-memo-type-delete-modal.component.html'
})
export class CreditMemoTypeDeleteModalComponent implements OnInit {
  @Input()
  model: CreditMemoType;

  @Input()
  action: Action = Action.DELETE;

  errors: Array<Violation>;

  modelForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
      private service: CreditMemoTypeService,
      private modalRef: NgbActiveModal,
      private toast: ToastService
  ) {
  }

  get name() {
    return this.modelForm.get('name');
  }

  get status() {
    return this.modelForm.get('status');
  }

  ngOnInit() {
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
}
