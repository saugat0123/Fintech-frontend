import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-self-declaration-print',
  templateUrl: './self-declaration-print.component.html',
  styleUrls: ['./self-declaration-print.component.scss']
})
export class SelfDeclarationPrintComponent implements OnInit {

  constructor() { }
@Input() printDocForm;
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
  }

}
