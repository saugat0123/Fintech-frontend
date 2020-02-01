import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-kararnama-print',
  templateUrl: './kararnama-print.component.html',
  styleUrls: ['./kararnama-print.component.scss']
})
export class KararnamaPrintComponent implements OnInit {
  @Input()
  letter: any;
  constructor() { }

  ngOnInit() {
  }

}
