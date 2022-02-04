import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-newt-worth',
  templateUrl: './newt-worth.component.html',
  styleUrls: ['./newt-worth.component.scss']
})
export class NewtWorthComponent implements OnInit {

  constructor() { }
  @Input() individualJsonData;
  ngOnInit() {
  }

}
