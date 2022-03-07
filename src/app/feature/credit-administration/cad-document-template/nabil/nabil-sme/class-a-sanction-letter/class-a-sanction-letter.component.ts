import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
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
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-class-a-sanction-letter',
  templateUrl: './class-a-sanction-letter.component.html',
  styleUrls: ['./class-a-sanction-letter.component.scss']
})
export class ClassASanctionLetterComponent implements OnInit {
  form: FormGroup;
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
  autoRefNumber;
  afterSave = false;
  selectedSecurity;
  loanLimit;
  renewal;
  offerDocumentDetails;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  finalName;
  isNatural;
  isFixedDepositSelected;
  isDepositAccountSelected;
  isOneoffSelected;
  isRegularSelected;
  isAllLoanSelected;
  isSpecificSelected;
  isCommissionType1Selected;
  isCommissionType2Selected;
  New;
  Existing;
  CashMarginHundred;
  CashMarginTen;
  CoupenRateFinancing;
  BaseRateFinancing;
  freeTextVal: any = {};
  allHolderNames;
  holderFinalName;
  holderNames: any = [];
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
              private ref: NbDialogRef<ClassASanctionLetterComponent>,
              private engToNepaliDate: EngNepDatePipe,
              public datePipe: DatePipe) { }

  ngOnInit() {  this.buildSanction();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    this.checkOfferLetterData();
    // this.guarantorDetails();
  }
  buildSanction() {
    this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      dateOfApproval: [undefined],
      dateOfApplication: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      nameOfBorrower: [undefined],
      addressOfBorrower: [undefined],
      requestLetterDate: [undefined],
      tenureFacility : [undefined],
      sanctionLetterDate: [undefined],
      previousSanctionDate: [undefined],
      premiumRate: [undefined],
      loanAmountFigure: [undefined],
      loanAmountFigureWords: [undefined],
      nameOfTdHolder: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      interestRate: [undefined],
      dateOfExpiry: [undefined],
      // freeText
      additionalGuarantorDetails: [undefined],
      additionalCostumerDetails: [undefined],
      basicFreeText: [undefined],
      accountNumberFreeText: [undefined],
      accountHolderFreeText: [undefined],
      tableFreeText: [undefined],
      applicableFreeTextBox: [undefined],
      additionalFreeTextBox: [undefined],

      nameOfTD: [undefined],
      accountNumber: [undefined],
      minimumCommissionAmount: [undefined],
      amount: [undefined],
      totalLimitInWords: [undefined],
      totalLimitInFigure: [undefined],
      serviceChargeInFigure: [undefined],
      serviceChargeInWords: [undefined],
      nameOfRelationalManager: [undefined],
      branchName: [undefined],
      additionalDetail: [undefined],
      nameOfBranchManager: [undefined],
      date: [undefined],
      TdHolding: [undefined],
      serviceChargeFigure: [undefined],
      serviceChargeWords: [undefined],
      detailOfFacility: [undefined],
      serviceChargeInPerc: [undefined],
      TdHolder: [undefined],
      TDAmount: [undefined],
      holderName: [undefined],
      miniumComissionAmount: [undefined],
      comissionRate: [undefined],
      comissionRateFirstQuarter: [undefined],
      comissionRateOthersQuarter: [undefined],
      naturalPersonCheck: [undefined],
      counterGuarantee: [undefined],
      samparkaAdhikrit: [undefined],
      samparkaPrabandhak: [undefined],
      witnessDistrict: [undefined],
      witnessMunicipality: [undefined],
      WitnessWardNumber: [undefined],
      witnessAge: [undefined],
      witnessName: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipality2: [undefined],
      WitnessWardNumber2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      bankStaff: [undefined],
      otherBank: [undefined],
    });
  }
  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.CLASS_A).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CLASS_A);
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
          this.offerLetterData = this.offerLetterDocument;
          this.freeTextVal = JSON.parse(this.offerLetterDocument.supportedInformation);
          // this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
        }
        // this.selectedSecurity = initialInfo.selectedSecurity.en;
        this.isNatural = initialInfo.naturalPersonCheck.en;
        this.New = initialInfo.New.ct;
        this.Existing = initialInfo.Existing.ct;
        this.initialInfoPrint = initialInfo;
        this.CoupenRateFinancing = initialInfo.CoupenRateFinancing.ct;
        this.BaseRateFinancing = initialInfo.BaseRateFinancing.ct;
        this.existingOfferLetter = true;
        this.selectedArray = initialInfo.loanTypeSelectedArray;
        this.fillForm();
        this.initialInfoPrint = initialInfo;
      }
    } else {
      this.fillForm();
    }
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const tempGuarantorNep = JSON.parse(this.guarantorData[0].nepData);
      if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
        // const temp = JSON.parse(this.guarantorData[0].nepData);
        this.finalName = tempGuarantorNep.guarantorName.ct;
      } else {
        // const temp = JSON.parse(this.guarantorData[0].nepData);
        this.finalName = tempGuarantorNep.authorizedPersonName.ct;
      }
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const tempGuarantorNep = JSON.parse(this.guarantorData[i].nepData);
        if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.guarantorName.ct);
        } else {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.authorizedPersonName.ct);
        }
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const tempGuarantorNep = JSON.parse(this.guarantorData[i].nepData);
        if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.guarantorName.ct);
          // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
        } else {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.authorizedPersonName.ct);
        }

      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName = this.allguarantorNames + ' र ' + temp1.authorizedPersonName.ct;
    }
  }
  fillForm() {
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    const customerAddress = this.loanHolderInfo.registeredMunicipality.ct + '-' +
        this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
        this.loanHolderInfo.registeredProvince.ct + ' प्रदेश ';
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
    // For date of Approval(sanction date)
    const sanctionLetterDate = this.initialInfoPrint.sanctionLetterDateType ? this.initialInfoPrint.sanctionLetterDateType.en : '';
    let finalDateOfSanctionDate;
    if (sanctionLetterDate === 'AD') {
      const templateDateSanctionDate = this.initialInfoPrint.sanctionLetterDate ? this.initialInfoPrint.sanctionLetterDate.en : '';
      finalDateOfSanctionDate = this.engToNepaliDate.transform(this.datePipe.transform(templateDateSanctionDate), true);
    } else {
      const templateDateSanctionDate = this.initialInfoPrint.sanctionLetterDateNepali ? this.initialInfoPrint.sanctionLetterDateNepali.en : '';
      finalDateOfSanctionDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
    }
    // For Date of Application:
    const dateOfApplication = this.initialInfoPrint.dateOfApplicationType ? this.initialInfoPrint.dateOfApplicationType.en : '';
    let finalDateOfApplication;
    if (dateOfApplication === 'AD') {
      const templateDateApplication = this.initialInfoPrint.dateOfApplication ? this.initialInfoPrint.dateOfApplication.ct : '';
      finalDateOfApplication = templateDateApplication ? templateDateApplication : '';
    } else {
      const templateDateApplication = this.initialInfoPrint.dateOfApplicationNepali ? this.initialInfoPrint.dateOfApplicationNepali.en : '';
      finalDateOfApplication = templateDateApplication ? templateDateApplication.nDate : '';
    }
    // For Date of Expiry:
    const dateOfExpiry = this.initialInfoPrint.dateOfExpiryType ? this.initialInfoPrint.dateOfExpiryType.en : '';
    let finalDateOfExpiry;
    if (dateOfExpiry === 'AD') {
      const templateDateExpiry = this.initialInfoPrint.dateOfExpiry ? this.initialInfoPrint.dateOfExpiry.ct : '';
      finalDateOfExpiry = templateDateExpiry;
    } else {
      const templateDateExpiry = this.initialInfoPrint.dateOfExpiryNepali ? this.initialInfoPrint.dateOfExpiryNepali.en : '';
      finalDateOfExpiry = templateDateExpiry ? templateDateExpiry.nDate : '';
    }
    // For Previous Sanction:
    const previousSanctionDate = this.initialInfoPrint.previousSanctionType ? this.initialInfoPrint.previousSanctionType.en : '';
    let finalDateOfSanction;
    if (previousSanctionDate === 'AD') {
      const templateDateSanction = this.initialInfoPrint.previousSanctionDate ? this.initialInfoPrint.previousSanctionDate.ct : '';
      // finalDateOfSanction = this.engToNepaliDate.transform(this.datePipe.transform(templateDateSanction), true);
      finalDateOfSanction = templateDateSanction ? templateDateSanction : '';
    } else {
      const templateDateSanction = this.initialInfoPrint.previousSanctionDateNepali ? this.initialInfoPrint.previousSanctionDateNepali.en : '';
      finalDateOfSanction = templateDateSanction ? templateDateSanction.nDate : '';
    }
    this.getHolderDetails();
    this.form.patchValue({
      customerName: (!ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.customerName)) ?
          this.freeTextVal.customerName : this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmountFigure: this.tempData.totalLimitInFigure ? this.tempData.totalLimitInFigure.ct : '',
      loanAmountFigureWords: this.nepaliCurrencyWordPipe.transform(
          this.tempData.totalLimitInFigure ? this.tempData.totalLimitInFigure.en : ''),
      referenceNumber: autoRefNumber ? autoRefNumber : '',
      baseRate: this.tempData.baseRate.ct ? this.tempData.baseRate.ct : '',
      premiumRate: this.tempData.premiumRate.ct ? this.tempData.premiumRate.ct : '',
      interestRate: this.tempData.interestRate.ct ? this.tempData.interestRate.ct : '',
      drawingPower: this.tempData.drawingPower.ct ? this.tempData.drawingPower.ct : '',
      nameOfRelationalManager: this.tempData.nameOfRelationalManager.ct ? this.tempData.nameOfRelationalManager.ct : '',
      nameOfBranchManager: this.tempData.nameOfBranchManager.ct ? this.tempData.nameOfBranchManager.ct : '',
      TDAmount: this.tempData.TDAmount.ct ? this.tempData.TDAmount.ct : '',
      TdHolder: this.holderFinalName ? this.holderFinalName : '',
      totalLimitInFigure: this.tempData.totalLimitInFigure.ct ? this.tempData.totalLimitInFigure.ct : '',
      holderName: this.holderFinalName ? this.holderFinalName : '',
      // sanctionLetterDate: this.tempData.sanctionLetterDate.ct ? this.tempData.sanctionLetterDate.ct : '',
      totalLimitInWords: this.tempData.totalLimitInWords.ct ? this.tempData.totalLimitInWords.ct : '',
      TdHolding: this.tempData.TdHolding.ct ? this.tempData.TdHolding.ct : '',
      branchName : this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
      sanctionLetterDate : finalDateOfSanctionDate ? finalDateOfSanctionDate : '',
      dateOfApplication : finalDateOfApplication ? finalDateOfApplication : '',
      dateOfExpiry: finalDateOfExpiry ? finalDateOfExpiry : '',
      previousSanctionDate: finalDateOfSanction ? finalDateOfSanction : '',
      comissionRate: this.tempData.comissionRate.ct ? this.tempData.comissionRate.ct : '',
      accountNumber: (!ObjectUtil.isEmpty(this.freeTextVal) &&
          !ObjectUtil.isEmpty(this.freeTextVal.accountNumber)) ?
          this.freeTextVal.accountNumber : this.tempData.accountNumber.en ? this.tempData.accountNumber.en : '',
      serviceChargeInFigure: this.tempData.serviceChargeFigure.ct ? this.tempData.serviceChargeFigure.ct : '',
      serviceChargeInWords: this.tempData.serviceChargeWords.ct ? this.tempData.serviceChargeWords.ct : '',
      tenureFacility: this.tempData.tenureFacility.ct ? this.tempData.tenureFacility.ct : '',
      detailOfFacility: this.tempData.detailOfFacility.ct ? this.tempData.detailOfFacility.ct : '',
      serviceChargeInPerc: this.tempData.serviceChargeInPerc.ct ? this.tempData.serviceChargeInPerc.ct : '',
      comissionRateFirstQuarter: this.tempData.comissionRateFirstQuarter.ct ? this.tempData.comissionRateFirstQuarter.ct : '',
      comissionRateOthersQuarter: this.tempData.comissionRateOthersQuarter.ct ? this.tempData.comissionRateOthersQuarter.ct : '',
      miniumComissionAmount:  this.tempData.miniumComissionAmount.ct ? this.tempData.miniumComissionAmount.ct : '',

      additionalCostumerDetails: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.additionalCostumerDetails) ?
          this.freeTextVal.additionalCostumerDetails : '',
      tableFreeText: !ObjectUtil.isEmpty(this.freeTextVal) &&
          !ObjectUtil.isEmpty(this.freeTextVal.tableFreeText) ?
          this.freeTextVal.tableFreeText : '',
      additionalFreeTextBox: !ObjectUtil.isEmpty(this.freeTextVal) &&
          !ObjectUtil.isEmpty(this.freeTextVal.additionalFreeTextBox) ?
          this.freeTextVal.additionalFreeTextBox : '',
      applicableFreeTextBox: !ObjectUtil.isEmpty(this.freeTextVal) &&
          !ObjectUtil.isEmpty(this.freeTextVal.applicableFreeTextBox) ?
          this.freeTextVal.applicableFreeTextBox : '',
      samparkaAdhikrit: !ObjectUtil.isEmpty(this.freeTextVal) &&
          !ObjectUtil.isEmpty(this.freeTextVal.samparkaAdhikrit) ?
          this.freeTextVal.samparkaAdhikrit : ';Dks{ clws[t',
      samparkaPrabandhak: !ObjectUtil.isEmpty(this.freeTextVal) &&
          !ObjectUtil.isEmpty(this.freeTextVal.samparkaPrabandhak) ?
          this.freeTextVal.samparkaPrabandhak : ';Dks{ k|aGws',
      basicFreeText: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.basicFreeText) ?
          this.freeTextVal.basicFreeText : '',
      witnessDistrict: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessDistrict) ?
          this.freeTextVal.witnessDistrict : '',
      witnessMunicipality: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessMunicipality) ?
          this.freeTextVal.witnessMunicipality : '',
      WitnessWardNumber: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.WitnessWardNumber) ?
          this.freeTextVal.WitnessWardNumber : '',
      witnessAge: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessAge) ?
          this.freeTextVal.witnessAge : '',
      witnessName: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessName) ?
          this.freeTextVal.witnessName : '',
      witnessDistrict2: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessDistrict2) ?
          this.freeTextVal.witnessDistrict2 : '',
      witnessMunicipality2: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessMunicipality2) ?
          this.freeTextVal.witnessMunicipality2 : '',
      WitnessWardNumber2: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.WitnessWardNumber2) ?
          this.freeTextVal.WitnessWardNumber2 : '',
      witnessAge2: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessAge2) ?
          this.freeTextVal.witnessAge2 : '',
      witnessName2: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.witnessName2) ?
          this.freeTextVal.witnessName2 : '',
      bankStaff: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.bankStaff) ?
          this.freeTextVal.bankStaff : '',
      date: !ObjectUtil.isEmpty(this.freeTextVal) &&
      !ObjectUtil.isEmpty(this.freeTextVal.date) ?
          this.freeTextVal.date : '',
      otherBank: this.tempData.TdHolding ? this.tempData.TdHolding.ct : ''
    });
  }

  getHolderDetails() {
    if (!ObjectUtil.isEmpty(this.tempData)) {
      if (!ObjectUtil.isEmpty(this.tempData.tdHolderNames)) {
        const len = this.tempData.tdHolderNames[0].tdholderNames;
        if (len.length > 0) {
          if (len.length === 1) {
            const temp = len[0].TdHolderCT;
            this.holderFinalName = temp;
          } else if (len.length === 2) {
            for (let i = 0; i < len.length; i++) {
              const temp = len[i].TdHolderCT;
              this.holderNames.push(temp);
            }
            this.allHolderNames = this.holderNames.join(' र ');
            this.holderFinalName = this.allHolderNames;
          } else {
            for (let i = 0; i < len.length - 1; i++) {
              const temp = len[i].TdHolderCT;
              this.holderNames.push(temp);
            }
            this.allHolderNames = this.holderNames.join(' , ');
            const temp1 = len[len.length - 1].TdHolderCT;
            this.holderFinalName = this.allHolderNames + ' र ' + temp1;
          }
        }
      }
    }
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    // this.form.get('selectedSecurity').patchValue(this.selectedSecurity);
    this.form.get('naturalPersonCheck').patchValue(this.isNatural);
    // this.form.get('renewalChecked').patchValue(this.renewal);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.CLASS_A)
            .toString()) {
          offerLetterPath.supportedInformation = this.setFreeText();
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CLASS_A);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      offerDocument.supportedInformation = this.setFreeText();
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.afterSave = false;
    });
  }
  close() {
    this.ref.close();
  }
  setFreeText() {
    const free = {
      additionalCostumerDetails: this.form.get('additionalCostumerDetails').value,
      tableFreeText: this.form.get('tableFreeText').value,
      additionalFreeTextBox: this.form.get('additionalFreeTextBox').value,
      applicableFreeTextBox: this.form.get('applicableFreeTextBox').value,
      samparkaAdhikrit: this.form.get('samparkaAdhikrit').value,
      samparkaPrabandhak: this.form.get('samparkaPrabandhak').value,
      basicFreeText: this.form.get('basicFreeText').value,
      customerName: this.form.get('customerName').value,
      accountNumber: this.form.get('accountNumber').value,
      witnessDistrict: this.form.get('witnessDistrict').value,
      witnessMunicipality: this.form.get('witnessMunicipality').value,
      WitnessWardNumber: this.form.get('WitnessWardNumber').value,
      witnessAge: this.form.get('witnessAge').value,
      witnessName: this.form.get('witnessName').value,
      witnessDistrict2: this.form.get('witnessDistrict2').value,
      witnessMunicipality2: this.form.get('witnessMunicipality2').value,
      WitnessWardNumber2: this.form.get('WitnessWardNumber2').value,
      witnessAge2: this.form.get('witnessAge2').value,
      witnessName2: this.form.get('witnessName2').value,
      bankStaff: this.form.get('bankStaff').value,
      date: this.form.get('date').value,
    };
    return JSON.stringify(free);
  }
}
