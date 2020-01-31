import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dhito-likhat-print',
  templateUrl: './dhito-likhat-print.component.html',
  styleUrls: ['./dhito-likhat-print.component.scss']
})
export class DhitoLikhatPrintComponent implements OnInit {

  @Input()
  letter: any;

  constructor() { }

  ngOnInit() {
  }

}
