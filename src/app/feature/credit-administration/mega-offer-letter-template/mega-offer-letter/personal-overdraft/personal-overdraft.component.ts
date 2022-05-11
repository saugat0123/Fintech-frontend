import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-personal-overdraft',
  templateUrl: './personal-overdraft.component.html',
  styleUrls: ['./personal-overdraft.component.scss']
})
export class PersonalOverdraftComponent implements OnInit {
  form: FormGroup;
  // todo replace enum constant string compare
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  finalNepaliWord = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  ckeConfig = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  guarantorData;
  nepData;
  external = [];
  loanHolderInfo;
  tempData;
  offerLetterData;
  afterSave = false;
  selectedSecurity;
  loanLimit;
  renewal;
  offerDocumentDetails;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount: number = 0;
  finalName;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private ref: NbDialogRef<PersonalOverdraftComponent>,
              private engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe) { }

  ngOnInit() {
  this.buildPersonal();
  if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
    this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
  }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    this.checkOfferLetterData();
    this.guarantorDetails();
  }

buildPersonal() {
  this.form = this.formBuilder.group({
    referenceNumber: [undefined],
    dateOfApproval: [undefined],
    customerName: [undefined],
    customerAddress: [undefined],
    dateofApplication: [undefined],
    loanCommitmentFee: [undefined],
    loanAmountinFigure: [undefined],
    loanAmountInWords: [undefined],
    purposeOfLoan: [undefined],
    drawingPower: [undefined],
    baseRate: [undefined],
    premiumRate: [undefined],
    yearlyInterestRate: [undefined],
    loanadminFee: [undefined],
    loanadminFeeWords: [undefined],
    dateofExpiry: [undefined],
    nameofBranch: [undefined],
    nameofBranchManager: [undefined],
    guarantorName: [undefined],
    guaranteedamountinFigure: [undefined],
    guaranteedamountinWords: [undefined],
    insuranceAmountinFigure: [undefined],
    relationshipofficerName: [undefined],
    branchName: [undefined],
    district: [undefined],
    wardNum: [undefined],
    witnessName: [undefined],
    selectedSecurity: [undefined],
    loanLimitChecked: [undefined],
    renewalChecked: [undefined],
    additionalGuarantorDetails: [undefined],
    mortgageDeedDate: [undefined],
  });
}
  setLoanConfigData(data: any) {
    let cadNepData = {
      numberNepali: ')',
      nepaliWords: 'सुन्य',
    };
    const customerAddress =
        data.permanentMunicipality + ' , ' +
        data.permanentWard + ' , ' +
        data.permanentProvince + ' , ' +
        data.permanentDistrict;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
      cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
    }
    this.form.patchValue({
      customerName: data.name ? data.name : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmount: cadNepData.numberNepali,
      loanNameInWords: cadNepData.nepaliWords,
    });
  }
  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        console.log('Selected Security Details:', initialInfo);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        this.selectedSecurity = initialInfo.selectedSecurity.en;
        this.loanLimit = initialInfo.loanLimitChecked.en;
        this.renewal = initialInfo.renewalChecked.en;
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.selectedArray = initialInfo.loanTypeSelectedArray;
        this.fillForm();
        this.initialInfoPrint = initialInfo;
        if (this.initialInfoPrint.dateOfExpiryType.en === 'AD') {
          this.form.get('dateofExpiry').patchValue(this.engToNepaliDate.transform(this.initialInfoPrint.dateofExpiry.en, true));
        } else {
          this.form.get('dateofExpiry').patchValue(this.initialInfoPrint.dateofExpiryNepali.en);
        }
      }
    } else {
      this.fillForm();
    }
  }
  fillForm() {
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    let customerAddress;
    if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
     customerAddress =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality) &&
          !ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality.ct)) ?
          this.loanHolderInfo.permanentMunicipality.ct : '') +
         ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
              !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
             '-' + this.loanHolderInfo.permanentWard.ct : '') +
         ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict) &&
                  !ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict.ct)) ?
             ', ' + this.loanHolderInfo.permanentDistrict.ct : '') +
         ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince) &&
                      !ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince.ct)) ?
             ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ' : '');
    }
    /*const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ' ,' +
        this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';*/
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    let autoRefNumber;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    // For date of Approval
    const dateOfApprovalType = this.initialInfoPrint.dateOfApprovalType ? this.initialInfoPrint.dateOfApprovalType.en : '';
    let finalDateOfApproval;
    if (dateOfApprovalType === 'AD') {
      const templateDateApproval = this.initialInfoPrint.dateOfApproval ? this.initialInfoPrint.dateOfApproval.en : '';
      finalDateOfApproval = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApproval), true);
    } else {
      const templateDateApproval = this.initialInfoPrint.dateOfApprovalNepali ? this.initialInfoPrint.dateOfApprovalNepali.en : '';
      finalDateOfApproval = templateDateApproval ? templateDateApproval.nDate : '';
    }
    // For Date of Application:
    const dateOfApplication = this.initialInfoPrint.dateofApplicationType ? this.initialInfoPrint.dateofApplicationType.en : '';
    let finalDateOfApplication;
    if (dateOfApplication === 'AD') {
      const templateDateApplication = this.initialInfoPrint.dateofApplication ? this.initialInfoPrint.dateofApplication.en : '';
      finalDateOfApplication = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApplication), true);
    } else {
      const templateDateApplication = this.initialInfoPrint.dateofApplicationNepali ? this.initialInfoPrint.dateofApplicationNepali.en : '';
      finalDateOfApplication = templateDateApplication ? templateDateApplication.nDate : '';
    }
    // Mortgage Deed Date:
    const mortgageDeedDateType = this.initialInfoPrint.mortgageDeedDateType ? this.initialInfoPrint.mortgageDeedDateType.en : '';
    let finalMortgageDeedDate;
    if (mortgageDeedDateType === 'AD') {
      const templateMortgageDeedDate = this.initialInfoPrint.mortgageDeedDate ? this.initialInfoPrint.mortgageDeedDate.en : '';
      finalMortgageDeedDate = this.engToNepaliDate.transform(this.datePipe.transform(templateMortgageDeedDate), true);
    } else {
      const templateMortgageDeedDate = this.initialInfoPrint.mortgageDeedDateNepali ? this.initialInfoPrint.mortgageDeedDateNepali.en : '';
      finalMortgageDeedDate = templateMortgageDeedDate ? templateMortgageDeedDate.nDate : '';
    }
    this.form.patchValue({
      customerName: this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      // guarantorName: this.loanHolderInfo.guarantorDetails[0].guarantorName.np,
      referenceNumber: autoRefNumber ? autoRefNumber : '',
      purposeOfLoan: this.tempData.purposeOfLoan.ct ? this.tempData.purposeOfLoan.ct : '',
      drawingPower: this.tempData.drawingPower.ct ? this.tempData.drawingPower.ct : '',
      loanCommitmentFee: this.tempData.loanCommitmentFee.ct ? this.tempData.loanCommitmentFee.ct : '',
      baseRate: this.tempData.baseRate.ct ? this.tempData.baseRate.ct : '',
      premiumRate: this.tempData.premiumRate.ct ? this.tempData.premiumRate.ct : '',
      yearlyInterestRate: this.tempData.yearlyInterestRate.ct ? this.tempData.yearlyInterestRate.ct : '',
      loanadminFee: this.tempData.loanadminFee.ct ? this.tempData.loanadminFee.ct : '',
      loanadminFeeWords: this.tempData.loanadminFeeWords.ct ? this.tempData.loanadminFeeWords.ct : '',
      nameofBranch: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
      relationshipofficerName: this.tempData.relationshipofficerName.ct ? this.tempData.relationshipofficerName.ct : '',
      nameofBranchManager: this.tempData.nameofBranchManager.ct ? this.tempData.nameofBranchManager.ct : '',
      branchName : this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
      insuranceAmountinFigure : this.tempData.insuranceAmountinFigure.ct ? this.tempData.insuranceAmountinFigure.ct : '',
      dateOfApproval : finalDateOfApproval ? finalDateOfApproval : '',
      dateofApplication : finalDateOfApplication ? finalDateOfApplication : '',
      mortgageDeedDate: finalMortgageDeedDate ? finalMortgageDeedDate : '',
    });
  }
  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    this.form.get('selectedSecurity').patchValue(this.selectedSecurity);
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    this.form.get('renewalChecked').patchValue(this.renewal);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT)
            .toString()) {
          offerLetterPath.supportedInformation = this.form.get('additionalGuarantorDetails').value;
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = true;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }
  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.form.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.form.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.form.get('yearlyInterestRate').patchValue(asd);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  close() {
    this.ref.close();
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    try {
      if (ObjectUtil.isEmpty(trans)) {
        return data[key].ct;
      } else {
        return data[key].en;
      }
    } catch (exp) {
      console.log(exp);
    }
  }
  guarantorDetails(){
    if (this.guarantorData.length == 1){
      let temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    }
    else if(this.guarantorData.length == 2){
      for (let i = 0; i < this.guarantorData.length; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(" र ");
      this.finalName = this.allguarantorNames;
    }
    else{
      for (let i = 0; i < this.guarantorData.length-1; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(" , ");
      let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length-1].nepData);
      this.finalName =  this.allguarantorNames + " र " + temp1.guarantorName.ct;
    }
  }
}


