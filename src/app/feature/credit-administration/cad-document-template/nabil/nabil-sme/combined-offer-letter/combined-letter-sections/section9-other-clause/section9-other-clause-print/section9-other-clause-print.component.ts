import {Component, Input, OnInit} from '@angular/core';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section9-other-clause-print',
  templateUrl: './section9-other-clause-print.component.html',
  styleUrls: ['./section9-other-clause-print.component.scss']
})
export class Section9OtherClausePrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  isNaturalPerson;
  isloanAmountAbove50Crore;
  isworkingCapitalAbove25Crore;
  tempData;
  loanHolderData;
  freeInformation: any;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.freeInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      this.loanHolderData = this.customerApprovedDoc.loanHolder.customerSubType;
    }
    this.isNaturalPerson = this.tempData.smeGlobalForm.borrowerNaturalPerson;
    this.isloanAmountAbove50Crore = this.tempData.smeGlobalForm.loanAmountAbove50Crore;
    this.isworkingCapitalAbove25Crore = this.tempData.smeGlobalForm.workingCapitalAbove25Crore;
  }

}
