import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-loan-deed-partnership',
  templateUrl: './loan-deed-partnership.component.html',
  styleUrls: ['./loan-deed-partnership.component.scss']
})
export class LoanDeedPartnershipComponent implements OnInit {
  form: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  nepData;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      nameOfBranch: [undefined],
      actYearInFigure: [undefined],
      nameOfHeadOrSection: [undefined],
      dateOfRegistration: [undefined],
      registrationNumber: [undefined],
      firmName: [undefined],
      grandFatherNameOrFatherInLaw: [undefined],
      fatherNameOrHusbandName: [undefined],
      districtOfProprietor: [undefined],
      municipalityName: [undefined],
      wardNoOfProprietor: [undefined],
      ageOfProprietor: [undefined],
      nameOfProprietor: [undefined],
      grandFatherNameOrFatherInLaw1: [undefined],
      fatherNameOrHusbandName1: [undefined],
      districtOfProprietor1: [undefined],
      municipalityName1: [undefined],
      wardNoOfProprietor1: [undefined],
      ageOfProprietor1: [undefined],
      nameOfProprietor1: [undefined],
      grandFatherNameOrFatherInLaw2: [undefined],
      fatherNameOrHusbandName2: [undefined],
      districtOfProprietor2: [undefined],
      municipalityName2: [undefined],
      wardNoOfProprietor2: [undefined],
      ageOfProprietor2: [undefined],
      nameOfProprietor2: [undefined],
      sanctionLetterIssuedDate: [undefined],
      totalLoanAmount: [undefined],
      totalLoanAmountWords: [undefined],
      yearInFigure: [undefined],
      month: [undefined],
      days: [undefined]
    });
  }

}
