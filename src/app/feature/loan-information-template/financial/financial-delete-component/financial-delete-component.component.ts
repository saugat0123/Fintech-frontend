import { Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../../../@core/utils';

@Component({
  selector: 'app-financial-delete-component',
  templateUrl: './financial-delete-component.component.html',
  styleUrls: ['./financial-delete-component.component.scss']
})
export class FinancialDeleteComponentComponent {

  constructor(private activeModal: NgbActiveModal) { }

  action(event) {
    if (event) {
      this.activeModal.close(ModalResponse.SUCCESS);
    } else {
      this.activeModal.close(ModalResponse.CANCEL);
    }
  }

}
