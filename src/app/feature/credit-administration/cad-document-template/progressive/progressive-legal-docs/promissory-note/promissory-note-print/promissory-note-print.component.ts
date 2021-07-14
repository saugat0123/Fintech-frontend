import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-promissory-note-print',
  templateUrl: './promissory-note-print.component.html',
  styleUrls: ['./promissory-note-print.component.scss']
})
export class PromissoryNotePrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}
