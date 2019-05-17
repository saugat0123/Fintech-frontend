import {Component, OnInit} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {CommonDataService} from '../../../@core/service/baseservice/common-dataService';

@Component({
  selector: 'app-msg-alert',
  templateUrl: './msg-alert.component.html',
  styleUrls: ['./msg-alert.component.css']
})
export class MsgAlertComponent implements OnInit {
  count = 0;


  globalMsg: string;
  flag: string;


  constructor(private dataService: CommonDataService) {
  }

  ngOnInit() {

    this.dataService.currentMsg.subscribe(message => this.globalMsg = message);
    this.dataService.currentAlertFlag.subscribe(flagStatus => this.flag = flagStatus);
    this.dataService.currentMsg.pipe(
        debounceTime(2000)
    ).subscribe(() => this.globalMsg = null);

  }

  closeAlert() {
    this.globalMsg = null;

  }

}
