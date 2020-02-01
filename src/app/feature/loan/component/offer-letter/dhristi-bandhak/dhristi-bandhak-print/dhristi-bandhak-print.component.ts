import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dhristi-bandhak-print',
  templateUrl: './dhristi-bandhak-print.component.html',
  styleUrls: ['./dhristi-bandhak-print.component.scss']
})
export class DhristiBandhakPrintComponent implements OnInit {
  @Input() loan: any;

  constructor() {
  }

  ngOnInit() {
  }

}
