import {Component, Input} from '@angular/core';
import {Action} from '../../../../@core/Action';
import {Violation} from '../../../../@core/utils/modal/Violation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CrgGroup} from '../../model/CrgGroup';
import {CrgGroupService} from '../../service/crg-group.service';

@Component({
  selector: 'app-risk-group-delete',
  templateUrl: './risk-group-delete.component.html'
})
export class RiskGroupDeleteComponent {

  @Input()
  model: CrgGroup;

  @Input()
  action: Action = Action.DELETE;

  errors: Array<Violation>;

  modelForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
      private service: CrgGroupService,
      private modalRef: NgbActiveModal,
      private toast: ToastService) {
  }

  ok() {
    if (this.action === Action.DELETE) {
      this.service.delete(this.model.id).subscribe(() => {

            this.modalRef.close(ModalResponse.SUCCESS);

            const alert = new Alert(AlertType.SUCCESS, 'Successfully Removed Risk Group Type');
            this.toast.show(alert);

          }, error => {

            console.log(error);
            const alert = new Alert(AlertType.ERROR, 'Unable to Remove Risk Group Type');
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
