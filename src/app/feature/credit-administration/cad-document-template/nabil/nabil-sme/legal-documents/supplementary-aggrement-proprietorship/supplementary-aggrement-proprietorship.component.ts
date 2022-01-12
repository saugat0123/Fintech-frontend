import {Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NabilDocumentChecklist } from '../../../../../../admin/modal/nabil-document-checklist.enum';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

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
  freeTextVal;
  initialInfoPrint;
  isInstitutional = false;
  nepData;
  constructor(private formBuilder: FormBuilder,
              ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.loanHolder.customerType === 'INSTITUTION') {
        this.isInstitutional = true;
      }
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.buildForm();
    this.fillForm();
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
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
      this.freeTextVal = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
      // tslint:disable-next-line:max-line-length
      if (!ObjectUtil.isEmpty(this.freeTextVal.section10) && !ObjectUtil.isEmpty(this.freeTextVal.section10[0].additionalGuarantorDetails)) {
        for (let val = 0; val < this.freeTextVal.section10.length - 1; val++) {
          this.addTextArea();
        }
        for (let val = 0; val < this.freeTextVal.section10.length; val++) {
          // tslint:disable-next-line:max-line-length
          this.supplementaryAgreementProprietorship.get(['textAreas', val, 'additionalGuarantorDetails']).patchValue(this.freeTextVal.section10[val].additionalGuarantorDetails);
        }
      }
    }
    this.supplementaryAgreementProprietorship.patchValue({
      firmName: this.cadData.assignedLoan[0].companyInfo.companyName ? this.cadData.assignedLoan[0].companyInfo.companyName : '',
      bankAddress: this.nepData.branch.ct ? this.nepData.branch.ct : '',
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
