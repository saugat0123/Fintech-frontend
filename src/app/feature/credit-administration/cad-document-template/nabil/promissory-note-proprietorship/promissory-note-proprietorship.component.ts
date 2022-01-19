import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {CustomerService} from '../../../../customer/service/customer.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferDocument} from '../../../model/OfferDocument';

@Component({
  selector: 'app-promissory-note-proprietorship',
  templateUrl: './promissory-note-proprietorship.component.html',
  styleUrls: ['./promissory-note-proprietorship.component.scss']
})
export class PromissoryNoteProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  guarantorData;
  individualData;
  initialInfoPrint;
  customerAddress;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  form: FormGroup;
  guarantorNames: Array<String> = [];
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;
  companyInfo;
  loanHolderNepData: any;
  isInstitutional = false;
  tempProprietor;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              public datePipe: DatePipe,
              public engToNepaliDate: EngNepDatePipe,
              private customerService: CustomerService) { }

  async ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.loanHolder.customerType === 'INSTITUTION') {
        this.isInstitutional = true;
      }
      if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
        this.companyInfo = this.cadData.assignedLoan[0] ? JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData) : '';
      }
      this.guarantorData = this.cadData.assignedLoan[0].taggedGuarantors;
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];

      this.loanHolderNepData = this.cadData.loanHolder.nepData
          ? JSON.parse(this.cadData.loanHolder.nepData)
          : this.cadData.loanHolder.nepData;
      // this.customerAddress = this.tempProprietor[0].ownerPermanentProvinceCT + '-' +
      //     this.tempProprietor[0].ownerPermanentWardNoCT + ', ' + this.tempProprietor[0].ownerPermanentDistrictCT + ' ,' +
      //     this.tempProprietor[0].ownerPermanentProvinceCT;
    }
    await this.getJointInfoData();
    this.fillform();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      loanamountinFigure: [undefined],
      loanamountinWords: [undefined],
      actDetails: [undefined],
      actYear: [undefined],
      nameOfHead: [undefined],
      dateOfRegNepali: [undefined],
      dateOfReg: [undefined],
      regNo: [undefined],
      distictOfFirm: [undefined],
      nameOfFirm: [undefined],
      wardNo: [undefined],
      addressOfFirm: [undefined],
      firmName: [undefined],
      grandNameOfPro: [undefined],
      fatherNameOfPro: [undefined],
      districtOfPro: [undefined],
      vdcNameOfPro: [undefined],
      wardNoOfPro: [undefined],
      ageOfPro: [undefined],
      nameOfPro: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssueDate: [undefined],
      citizenshipIssueDistrict: [undefined],
      intRate: [undefined],
      branchName: [undefined],
      sakshiDistrict: [undefined],
      sakshiVdc: [undefined],
      sakshiWardNo: [undefined],
      sakshiAge: [undefined],
      nameofWitness: [undefined],
      sakshiDistrict1: [undefined],
      sakshiVdc1: [undefined],
      sakshiWardNo1: [undefined],
      sakshiAge1: [undefined],
      nameofWitness1: [undefined],
      nameofBankWitness: [undefined],
    });
  }
  fillform() {
    const proprietor = this.cadData.assignedLoan[0].companyInfo.companyJsonData;
    // let tempProprietor;
    if (!ObjectUtil.isEmpty(proprietor)) {
      this.tempProprietor = JSON.parse(proprietor);
    }
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    let citizenshipIssuedDate;
    if (!this.isInstitutional) {
      if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDate.en.nDate)) {
        citizenshipIssuedDate = this.individualData.citizenshipIssueDate.en.nDate;
      } else {
        const convertedDate = this.datePipe.transform(this.individualData.citizenshipIssueDate.en);
        citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
      }
    }
    let age;
    if (!this.isInstitutional) {
      if (!ObjectUtil.isEmpty(this.individualData.dob) && !ObjectUtil.isEmpty(this.individualData.dob.en.eDate)) {
        const calAge = AgeCalculation.calculateAge(this.individualData.dob.en.eDate);
        // age = this.engToNepNumberPipe.transform(String(calAge));
        age = this.ageCalculation(this.individualData.dob.en.eDate);
      } else {
        // const calAge = AgeCalculation.calculateAge(this.individualData.dob.en);
        // age = this.engToNepNumberPipe.transform(String(calAge));
        age = this.ageCalculation(this.individualData.dob.en);
      }
    }
    if (this.isInstitutional) {
      if (!ObjectUtil.isEmpty(this.tempProprietor[0].ownerDobDateType) && this.tempProprietor.length > 0) {
        if (this.tempProprietor[0].ownerDobDateType === undefined) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.tempProprietor[0].ownerDob).toString());
        } else {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.tempProprietor[0].ownerDob).toString());
        }
      }
    }


    let length = 1;
    if (!ObjectUtil.isEmpty(this.jointInfoData)) {
      length = this.jointInfoData.length;
      this.jointInfoData.forEach(value => {
        if (!ObjectUtil.isEmpty(value.nepData)) {
          const nep = JSON.parse(value.nepData);
          this.selectiveArr.push(nep);
        }
      });
      this.setJointDetailsArr(this.selectiveArr);
    }
    this.checkOfferLetterData();
    this.form.patchValue(
        {
          nameofBranchLocated: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
          actDetails: [this.loanHolderNepData.actName ? this.loanHolderNepData.actName.ct : ''],
          actYear: [this.loanHolderNepData.actYear ? this.loanHolderNepData.actYear.np : ''],
          nameOfHead : [this.loanHolderNepData.authorizedBodyName ? this.loanHolderNepData.authorizedBodyName.ct : ''],
          regNo: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo.np : ''],
          branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
          addressOfFirm: [this.loanHolderNepData.currentStreetTole ? this.loanHolderNepData.currentStreetTole.ct : ''],
          loanamountinFigure: finalAmount,
          loanamountinWords: loanAmountWord,
          fatherNameOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerFatherNameCT : '',
          firmName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.np : ''],
          grandNameOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerGrandFatherNameCT : '',
          districtOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentDistrictCT : '',
          vdcNameOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentMunicipalityCT : '',
          wardNoOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentWardNoCT : '',
          nameOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerNameCT : '',
          citizenshipNo: this.tempProprietor[0] ? this.tempProprietor[0].ownerCitizenshipNoCT : '',
          citizenshipIssueDistrict: this.tempProprietor[0] ? this.tempProprietor[0].ownerCitizenshipIssuedDistrictCT : '',
          intRate: this.tempProprietor[0] ? this.tempProprietor[0].ownerSharePercentageCT : '',
          nameOfFirm: [this.loanHolderNepData.currentMunicipality ? this.loanHolderNepData.currentMunicipality.ct : ''],
          wardNo: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
          vdc: [this.loanHolderNepData.municipalityVdc ? this.loanHolderNepData.municipalityVdc.ct : ''],
          distictOfFirm: [this.loanHolderNepData.issuingDistrict ? this.loanHolderNepData.issuingDistrict.ct : ''],
          loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(finalAmount)),
          loanAmountInWords: this.nepaliCurrencyWordPipe.transform(loanAmountWord),
          ageOfPro: age ? age : '',
        }
    );
  }

  ageCalculation(startDate) {
    startDate = this.datePipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
    const stDate = new Date(startDate);
    const endDate = new Date();
    let diff = (endDate.getTime() - stDate.getTime()) / 1000;
    diff = diff / (60 * 60 * 24);
    const yr = Math.abs(Math.round(diff / 365.25));
    return this.engToNepNumberPipe.transform(yr.toString());
  }
submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.initialInformation = JSON.stringify(this.form.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        this.initialInfoPrint = cadFile.initialInformation;
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
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  buildJointDetailsArr() {
    return this.formBuilder.group({
      nameofGrandFatherJoint : [undefined],
      nameofFatherJoint : [undefined],
      districtJoint : [undefined],
      vdcJoint : [undefined],
      wardNoJoint : [undefined],
      ageJoint : [undefined],
      nameofPersonJoint : [undefined],
      citizenshipNoJoint : [undefined],
      dateofIssueJoint : [undefined],
      nameofIssuedDistrictJoint : [undefined],
    });
  }

  setJointDetailsArr(data) {
    const formArray = (this.form.get('jointDetailsArr') as FormArray);
    if (ObjectUtil.isEmpty(data)) {
      return;
    }
    data.forEach(value => {
      // if (!ObjectUtil.isEmpty(value.nepData)) {
      //
      // }
      const nepData = value;
      const tempProprietor = value;
      let age;
      if (!ObjectUtil.isEmpty(tempProprietor.ownerDobCT) && !ObjectUtil.isEmpty(tempProprietor.radioOwnerDob)) {
        const calAge = AgeCalculation.calculateAge(tempProprietor.radioOwnerDob);
        age = this.ageCalculation(tempProprietor.radioOwnerDob);
      } else {
        age = this.ageCalculation(tempProprietor.radioOwnerDob);
      }
      let citizenshipIssuedDate;
      if (!ObjectUtil.isEmpty(nepData.citizenshipIssueDate.en.nDate)) {
        citizenshipIssuedDate = nepData.citizenshipIssueDate.en.nDate;
      } else {
        const convertedDate = this.datePipe.transform(nepData.citizenshipIssueDate.en);
        citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
      }
      formArray.push(this.formBuilder.group({
        nameofGrandFatherJoint : [nepData.grandFatherName.ct || nepData.grandFatherName.np],
        nameofFatherJoint : [nepData.fatherName.np || nepData.fatherName.ct],
        districtJoint : [nepData.permanentDistrict.ct],
        vdcJoint : [nepData.permanentMunicipality.ct],
        wardNoJoint : [nepData.permanentWard.np || nepData.permanentWard.ct],
        ageJoint : [age ? age : ''],
        nameofPersonJoint : [nepData.name.np || nepData.name.ct],
        citizenshipNoJoint : [nepData.citizenNumber.np || nepData.citizenNumber.ct],
        dateofIssueJoint : [citizenshipIssuedDate ? citizenshipIssuedDate : ''],
        nameofIssuedDistrictJoint : [nepData.citizenshipIssueDistrict.en.nepaliName],
      }));
    });
  }

  checkOfferLetterData() {
    if (this.cadData.offerDocumentList.length > 0) {
      let documentName;
      this.cadData.offerDocumentList.filter((document: OfferDocument) => {
        documentName = document.docName;
        this.offerLetterDocument = document;
      });
      if (documentName === 'DDSL Without Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Kisan Karja Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Udyamsil Karja Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Interest subsidy sanction letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Class A Sanction letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.importLoanTrust.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.revolvingShortTermLoan.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.demandLoanForm.interestRateCT;

        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.overdraftLoanForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.equityMortgaged.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.overdraftFixedForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.overDraftFacilityForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.bridgeGapLoan.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.termLoanForm.termLoanDetails.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.mortgageEquityTermForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.autoLoanMasterForm.autoLoanFormArray.interestRateCT;
        }
      }

      this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
          === this.offerDocumentChecklist.value(this.offerDocumentChecklist.EDUCATIONAL).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
        this.educationalTemplateData = educationalOfferData.interestRate;
      }
      console.log('loanholder nepdata:', this.loanHolderNepData);
      if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
        this.form.get('dateOfReg').patchValue(this.engToNepaliDate.transform(this.loanHolderNepData.registrationDate.en, true));
      } else {
        this.form.get('dateOfReg').patchValue(this.loanHolderNepData.registrationDate.np);
      }
      if (this.tempProprietor[0].radioOwnerCitizenshipIssuedDate === 'AD') {
        this.form.get('citizenshipIssueDate').patchValue(this.engToNepaliDate.transform(this.tempProprietor[0].ownerCitizenshipIssuedDateCT, true));
      } else {
        this.form.get('citizenshipIssueDate').patchValue(this.tempProprietor[0].ownerCitizenshipIssuedDateCT);
      }
    }
  }

  async getJointInfoData() {
    if (this.cadData.loanHolder.customerType === this.customerType.INDIVIDUAL
        && this.clientType === this.customerSubType.JOINT.toUpperCase()) {
      const associateId = this.cadData.loanHolder.associateId;
      await this.customerService.getJointInfoDetails(associateId).toPromise().then((res: any) => {
        this.jointInfoData = JSON.parse(res.detail.jointInfo);
      }, error => {
        console.log(error);
      });
    }
  }

}
