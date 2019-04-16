import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';

@Component({
  selector: 'app-msg-modal',
  templateUrl: './msg-modal.component.html',
  styleUrls: ['./msg-modal.component.css']
})
export class MsgModalComponent implements OnInit {

  globalMsg: string;

  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
    this.dataService.currentMsg.subscribe(message => this.globalMsg = message);
  }

}
