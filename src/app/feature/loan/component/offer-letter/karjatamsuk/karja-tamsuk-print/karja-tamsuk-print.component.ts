import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-karja-tamsuk-print',
  templateUrl: './karja-tamsuk-print.component.html',
  styleUrls: ['./karja-tamsuk-print.component.scss']
})
export class KarjaTamsukPrintComponent implements OnInit {

  @Input()
  letter: any;

  constructor() { }

  ngOnInit() {
  }

}
