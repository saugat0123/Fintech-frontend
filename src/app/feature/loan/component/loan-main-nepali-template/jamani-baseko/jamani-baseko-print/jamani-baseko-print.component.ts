import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-jamani-baseko-print',
  templateUrl: './jamani-baseko-print.component.html',
  styleUrls: ['./jamani-baseko-print.component.scss']
})
export class JamaniBasekoPrintComponent implements OnInit {

  @Input() templeteData: any;
  constructor() { }

  ngOnInit() {
  }

}
