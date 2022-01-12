import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NabilDocumentChecklist } from '../../../../../../admin/modal/nabil-document-checklist.enum';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-supplementary-aggrement-proprietorship',
  templateUrl: './supplementary-aggrement-proprietorship.component.html',
  styleUrls: ['./supplementary-aggrement-proprietorship.component.scss']
})
export class SupplementaryAggrementProprietorshipComponent implements OnInit {
  supplementaryAgreementProprietorship: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  offerLetterConst = NabilDocumentChecklist;
  freeTextVal
  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.buildForm();
    console.log('cadData', this.cadData);
    
  }
  buildForm() {
    this.supplementaryAgreementProprietorship = this.formBuilder.group({
      date: [undefined],
      bankAddress: [undefined],
      firmName: [undefined],
      dateOfHypothecation: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      dateOfTrustReceipt: [undefined],
      letterOfCreditNo: [undefined],
      letterOfCreditIssuedDate: [undefined],
      totalLoanAmountInFigure: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      witnessWardNumber: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],
      textAreas: this.formBuilder.array([]),
    });
  }
  addTextArea() {
    (this.supplementaryAgreementProprietorship.get('textAreas') as FormArray).push(
        this.formBuilder.group({
          additionalGuarantorDetails: [undefined]
    }));
  }
  removeAtIndex(i: number) {
    (this.supplementaryAgreementProprietorship.get('textAreas') as FormArray).removeAt(i);
  }
}
