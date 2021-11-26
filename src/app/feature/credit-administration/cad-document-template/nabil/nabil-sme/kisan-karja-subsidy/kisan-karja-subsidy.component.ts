import {Component, Input, OnInit} from '@angular/core';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-kisan-karja-subsidy',
  templateUrl: './kisan-karja-subsidy.component.html',
  styleUrls: ['./kisan-karja-subsidy.component.scss']
})
export class KisanKarjaSubsidyComponent implements OnInit {
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  selectedArray = [];
  afterSave = false;
  kisanKarjaSubsidy: FormGroup;
  spinner = false;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() preview;
  @Input() customerLoanId: number;
  initialInfoPrint;
  loanHolderInfo;
  branchName;
  tempData;
  // selectedSecurity;
  loanLimit;
  renewal;
  offerDocumentDetails;
  offerLetterData;
  guarantorData;
  offerLetterConst = NabilOfferLetterConst;
  freeTextVal: any = {};
  freeInformation: any;
  finalName;
  guarantorNames;
  allguarantorNames;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepaliDate: EngNepDatePipe,
              private ref: NbDialogRef<KisanKarjaSubsidyComponent>,
              public datePipe: DatePipe
  ) { }

  ngOnInit() {  this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.branchName = this.cadOfferLetterApprovedDoc.loanHolder.branch.nepaliName + 'मा';
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      console.log('::::::::::::::', this.tempData);
      console.log(this.offerDocumentDetails);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    this.checkOfferLetterData();
   /* this.guarantorDetails();*/
  }
  buildForm() {
    this.kisanKarjaSubsidy = this.formBuilder.group({
      referenceNumber: [undefined],
      securities: this.formBuilder.array([]),
      freeTextVal : [undefined],
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateOfApplication: [undefined],
      prevSanctionLetterDate: [undefined],
      nextReviewDate: [undefined],
      typeOfLoan: [undefined],
      loanAmountinFigure : [undefined],
      loanAmountInWords : [undefined],
      purposeOfLoan: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      swekritiLoan: [undefined],
      totalTenureOfLoan: [undefined],
      landOwnerName: [undefined],
      district: [undefined],
      vdcMunci: [undefined],
      wardNo: [undefined],
      plotNo: [undefined],
      area: [undefined],
      nameOfPersonalGuarantor: [undefined],
      rateNrbCircular: [undefined],
      relationshipOfficerName: [undefined],
      branchName: [undefined],
      branchManager: [undefined],
      applicantName: [undefined],
      commitmentFee : [undefined],
      executionDate : [undefined],
      // TEST:
      firstAdditionalDetails: [undefined],
      secondAdditionalDetails: [undefined],
      thirdAdditionalDetails: [undefined],
      fourthAdditionalDetails: [undefined],
      fifthAdditionalDetails: [undefined],
      sixthAdditionalDetails: [undefined],
      seventhAdditionalDetails: [undefined],
      eighthAdditionalDetails: [undefined],
    });
  }

  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.kisanKarjaSubsidy.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.kisanKarjaSubsidy.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.kisanKarjaSubsidy.get('yearlyInterestRate').patchValue(asd);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.kisanKarjaSubsidy.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.kisanKarjaSubsidy.get(wordLabel).patchValue(returnVal);
  }

  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.KISAN_KARJA_SUBSIDY).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.KISAN_KARJA_SUBSIDY);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      if (!ObjectUtil.isEmpty(this.offerLetterDocument.pointInformation)) {
        this.offerLetterData = this.offerLetterDocument;
       /* this.kisanKarjaSubsidy.get(this.freeTextVal.firstText).patchValue(this.offerLetterData.supportedInformation);*/
      }
        // this.selectedSecurity = initialInfo.selectedSecurity.en;
        // this.loanLimit = initialInfo.loanLimitChecked.en;
        // this.renewal = initialInfo.renewalChecked.en;
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.selectedArray = initialInfo.loanTypeSelectedArray;
        this.initialInfoPrint = initialInfo;
        this.fillForm();
      }
    } else {
      this.fillForm();
    }
  }
  fillForm() {
    console.log(this.offerDocumentDetails);
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ' ,' +
        this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';
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
      finalDateOfApproval = this.tempData.dateOfApproval ? this.tempData.dateOfApproval.ct : '';
    } else {
      finalDateOfApproval = this.tempData.dateOfApprovalNepali ? this.tempData.dateOfApprovalNepali.ct : '';
    }
    // For Date of Application:
    const dateOfApplication = this.initialInfoPrint.dateOfApplicationType ? this.initialInfoPrint.dateOfApplicationType.en : '';
    let finaldateOfApplication;
    if (dateOfApplication === 'AD') {
      finaldateOfApplication = this.tempData.dateOfApplication ? this.tempData.dateOfApplication.ct : '';
    } else {
      finaldateOfApplication = this.tempData.dateOfApplicationNepali ? this.tempData.dateOfApplicationNepali.ct : '';
    }
    // For NEXT REVIEW DATE
    const nextReviewDateType = this.initialInfoPrint.nextReviewDateType ? this.initialInfoPrint.nextReviewDateType.en : '';
    let finalNextReviewDate;
    if (nextReviewDateType === 'AD') {
      finalNextReviewDate = this.tempData.nextReviewDate ? this.tempData.nextReviewDate.ct : '';
    } else {
      finalNextReviewDate = this.tempData.nextReviewDateNepali ? this.tempData.nextReviewDateNepali.ct : '';
    }
    // For PREVIOUS SANCTION DATE
    // tslint:disable-next-line:max-line-length
    const prevSanctionLetterDateType = this.tempData.previousSanctionType ? this.tempData.previousSanctionType.en : '';
    let finalprevSanctionLetterDate;
    if (nextReviewDateType === 'AD') {
      finalprevSanctionLetterDate = this.tempData.previousSanctionDate ? this.tempData.previousSanctionDate.ct : '';
    } else {
      finalprevSanctionLetterDate = this.tempData.previousSanctionDateNepali ? this.tempData.previousSanctionDateNepali.ct : '';
    }
    console.log('Free Text value:', this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    console.log('Free : ', this.freeInformation);
    this.guarantorDetails();
    this.kisanKarjaSubsidy.patchValue({
      customerName: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
      // guarantorName: this.loanHolderInfo.guarantorDetails[0].guarantorName.np,
      referenceNumber: autoRefNumber ? autoRefNumber : '',
      purposeOfLoan: this.tempData.purposeOfLoan ? this.tempData.purposeOfLoan.ct : '',
      drawingPower: this.tempData.marginInPercentage ? this.tempData.marginInPercentage.ct : '',
      commitmentFee: this.tempData.commitmentFee ? this.tempData.commitmentFee.ct : '',
      rateNrbCircular : this.tempData.circularRate ? this.tempData.circularRate.ct : '',
      baseRate: this.tempData.baseRate ? this.tempData.baseRate.ct : '',
      premiumRate: this.tempData.premiumRate ? this.tempData.premiumRate.ct : '',
      yearlyInterestRate: this.tempData.interestRate ? this.tempData.interestRate.ct : '',
      loanadminFee: this.tempData.loanadminFee ? this.tempData.loanadminFee.ct : '',
      loanadminFeeWords: this.tempData.loanadminFeeWords ? this.tempData.loanadminFeeWords.ct : '',
      nameofBranch: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      relationshipOfficerName: this.tempData.nameOfStaff ? this.tempData.nameOfStaff.ct : '',
      branchManager : this.tempData.nameOfBranchManager ? this.tempData.nameOfBranchManager.ct : '',
      branchName : this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      // insuranceAmountinFigure : this.tempData.insuranceAmountinFigure.ct ? this.tempData.insuranceAmountinFigure.ct : '',
      dateOfApproval : finalDateOfApproval ? finalDateOfApproval : '',
      dateOfApplication : finaldateOfApplication ? finaldateOfApplication : '',
      nextReviewDate : finalNextReviewDate ? finalNextReviewDate : '',
      prevSanctionLetterDate : finalprevSanctionLetterDate ? finalprevSanctionLetterDate : '',
      firstAdditionalDetails : this.freeInformation.firstText ? this.freeInformation.firstText : '',
      secondAdditionalDetails : this.freeInformation.secondText ? this.freeInformation.secondText : '',
      thirdAdditionalDetails : this.freeInformation.thirdText ? this.freeInformation.thirdText : '',
      fourthAdditionalDetails : this.freeInformation.fourthText ? this.freeInformation.fourthText : '',
      fifthAdditionalDetails : this.freeInformation.fifthText ? this.freeInformation.fifthText : '',
      sixthAdditionalDetails : this.freeInformation.sixthText ? this.freeInformation.sixthText : '',
      seventhAdditionalDetails : this.freeInformation.seventhText ? this.freeInformation.seventhText : '',
      eighthAdditionalDetails : this.freeInformation.eighthText ? this.freeInformation.eighthText : '',
      nameOfPersonalGuarantor : this.finalName ? this.finalName : '',
      totalTenureOfLoan : this.tempData.totalTenureOfLoan ? this.tempData.totalTenureOfLoan.ct : '',
      typeOfLoan : this.tempData.repaymentType ? this.tempData.repaymentType.ct : '',
    });

  }
  get Form() {
    return this.kisanKarjaSubsidy.controls;
  }
  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    /*this.kisanKarjaSubsidy.get('loanLimitChecked').patchValue(this.loanLimit);*/
    // this.kisanKarjaSubsidy.get('selectedSecurity').patchValue(this.selectedSecurity);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.KISAN_KARJA_SUBSIDY).toString()) {
            this.setFreeText();
            offerLetterPath.supportedInformation = JSON.stringify(this.freeTextVal);
          // offerLetterPath.supportedInformation = this.kisanKarjaSubsidy.get(this.freeTextVal.firstText).value;
            // offerLetterPath.pointInformation = this.kisanKarjaSubsidy.get('additionalDetails').value;
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.KISAN_KARJA_SUBSIDY);
      offerDocument.initialInformation = JSON.stringify(this.kisanKarjaSubsidy.value);
      // offerDocument.supportedInformation = this.kisanKarjaSubsidy.get(this.freeTextVal).value;
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    console.log('cad dATA', this.cadOfferLetterApprovedDoc);

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
  close() {
    this.ref.close();
  }
  setFreeText() {
    console.log('Set free text');
    this.freeTextVal = {
      firstText: this.kisanKarjaSubsidy.get('firstAdditionalDetails').value,
      secondText: this.kisanKarjaSubsidy.get('secondAdditionalDetails').value,
      thirdText: this.kisanKarjaSubsidy.get('thirdAdditionalDetails').value,
      fourthText: this.kisanKarjaSubsidy.get('fourthAdditionalDetails').value,
      fifthText: this.kisanKarjaSubsidy.get('fifthAdditionalDetails').value,
      sixthText: this.kisanKarjaSubsidy.get('sixthAdditionalDetails').value,
      seventhText: this.kisanKarjaSubsidy.get('seventhAdditionalDetails').value,
      eighthText: this.kisanKarjaSubsidy.get('eighthAdditionalDetails').value,
    };
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1 ; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
  }
}
