import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-promisory-note-institutional-print',
  templateUrl: './promisory-note-institutional-print.component.html',
  styleUrls: ['./promisory-note-institutional-print.component.scss']
})
export class PromisoryNoteInstitutionalPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() individual;
  @Input() cadData;
  @Input() nepaliData;
  branch;
  constructor() { }
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
  }

}
