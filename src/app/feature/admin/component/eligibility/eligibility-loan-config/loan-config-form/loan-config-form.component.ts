import {Component, Input, OnInit} from '@angular/core';
import {Action} from '../../../../../../@core/Action';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalResponse} from '../../../../../../@core/utils';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loan-config-form',
  templateUrl: './loan-config-form.component.html',
  styleUrls: ['./loan-config-form.component.scss']
})
export class LoanConfigFormComponent implements OnInit {

  @Input() model: LoanConfigFormComponent;
  @Input() action: Action = Action.ADD;

  loanConfig: FormGroup;

  constructor(private activeModal: NgbActiveModal,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    return false;
  }

  buildForm() {
    this.loanConfig = this.formBuilder.group( {
      name: [undefined],
      nature : [undefined],
    });
  }

  onClose() {
      this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}
