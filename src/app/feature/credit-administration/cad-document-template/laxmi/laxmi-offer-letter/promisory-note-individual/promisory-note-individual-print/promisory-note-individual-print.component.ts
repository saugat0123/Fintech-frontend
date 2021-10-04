import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-promisory-note-individual-print',
  templateUrl: './promisory-note-individual-print.component.html',
  styleUrls: ['./promisory-note-individual-print.component.scss']
})
export class PromisoryNoteIndividualPrintComponent implements OnInit {

  constructor() { }
@Input() printDocForm;
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
  }

}
