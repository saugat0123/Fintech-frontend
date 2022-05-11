import {Component, Input, OnInit} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {NabilOfferLetterConst} from "../../../nabil-offer-letter-const";
import {LocalStorageUtil} from "../../../../../@core/utils/local-storage-util";
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-sme',
  templateUrl: './sme.component.html',
  styleUrls: ['./sme.component.scss']
})
export class SmeComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
    loanForm: FormGroup;
  // todo replace enum constant string compare
  smeLoanHolderInfo;
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  ckeConfig = NepaliEditor.CK_CONFIG;
  guarantorData;
  offerLetterData;
  tempData;
  afterSave = false;
  selectedAutoLoan;
  loanHolderInfo;
  selectedInterest;
  loanLimit;
  finalName;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount: number = 0;
  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private toastService: ToastService,
               private administrationService: CreditAdministrationService,
               protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
               private routerUtilsService: RouterUtilsService,
               public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               private engToNepNumberPipe: EngToNepaliNumberPipe,
               private currencyFormatPipe: CurrencyFormatterPipe,
               private nepToEngNumberPipe: NepaliToEngNumberPipe,
               private nepPercentWordPipe: NepaliPercentWordPipe,
               private ref: NbDialogRef<SmeComponent>,
               private datePipe: DatePipe,
               private engNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder.nepData)) {
      this.smeLoanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    console.log('Selected Data:',this.cadOfferLetterApprovedDoc);
    console.log('All Data:',this.tempData);
    console.log('Loan Holder initial data:',this.smeLoanHolderInfo);
    this.checkOfferLetterData();
    this.guarantorDetails();
  }
  buildForm() {
    this.loanForm = this.formBuilder.group({
      selectedAutoLoan: [undefined],
      selectedInterest: [undefined],
      loanLimitChecked: [undefined],
      referenceNumber: [undefined],
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      vehicleName: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanAdminFee: [undefined],
      loanAdminFeeInWords: [undefined],
      emiAmountInFigure: [undefined],
      emiAmountInWords: [undefined],
      numberOfEmi: [undefined],
      loanCommitmentFee: [undefined],
      guarantorName: [undefined],
      guaranteedAmountInFigure: [undefined],
      guaranteedAmountInWord: [undefined],
      branchName: [undefined],
      vendorName: [undefined],
      additionalGuarantorDetails: [undefined],
      relationshipOfficerName: [undefined],
      branchManager: [undefined],
      signatureDate: [undefined],
      // staffName: [undefined],
    });
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
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(" र ");
      this.finalName = this.allguarantorNames;
    }
    else{
      for (let i = 0; i < this.guarantorData.length-1; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(" , ");
      let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length-1].nepData);
      this.finalName =  this.allguarantorNames + " र " + temp1.guarantorName.ct;
    }
  }

  checkOfferLetterData() {
    console.log('Check Offer Data Works:');
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.loanForm.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.selectedAutoLoan = initialInfo.selectedAutoLoan.en;
        this.selectedInterest = initialInfo.selectedInterest.en;
        this.loanLimit = this.tempData.loanLimitChecked.en;
        this.selectedArray = initialInfo.loanTypeSelectedArray;
        this.initialInfoPrint = initialInfo;
        this.fillForm();
      }
    } else {
      this.fillForm();
    }
  }

  fillForm() {
    console.log('Filling form works:');
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
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    let autoReferenceNumber;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      autoReferenceNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    let apprDate;
    const dateOfApprovalType = this.initialInfoPrint.dateOfApprovalType ?
        this.initialInfoPrint.dateOfApprovalType.en : '';
    if (dateOfApprovalType === 'AD') {
      const tempApprDate = this.initialInfoPrint.dateOfApproval ?
          this.engNepDatePipe.transform(this.datePipe.transform(this.initialInfoPrint.dateOfApproval.en), true) :
          '';
      apprDate = tempApprDate ? tempApprDate : '';
    } else {
      const tempApprNepali = this.initialInfoPrint.dateOfApprovalNepali ?
          this.initialInfoPrint.dateOfApprovalNepali.en.nDate : '';
      apprDate = tempApprNepali ? tempApprNepali : '';
    }

    // For Date of application
    let applicationDate;
    const dateOfApplicationType = this.initialInfoPrint.dateofApplicationType ?
        this.initialInfoPrint.dateofApplicationType.en : '';
    if (dateOfApplicationType === 'AD') {
      const tempAppDate = this.initialInfoPrint.dateofApplication ?
          this.engNepDatePipe.transform(this.datePipe.transform(this.initialInfoPrint.dateofApplication.en), true) :
          '';
      applicationDate = tempAppDate ? tempAppDate : '';
    } else {
      const tempAppNep = this.initialInfoPrint.dateofApplicationNepali ?
          this.initialInfoPrint.dateofApplicationNepali.en.nDate : '';
      applicationDate = tempAppNep ? tempAppNep : '';
    }
    this.loanForm.patchValue({
      customerName: this.smeLoanHolderInfo.name.ct ? this.smeLoanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountInFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      referenceNumber: autoReferenceNumber ? autoReferenceNumber : '',
      vehicleName: this.tempData.vehicleName.ct ? this.tempData.vehicleName.ct : '',
      baseRate: this.tempData.baseRate.ct ? this.tempData.baseRate.ct : '',
      premiumRate: this.tempData.premiumRate.ct ? this.tempData.premiumRate.ct : '',
      yearlyInterestRate: this.tempData.yearlyInterestRate.ct ? this.tempData.yearlyInterestRate.ct : '',
      drawingPower: this.tempData.drawingPower.ct ? this.tempData.drawingPower.ct : '',
      loanAdminFee: this.tempData.loanAdminFee.ct ? this.tempData.loanAdminFee.ct : '',
      loanAdminFeeInWords: this.tempData.loanAdminFeeInWords.ct ? this.tempData.loanAdminFeeInWords.ct : '',
      emiAmountInFigure: this.tempData.emiAmountInFigure.ct ? this.tempData.emiAmountInFigure.ct : '',
      emiAmountInWords: this.tempData.emiAmountInWords.ct ? this.tempData.emiAmountInWords.ct : '',
      numberOfEmi: this.tempData.numberOfEmi.ct ? this.tempData.numberOfEmi.ct : '',
      loanCommitmentFee: this.tempData.loanCommitmentFee.ct ? this.tempData.loanCommitmentFee.ct : '',
      branchName: this.smeLoanHolderInfo.branch ? this.smeLoanHolderInfo.branch.ct : '',
      vendorName: this.tempData.vendorName.ct ? this.tempData.vendorName.ct : '',
      relationshipOfficerName: this.tempData.relationshipOfficerName.ct ? this.tempData.relationshipOfficerName.ct : '',
      branchManager: this.tempData.branchManager.ct ? this.tempData.branchManager.ct : '',
      // staffName: this.tempData.staffName.ct ? this.tempData.staffName.ct : '',
      dateOfApproval: apprDate ? apprDate : '',
      dateofApplication: applicationDate ? applicationDate : '',
    });
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    this.loanForm.get('selectedAutoLoan').patchValue(this.selectedAutoLoan);
    this.loanForm.get('selectedInterest').patchValue(this.selectedInterest);
    this.loanForm.get('loanLimitChecked').patchValue(this.loanLimit);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN).toString()) {
          offerLetterPath.supportedInformation = this.loanForm.get('additionalGuarantorDetails').value;
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.loanForm.value);
      offerDocument.supportedInformation = this.loanForm.get('additionalGuarantorDetails').value;
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe( () => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = true;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    } ,  error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }
  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.loanForm.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.loanForm.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.loanForm.get('yearlyInterestRate').patchValue(asd);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanForm.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.loanForm.get(wordLabel).patchValue(returnVal);
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
}
