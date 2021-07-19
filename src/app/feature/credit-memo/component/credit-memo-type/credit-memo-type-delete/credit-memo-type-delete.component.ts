import {Component, Input, OnInit} from '@angular/core';
import {Violation} from "../../../../../@core/utils/modal/Violation";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalResponse, ToastService} from "../../../../../@core/utils";
import {CreditMemoType} from "../../../model/credit-memo-type";
import {CreditMemoTypeService} from "../../../service/credit-memo-type-service.";
import {Action} from "../../../../../@core/Action";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";

@Component({
  selector: 'app-credit-memo-type-delete',
  templateUrl: './credit-memo-type-delete.component.html',
  styleUrls: ['./credit-memo-type-delete.component.scss']
})
export class CreditMemoTypeDeleteComponent implements OnInit {

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
