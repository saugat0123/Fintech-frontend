import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section2-loan-type-print',
  templateUrl: './section2-loan-type-print.component.html',
  styleUrls: ['./section2-loan-type-print.component.scss']
})
export class Section2LoanTypePrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;

  constructor() { }

  ngOnInit() {
  }

}
