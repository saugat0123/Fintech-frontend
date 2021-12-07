import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section10-security-documents-print',
  templateUrl: './section10-security-documents-print.component.html',
  styleUrls: ['./section10-security-documents-print.component.scss']
})
export class Section10SecurityDocumentsPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;

  constructor() { }

  ngOnInit() {
  }

}
