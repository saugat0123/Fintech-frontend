import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../../@core/service/baseservice/common-dataService';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-msg-modal',
  templateUrl: './msg-modal.component.html',
  styleUrls: ['./msg-modal.component.css']
})
export class MsgModalComponent implements OnInit {

  globalMsg: string;

  constructor(private dataService: CommonDataService,
              private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.dataService.currentMsg.subscribe(message => this.globalMsg = message);
  }

  onClose() {
    this.activeModal.dismiss(MsgModalComponent);
  }

}
