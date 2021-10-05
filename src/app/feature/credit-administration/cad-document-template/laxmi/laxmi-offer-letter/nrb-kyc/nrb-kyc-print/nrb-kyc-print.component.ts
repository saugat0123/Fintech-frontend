import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-nrb-kyc-print',
  templateUrl: './nrb-kyc-print.component.html',
  styleUrls: ['./nrb-kyc-print.component.scss']
})
export class NrbKycPrintComponent implements OnInit {

  constructor() { }
@Input() printDocForm;
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
    console.log(this.printDocForm);
  }

}
