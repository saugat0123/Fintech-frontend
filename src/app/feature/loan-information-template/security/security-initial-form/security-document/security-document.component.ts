import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-document',
  templateUrl: './security-document.component.html',
  styleUrls: ['./security-document.component.scss']
})
export class SecurityDocumentComponent implements OnInit {
  securityDocumentForm: FormGroup;
  @Input() formValue: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formValue)) {
        const data = JSON.parse(this.formValue);
        this.securityDocumentForm.patchValue(data);
    }
  }

  private buildForm(): FormGroup {
    return this.securityDocumentForm = this.formBuilder.group({
      hypoLandBuilding: ['Hypothecation over entire fixed assets of the company except land and building'],
      exHypoLandBuilding: [undefined],
      prHypoLandBuilding: [undefined],
      chHypoLandBuilding: [undefined],
      hypoStock: ['Hypothecation of stocks of the company'],
      exHypoStock: [undefined],
      prHypoStock: [undefined],
      chHypoStock: [undefined],
      assignment: ['Assignment over current account, bills and receivables of the company'],
      exAssignment: [undefined],
      prAssignment: [undefined],
      chAssignment: [undefined],
      cashMargin: [undefined],
      accountHolder: [undefined],
      amountHeld: [undefined],
      maturityDate: [undefined],
      exCashMargin: [undefined],
      prCashMargin: [undefined],
      chCashMargin: [undefined],
      vehicleRegistration: [undefined],
      type: [undefined],
      manufacture: [undefined],
      model: [undefined],
      manufatureYear: [undefined],
      registration: [undefined],
      engineNo: [undefined],
      chasisNo: [undefined],
      purchasePrice: [undefined],
      dateOfQuotation: [undefined],
      exRegistration: [undefined],
      prRegistration: [undefined],
      chRegistration: [undefined],
      nameOfShareholder: [undefined],
      nameOfCompany: [undefined],
      typeOfShare: [undefined],
      typeOcurrentValuefShare: [undefined],
      exPledgeOfShare: [undefined],
      prPledgeOfShare: [undefined],
      chPledgeOfShare: [undefined],
      securedTransaction: ['Secured Transaction Registry'],
      exSecureTransaction: [undefined],
      prSecureTransaction: [undefined],
      chSecureTransaction: [undefined],
      currentValue: [undefined],
      loanDeed: ['Loan Deed'],
      exLoanDeed: [undefined],
      prLoanDeed: [undefined],
      chLoanDeed: [undefined],
      promissoryNote: ['Promissory Note'],
      exPromissoryNote: [undefined],
      prPromissoryNote: [undefined],
      chPromissoryNote: [undefined],
      letterOfSetOff: ['Letter of Set-off'],
      exLetterOfSetOff: [undefined],
      prLetterOfSetOff: [undefined],
      chLetterOfSetOff: [undefined],
      consentLetter: ['Sahamati (consent letter) of collateral owner’s legal heirs/family members'],
      exConsentLetter: [undefined],
      prConsentLetter: [undefined],
      chConsentLetter: [undefined],
      blacklistingLetter: ['Blacklisting Letter'],
      exBlacklistingLetter: [undefined],
      prBlacklistingLetter: [undefined],
      chBlacklistingLetter: [undefined],
      latterOfContinuity: ['Letter of Continuity'],
      exLatterOfContinuity: [undefined],
      prLatterOfContinuity: [undefined],
      chLatterOfContinuity: [undefined],
      hirePurchaseDeed: ['Hire Purchase Deed'],
      exHirePurchaseDeed: [undefined],
      prHirePurchaseDeed: [undefined],
      chHirePurchaseDeed: [undefined],
      offerLetter: ['Offer Letter'],
      exOfferLetter: [undefined],
      prOfferLetter: [undefined],
      chOfferLetter: [undefined],
      exTotal: [undefined],
      prTotal: [undefined],
      chTotal: [undefined],
    });
  }

  public exPrChTotalCal() {
    let exTotal = 0;
    exTotal = (
        this.securityDocumentForm.get('exHypoLandBuilding').value +
        this.securityDocumentForm.get('exHypoStock').value +
        this.securityDocumentForm.get('exAssignment').value +
        this.securityDocumentForm.get('exCashMargin').value +
        this.securityDocumentForm.get('exRegistration').value +
        this.securityDocumentForm.get('exPledgeOfShare').value +
        this.securityDocumentForm.get('exSecureTransaction').value +
        this.securityDocumentForm.get('exLoanDeed').value +
        this.securityDocumentForm.get('exPromissoryNote').value +
        this.securityDocumentForm.get('exLetterOfSetOff').value +
        this.securityDocumentForm.get('exConsentLetter').value +
        this.securityDocumentForm.get('exBlacklistingLetter').value +
        this.securityDocumentForm.get('exLatterOfContinuity').value +
        this.securityDocumentForm.get('exHirePurchaseDeed').value +
        this.securityDocumentForm.get('exOfferLetter').value
    );
    this.securityDocumentForm.get('exTotal').setValue(exTotal);

    let prTotal = 0;
    prTotal = (
        this.securityDocumentForm.get('prHypoLandBuilding').value +
        this.securityDocumentForm.get('prHypoStock').value +
        this.securityDocumentForm.get('prAssignment').value +
        this.securityDocumentForm.get('prCashMargin').value +
        this.securityDocumentForm.get('prRegistration').value +
        this.securityDocumentForm.get('prPledgeOfShare').value +
        this.securityDocumentForm.get('prSecureTransaction').value +
        this.securityDocumentForm.get('prLoanDeed').value +
        this.securityDocumentForm.get('prPromissoryNote').value +
        this.securityDocumentForm.get('prLetterOfSetOff').value +
        this.securityDocumentForm.get('prConsentLetter').value +
        this.securityDocumentForm.get('prBlacklistingLetter').value +
        this.securityDocumentForm.get('prLatterOfContinuity').value +
        this.securityDocumentForm.get('prHirePurchaseDeed').value +
        this.securityDocumentForm.get('prOfferLetter').value
    );
    this.securityDocumentForm.get('prTotal').setValue(prTotal);

    let chTotal = 0;
    chTotal = (
        this.securityDocumentForm.get('chHypoLandBuilding').value +
        this.securityDocumentForm.get('chHypoStock').value +
        this.securityDocumentForm.get('chAssignment').value +
        this.securityDocumentForm.get('chCashMargin').value +
        this.securityDocumentForm.get('chRegistration').value +
        this.securityDocumentForm.get('chPledgeOfShare').value +
        this.securityDocumentForm.get('chSecureTransaction').value +
        this.securityDocumentForm.get('chLoanDeed').value +
        this.securityDocumentForm.get('chPromissoryNote').value +
        this.securityDocumentForm.get('chLetterOfSetOff').value +
        this.securityDocumentForm.get('chConsentLetter').value +
        this.securityDocumentForm.get('chBlacklistingLetter').value +
        this.securityDocumentForm.get('chLatterOfContinuity').value +
        this.securityDocumentForm.get('chHirePurchaseDeed').value +
        this.securityDocumentForm.get('chOfferLetter').value
    );
    this.securityDocumentForm.get('chTotal').setValue(chTotal);
  }

}
