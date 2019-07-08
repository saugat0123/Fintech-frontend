import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse} from '../../../@core/utils';



@Component({
  selector: 'app-common-msg-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent implements OnInit {

  @Input()
  header: string;
  @Input()
  body: string;
  @Input()
  footer: string;

  constructor(
      private modalRef: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  close() {
    this.modalRef.close(ModalResponse.SUCCESS);
  }

}
