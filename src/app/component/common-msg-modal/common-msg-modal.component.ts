import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../@core/utils';



@Component({
  selector: 'app-common-msg-modal',
  templateUrl: './common-msg-modal.component.html',
  styleUrls: ['./common-msg-modal.component.scss']
})
export class CommonMsgModalComponent implements OnInit {

  @Input()
  modalHeader: string;
  @Input()
  modalMessage: string;

  constructor(
      private modalRef: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  close() {
    this.modalRef.close(ModalResponse.SUCCESS);
  }

}
