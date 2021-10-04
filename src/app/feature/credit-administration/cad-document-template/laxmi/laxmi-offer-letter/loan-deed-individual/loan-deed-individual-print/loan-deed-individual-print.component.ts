import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-loan-deed-individual-print',
  templateUrl: './loan-deed-individual-print.component.html',
  styleUrls: ['./loan-deed-individual-print.component.scss']
})
export class LoanDeedIndividualPrintComponent implements OnInit {

  constructor() { }
  @Input() printDocForm;
  @Input() nepaliData;
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
    console.log(this.printDocForm.district);
    console.log(this.nepaliData);
  }

}
