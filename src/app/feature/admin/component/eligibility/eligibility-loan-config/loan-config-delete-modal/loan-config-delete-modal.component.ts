import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Action} from "../../../../../../@core/Action";
import {Violation} from "../../../../../../@core/utils/modal/Violation";
import {EligibilityLoanConfiguration} from "../EligibilityLoanConfiguration";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalResponse, ToastService} from "../../../../../../@core/utils";
import {EligibilityLoanConfigService} from "../eligibility-loan-config-service";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";
import {LoanConfig} from "../../../../modal/loan-config";

@Component({
  selector: 'app-loan-config-delete-modal',
  templateUrl: './loan-config-delete-modal.component.html',
  styleUrls: ['./loan-config-delete-modal.component.scss']
})
export class LoanConfigDeleteModalComponent implements OnInit {

  @Input()
  action: Action = Action.DELETE;
  @Input()
  model : LoanConfig;
  errors: Array<Violation>;

  modelForm: FormGroup
  constructor( private formBuilder: FormBuilder,
               private service: EligibilityLoanConfigService,
               private modalRef: NgbActiveModal,
               private toast: ToastService) { }

  ngOnInit() {
  }

  ok() {
    if (this.action === Action.DELETE) {
      this.service.delete(this.model.id).subscribe(() => {

            this.modalRef.close(ModalResponse.SUCCESS);

            const alert = new Alert(AlertType.SUCCESS, 'Successfully Removed Eligibility Loan');
            this.toast.show(alert);

          }, error => {

            console.log(error);
            const alert = new Alert(AlertType.ERROR, 'Unable to Remove Eligibility Loan');
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
