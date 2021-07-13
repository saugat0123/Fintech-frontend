import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-mrtg-deed-individual-same-print',
  templateUrl: './mrtg-deed-individual-same-print.component.html',
  styleUrls: ['./mrtg-deed-individual-same-print.component.scss']
})
export class MrtgDeedIndividualSamePrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}
