import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../../../admin/modal/nabil-document-checklist.enum';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerType} from '../../../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../../../customer/model/customerSubType';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {CustomerService} from '../../../../../../customer/service/customer.service';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {AgeCalculation} from '../../../../../../../@core/age-calculation';
import {CadFile} from '../../../../../model/CadFile';
import {Document} from '../../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {NepaliNumberAndWords} from '../../../../../model/nepaliNumberAndWords';

@Component({
  selector: 'app-power-of-attorney-proprietorship',
  templateUrl: './power-of-attorney-proprietorship.component.html',
  styleUrls: ['./power-of-attorney-proprietorship.component.scss']
})
export class PowerOfAttorneyProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  form: FormGroup;
  nepData;
  initialInfo;
  supportedInfo;
  finalAmount;
  loanAmountWord;
  sanctionDate;
  combinedAddress;
  issueDate = [];
  tempProprietor;
  proprietor;
  companyInfo;
  authorizedNameArray: Array<any> = new Array<any>();
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              public datePipe: DatePipe,
              public engToNepaliDate: EngNepDatePipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe, ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
      this.companyInfo = JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData);
      this.companyInfo.forEach(val => {
        if (val.isAuthorizedPerson === 'Authorized Person Only' || val.isAuthorizedPerson === 'Both') {
          const authorizedName = val.ownerNameCT;
          this.authorizedNameArray.push(authorizedName);
        } else {
          const authorizedName = '';
          this.authorizedNameArray.push(authorizedName);
        }
      });
      this.dateConvert();
    }
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.tempProprietor = JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData);
    this.patchFreeText();
    this.fillForm();
    // this.ProprietorDetails();
  }
  // ProprietorDetails() {
  //   for (const i of this.tempProprietor) {
  //     if (i.radioOwnerCitizenshipIssuedDate === 'AD') {
  //       this.citizenshipIssueDate = this.engToNepaliDate.transform(i.ownerCitizenshipIssuedDateCT, true);
  //     } else {
  //       this.citizenshipIssueDate = i.ownerCitizenshipIssuedDateCT;
  //     }
  //     this.form.patchValue({
  //       nameOfProprietor: i.ownerNameCT ? i.ownerNameCT : '',
  //       proprietorDistrict: i.ownerPermanentDistrictCT ? i.ownerPermanentDistrictCT : '',
  //       proprietorMunicipality: i.ownerPermanentMunicipalityCT ? i.ownerPermanentMunicipalityCT : '',
  //       proprietorWardNo: i.ownerPermanentWardNoCT ? i.ownerPermanentWardNoCT : '',
  //       nameOfIdentityIssuedDistrict: i.ownerCitizenshipIssuedDistrictCT ? i.ownerCitizenshipIssuedDistrictCT : '',
  //     });
  //     if (i.ownerTemporaryMunicipality.municipalityType === 'RURAL_MUNICIPALITY') {
  //       this.nagarpalika = true;
  //     }
  //   }
  // }
  dateConvert() {
    let date;
    this.companyInfo.forEach(val => {
      if (val.radioOwnerCitizenshipIssuedDate === 'AD') {
        date = this.engToNepaliDate.transform(val ?
            val.ownerCitizenshipIssuedDateCT : val.ownerCitizenshipIssuedDateCT, true) || '';
      } else {
        date = val ? val.ownerCitizenshipIssuedDateCT : '';
      }
      const newDate = {
        issueDate : date
      };
      this.issueDate.push(newDate);
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      nameOfBranchLocated: [undefined],
      nameOfAuthorizedBody: [undefined],
      // Firm Details
      proprietorDistrict: [undefined],
      proprietorMunicipality: [undefined],
      proprietorWardNo: [undefined],
      addressOfFirm: [undefined],
      nameOfBorrower: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      addressOfBorrower: [undefined],
      nameOfProprietor: [undefined],
      citizenshipNo: [undefined],
      nameOfIdentityIssuedDistrict: [undefined],
      nameOfBorrowerFirm: [undefined],
      addressOfBorrowerFirm: [undefined],
      districtOfFirm: [undefined],
      municipalityOfFirm: [undefined],
      wardNoOfFirm: [undefined],
      // Free text
      // Witness Fields
      bankStaff: [undefined],
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
    });
  }

  setFreeText() {
    const free1 = {
      date: this.form.get('date') ? this.form.get('date').value : '',
      witnessDistrict: this.form.get('witnessDistrict') ? this.form.get('witnessDistrict').value : '',
      witnessMunicipality: this.form.get('witnessMunicipality') ? this.form.get('witnessMunicipality').value : '',
      WitnessWardNumber: this.form.get('WitnessWardNumber') ? this.form.get('WitnessWardNumber').value : '',
      witnessAge: this.form.get('witnessAge') ? this.form.get('witnessAge').value : '',
      witnessName: this.form.get('witnessName') ? this.form.get('witnessName').value : '',
      witnessDistrict2: this.form.get('witnessDistrict2') ? this.form.get('witnessDistrict2').value : '',
      witnessMunicipality2: this.form.get('witnessMunicipality2') ? this.form.get('witnessMunicipality2').value : '',
      WitnessWardNumber2: this.form.get('WitnessWardNumber2') ? this.form.get('WitnessWardNumber2').value : '',
      witnessAge2: this.form.get('witnessAge2') ? this.form.get('witnessAge2').value : '',
      witnessName2: this.form.get('witnessName2') ? this.form.get('witnessName2').value : '',
      bankStaff: this.form.get('bankStaff') ? this.form.get('bankStaff').value : '',
    };
    return JSON.stringify(free1);
  }
  patchFreeText() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
        }
      });
    }
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        // cadFile.initialInformation = JSON.stringify(this.form.value);
        this.initialInfoPrint = cadFile.initialInformation;
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
      this.initialInfoPrint = cadFile.initialInformation;
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }
    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }

  fillForm() {
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
          this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
        } else {
          this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
        }
      }
      if (this.cadData.offerDocumentList[0].docName !== 'DDSL Without Subsidy' &&
          this.cadData.offerDocumentList[0].docName !== 'Combined Offer Letter' &&
          this.cadData.offerDocumentList[0].docName !== 'Class A Sanction letter') {
        const dateOfApproval = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.ct : '';
        } else {
          this.sanctionDate = this.initialInfo.dateOfApprovalNepali ? this.initialInfo.dateOfApprovalNepali.ct : '';
        }
      }
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        const dateOfApproval = this.initialInfo.smeGlobalForm.dateOfApprovalType ?
            this.initialInfo.smeGlobalForm.dateOfApprovalType : '';
        if (dateOfApproval === 'AD') {
          this.sanctionDate = this.engToNepaliDate.transform(this.initialInfo.smeGlobalForm.dateOfApproval ?
              this.initialInfo.smeGlobalForm.dateOfApprovalCT : '', true);
        } else {
          this.sanctionDate = this.initialInfo.smeGlobalForm.dateOfApprovalNepali ?
              this.initialInfo.smeGlobalForm.dateOfApprovalNepali.nDate : '';
        }
      }
    }
    if (!ObjectUtil.isEmpty(this.individualData)) {
      this.combinedAddress = (this.individualData.registeredDistrict ? this.individualData.registeredDistrict.ct : '') +
          ',' + (this.individualData.registeredMunicipality ? this.individualData.registeredMunicipality.ct : '') + ',' +
          (this.individualData.permanentWard ? this.individualData.permanentWard.ct : '');
    }

    this.form.patchValue({
      nameOfBranchLocated: this.individualData.branch ? this.individualData.branch.ct : '',
      nameOfAuthorizedBody: this.individualData.authorizedBodyName ? this.individualData.authorizedBodyName.ct : '',
      addressOfFirm: this.individualData.registeredStreetTole ? this.individualData.registeredStreetTole.ct : '',
      districtOfFirm: this.individualData.registeredDistrict ? this.individualData.registeredDistrict.ct : '',
      municipalityOfFirm: this.individualData.registeredMunicipality ? this.individualData.registeredMunicipality.ct : '',
      wardNoOfFirm: this.individualData.permanentWard ? this.individualData.permanentWard.ct : '',
      nameOfBorrower: this.individualData.name ? this.individualData.name.ct : '',
      loanAmountInFigure: this.finalAmount ? this.finalAmount : '',
      loanAmountInWords: this.loanAmountWord ? this.loanAmountWord : '',
      sanctionLetterIssuedDate: this.sanctionDate ? this.sanctionDate : '',
      freeText1: this.supportedInfo ? this.supportedInfo.freeText1 : '',
      addressOfBorrower: this.combinedAddress ? this.combinedAddress : '',
      witnessDistrict: this.supportedInfo ? this.supportedInfo.witnessDistrict : '',
      witnessMunicipality: this.supportedInfo ? this.supportedInfo.witnessMunicipality : '',
      WitnessWardNumber: this.supportedInfo ? this.supportedInfo.WitnessWardNumber : '',
      witnessAge: this.supportedInfo ? this.supportedInfo.witnessAge : '',
      witnessName: this.supportedInfo ? this.supportedInfo.witnessName : '',
      witnessDistrict2: this.supportedInfo ? this.supportedInfo.witnessDistrict2 : '',
      witnessMunicipality2: this.supportedInfo ? this.supportedInfo.witnessMunicipality2 : '',
      WitnessWardNumber2: this.supportedInfo ? this.supportedInfo.WitnessWardNumber2 : '',
      witnessAge2: this.supportedInfo ? this.supportedInfo.witnessAge2 : '',
      witnessName2: this.supportedInfo ? this.supportedInfo.witnessName2 : '',
      bankStaff: this.supportedInfo ? this.supportedInfo.bankStaff : '',
      date: this.supportedInfo ? this.supportedInfo.date : '',
    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}
