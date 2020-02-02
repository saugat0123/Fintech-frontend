import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-jamani-tamsuk-letter-print',
  templateUrl: './jamani-tamsuk-letter-print.component.html',
  styleUrls: ['./jamani-tamsuk-letter-print.component.scss']
})
export class JamaniTamsukLetterPrintComponent implements OnInit {
  @Input()
  letter: any;
  constructor() { }

  ngOnInit() {
  }

}
