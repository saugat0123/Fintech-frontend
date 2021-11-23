import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../model/customerApprovedLoanCadDocumentation";
import {OfferDocument} from "../../../../model/OfferDocument";

@Component({
  selector: 'app-personal-overdraft-without-collateral-template-edit',
  templateUrl: './personal-overdraft-without-collateral-template-edit.component.html',
  styleUrls: ['./personal-overdraft-without-collateral-template-edit.component.scss']
})
export class PersonalOverdraftWithoutCollateralTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;

  constructor() { }

  ngOnInit() {
  }

}
