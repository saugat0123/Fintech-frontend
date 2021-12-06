import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ProposalCalculationUtils} from '../../../../../loan/component/loan-summary/ProposalCalculationUtils';

@Component({
  selector: 'app-udyamsil-karja-subsidy',
  templateUrl: './udyamsil-karja-subsidy.component.html',
  styleUrls: ['./udyamsil-karja-subsidy.component.scss']
})
export class UdyamsilKarjaSubsidyComponent implements OnInit {
  UdyamsilKarjaSubsidy: FormGroup;
  guarantorindividualGroup: FormGroup;
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
  loanOption;
  interestSubsidy;
  repaymentType;
  position = 'सम्पर्क अधिकृत';
  position1 = 'शाखा प्रबन्धक/बरिष्ठ सम्पर्क प्रबन्धक';
  assignedData;
  freeTextVal: any = {};
  freeInformation: any;
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
              private ref: NbDialogRef<UdyamsilKarjaSubsidyComponent>,
              private engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe) { }

  ngOnInit() {
    this.buildPersonal();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      const loanAmount = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadOfferLetterApprovedDoc.assignedLoan);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    this.checkOfferLetterData();
    this.guarantorDetails();
  }

  buildPersonal() {
    this.UdyamsilKarjaSubsidy = this.formBuilder.group({
      referenceNumber: [undefined],
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      loanCommitmentFee: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWord: [undefined],
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
      loanHolder: [undefined],
      previousSanctionLetterDate: [undefined],
      requestLetterDate: [undefined],
      typeOfLoan: [undefined],
      marginInPercentage: [undefined],
      totalInterestRate: [undefined],
      serviceCharge: [undefined],
      totaltenureOfLoan: [undefined],
      landOwnerName: [undefined],
      VDCMunicipality: [undefined],
      wardNo: [undefined],
      plotNo: [undefined],
      areaRopaniBigha: [undefined],
      commitmentFee: [undefined],
      NRBcircularRateAsPerMention: [undefined],
      nameOfARO_RO_RM_ARM: [undefined],
      nameOfApplicant: [undefined],
      executionDate: [undefined],
      nameOfBranchManager: [undefined],
      position: [undefined],
      position1: [undefined],
      securities: this.formBuilder.array([]),
      freeTextVal: [undefined],
      firstAdditionalDetails: [undefined],
      secondAdditionalDetails: [undefined],
      thirdAdditionalDetails: [undefined],
      fourthAdditionalDetails: [undefined],
      fifthAdditionalDetails: [undefined],
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
    this.UdyamsilKarjaSubsidy.patchValue({
      customerName: data.name ? data.name : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmount: cadNepData.numberNepali,
      loanNameInWords: cadNepData.nepaliWords,
    });
  }
    buildForm() {
        this.guarantorindividualGroup = this.formBuilder.group({
            individualGuarantors: this.formBuilder.array([]),
        });
    }
  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.UDYAMSIL_KARJA_SUBSIDY).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.UDYAMSIL_KARJA_SUBSIDY);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.UdyamsilKarjaSubsidy.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
          this.setFreeText();
          this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
        }
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.fillForm();
      }
    } else {
      this.setFreeText();
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
      this.fillForm();
    }
  }
  fillForm() {
    this.loanOption = this.tempData.loanOption.ct;
    this.interestSubsidy = this.tempData.interestSubsidy.ct;
    this.repaymentType = this.tempData.repaymentType.ct;
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
    let loanName;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.assignedData = this.cadOfferLetterApprovedDoc.assignedLoan[0];
      autoRefNumber = this.assignedData.refNo;
      loanName = this.assignedData.loan ? this.assignedData.loan.nepaliName : '';
    }
    this.guarantorDetails();
    this.UdyamsilKarjaSubsidy.patchValue({
        customerName: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
        referenceNumber: autoRefNumber ? autoRefNumber : '',
        dateOfApproval: this.tempData.dateOfApproval ? this.tempData.dateOfApproval.ct : '',
        customerAddress: customerAddress ? customerAddress : '',
        dateofApplication: this.tempData.dateOfApplication ? this.tempData.dateOfApplication.ct : '',
        previousSanctionLetterDate: this.tempData.previousSanctionDate ? this.tempData.previousSanctionDate.ct : '',
        requestLetterDate: this.tempData.dateOfApplication ? this.tempData.dateOfApplication.ct : '',
        NRBcircularRateAsPerMention: this.tempData.circularRate ? this.tempData.circularRate.ct : '',
        /*typeOfLoan: this.loanInfo.loanType ? this.loanInfo.loanType.ct : '',*/
        loanCommitmentFee: this.tempData.commitmentFee ? this.tempData.commitmentFee.ct : '',
        loanAmountInFigure: this.tempData.loanAmountFigure ? this.tempData.loanAmountFigure.ct : '',
        loanAmountInWord: this.tempData.loanAmountFigureWords ? this.tempData.loanAmountFigureWords.ct : '',
        purposeOfLoan: this.tempData.purposeOfLoan ? this.tempData.purposeOfLoan.ct : '',
        baseRate: this.tempData.baseRate ? this.tempData.baseRate.ct : '',
        premiumRate: this.tempData.premiumRate ? this.tempData.premiumRate.ct : '',
        yearlyInterestRate: this.tempData.interestRate ? this.tempData.interestRate.ct : '',
        serviceCharge: this.tempData.serviceCharge ? this.tempData.serviceCharge.ct : '',
        landOwnerName: this.loanHolderInfo.landOwnerName ? this.loanHolderInfo.landOwnerName.ct : '',
        relationshipofficerName: this.tempData.relationshipofficerName ? this.tempData.relationshipofficerName.ct : '',
        branchName: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
        district: this.loanHolderInfo.district ? this.loanHolderInfo.district.ct : '',
        wardNum: this.loanHolderInfo.wardNum ? this.loanHolderInfo.wardNum.ct : '',
        marginInPercentage: this.tempData.marginInPercentage ? this.tempData.marginInPercentage.ct : '',
        totalInterestRate: this.tempData.interestRate ? this.tempData.interestRate.ct : '',
        totaltenureOfLoan: this.tempData.totalTenureOfLoan ? this.tempData.totalTenureOfLoan.ct : '',
        VDCMunicipality: this.loanHolderInfo.municipalityVdc ? this.loanHolderInfo.municipalityVdc.ct : '',
        wardNo: this.loanHolderInfo.wardNumber ? this.loanHolderInfo.wardNumber.ct : '',
        commitmentFee: this.tempData.commitmentFee ? this.tempData.commitmentFee.ct : '',
        nameOfARO_RO_RM_ARM: this.tempData.nameOfStaff ? this.tempData.nameOfStaff.ct : '',
        nameOfBranchManager: this.tempData.nameOfBranchManager ? this.tempData.nameOfBranchManager.ct : '',
        nameOfApplicant: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
        guarantorName: this.finalName ? this.finalName : '',
        typeOfLoan: loanName ? loanName : '',
        firstAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.firstText : '',
        secondAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.secondText : '',
        thirdAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.thirdText : '',
        fourthAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.fourthText : '',
        fifthAdditionalDetails : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.fifthText : '',
        position : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.position : '',
        position1 : !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.position2 : '',
    });
  }
  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    this.UdyamsilKarjaSubsidy.get('selectedSecurity').patchValue(this.selectedSecurity);
    this.UdyamsilKarjaSubsidy.get('loanLimitChecked').patchValue(this.loanLimit);
    this.UdyamsilKarjaSubsidy.get('renewalChecked').patchValue(this.renewal);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.UDYAMSIL_KARJA_SUBSIDY).toString()) {
          this.setFreeText();
          offerLetterPath.supportedInformation = JSON.stringify(this.freeTextVal);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.UDYAMSIL_KARJA_SUBSIDY);
      offerDocument.initialInformation = JSON.stringify(this.UdyamsilKarjaSubsidy.value);
      this.setFreeText();
      offerDocument.supportedInformation = JSON.stringify(this.freeTextVal);
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
  setFreeText() {
    this.freeTextVal = {
      firstText: this.UdyamsilKarjaSubsidy.get('firstAdditionalDetails').value,
      secondText: this.UdyamsilKarjaSubsidy.get('secondAdditionalDetails').value,
      thirdText: this.UdyamsilKarjaSubsidy.get('thirdAdditionalDetails').value,
      fourthText: this.UdyamsilKarjaSubsidy.get('fourthAdditionalDetails').value,
      fifthText: this.UdyamsilKarjaSubsidy.get('fifthAdditionalDetails').value,
      sixthText: this.UdyamsilKarjaSubsidy.get('position').value,
      seventhText: this.UdyamsilKarjaSubsidy.get('position1').value,
    };
  }
  calcYearlyRate() {
    const baseRate = this.nepToEngNumberPipe.transform(this.UdyamsilKarjaSubsidy.get('baseRate').value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.UdyamsilKarjaSubsidy.get('premiumRate').value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.UdyamsilKarjaSubsidy.get('yearlyInterestRate').patchValue(asd);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.UdyamsilKarjaSubsidy.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.UdyamsilKarjaSubsidy.get(wordLabel).patchValue(returnVal);
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



