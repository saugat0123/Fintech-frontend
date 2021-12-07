import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section9-other-clause-print',
  templateUrl: './section9-other-clause-print.component.html',
  styleUrls: ['./section9-other-clause-print.component.scss']
})
export class Section9OtherClausePrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;

  constructor() { }

  ngOnInit() {
  }

}
