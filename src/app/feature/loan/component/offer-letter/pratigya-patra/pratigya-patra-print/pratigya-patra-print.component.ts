import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pratigya-patra-print',
  templateUrl: './pratigya-patra-print.component.html',
  styleUrls: ['./pratigya-patra-print.component.scss']
})
export class PratigyaPatraPrintComponent implements OnInit {
  @Input()
  letter: any;

  constructor() { }

  ngOnInit() {
  }

}
