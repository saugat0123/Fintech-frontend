import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CustomerService} from '../../../../customer/service/customer.service';
import {OfferDocument} from '../../../model/OfferDocument';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';

@Component({
  selector: 'app-promissory-note-individual',
  templateUrl: './promissory-note-individual.component.html',
  styleUrls: ['./promissory-note-individual.component.scss']
})
export class PromissoryNoteIndividualComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  form: FormGroup;
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;
  jointNepData;
  spinner = false;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  tempData: any;

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
    }
    await this.getJointInfoData();
    this.fillform();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      loanamountinFigure: [undefined],
      loanamountinWords: [undefined],
      loanamountinFigureOd: [undefined],
      loanamountinWordsOd: [undefined],
      nameofGrandFather: [undefined],
      nameofFather: [undefined],
      district: [undefined],
      vdc: [undefined],
      wardNo: [undefined],
      age: [undefined],
      nameofPerson: [undefined],
      citizenshipNo: [undefined],
      dateofIssue: [undefined],
      nameofIssuedDistrict: [undefined],
      totalPeople: [undefined],
      sakshiDistrict: [undefined],
      sakshiVdc: [undefined],
      sakshiWardNo: [undefined],
      sakshiAge: [undefined],
      nameofWitness: [undefined],
      interest: [undefined],
      interestOd: [undefined],
      sakshiDistrict1: [undefined],
      sakshiVdc1: [undefined],
      sakshiWardNo1: [undefined],
      sakshiAge1: [undefined],
      nameofWitness1: [undefined],
      nameofBranchLocated: [undefined],
      signature: [undefined],
      nameofStaff: [undefined],
      loanHolderName: [undefined],
      jointDetailsArr: this.formBuilder.array([]),
      signatureData: this.formBuilder.array([]),
    });
  }
  fillform() {
    this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.tempData.loanAmountPl ? this.tempData.loanAmountPl.ct : this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.tempData.loanAmountPlInWords ? this.tempData.loanAmountPlInWords.ct : this.nepaliCurrencyWordPipe.transform(totalLoan);
    let citizenshipIssuedDate;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.issuedDate) &&
        !ObjectUtil.isEmpty(this.individualData.issuedDate.en)) {
      if (this.individualData.issuedDate.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDate)) {
          const convertedDate = this.datePipe.transform(this.individualData.citizenshipIssueDate.en);
          citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
        }
      } else {
        if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDateNepali)) {
          citizenshipIssuedDate = this.individualData.citizenshipIssueDateNepali.en.nDate;
        }
      }
    }
    /*if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDate.en.nDate)) {
      citizenshipIssuedDate = this.individualData.citizenshipIssueDate.en.nDate;
    } else {
      const convertedDate = this.datePipe.transform(this.individualData.citizenshipIssueDate.en);
      citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
    }*/
    let age;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType.en)) {
      if (this.individualData.dobDateType.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.individualData.dob)) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dob.en).toString());
        }
      } else {
        if (!ObjectUtil.isEmpty(this.individualData.dobNepali)) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dobNepali.en.eDate).toString());
        }
      }
      /*if (!ObjectUtil.isEmpty(this.individualData.dob) && !ObjectUtil.isEmpty(this.individualData)) {
        if (this.individualData.dob.en.eDate === undefined) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dob.en).toString());
        } else {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dob.en.eDate).toString());
        }
      }*/
    }
    // if (!ObjectUtil.isEmpty(this.individualData.dob) && !ObjectUtil.isEmpty(this.individualData.dob.en.eDate)) {
    //   const calAge = AgeCalculation.calculateAge(this.individualData.dob.en.eDate);
    //   // age = this.engToNepNumberPipe.transform(String(calAge));
    //   age = this.ageCalculation(this.individualData.dob.en.eDate);
    // } else {
    //   // const calAge = AgeCalculation.calculateAge(this.individualData.dob.en);
    //   // age = this.engToNepNumberPipe.transform(String(calAge));
    //   age = this.ageCalculation(this.individualData.dob.en);
    // }
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
      this.setSignatureData(this.selectiveArr);
    }
    this.checkOfferLetterData();
    this.form.patchValue(
        {
          nameofBranchLocated: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.branch) &&
              !ObjectUtil.isEmpty(this.individualData.branch.ct)) ? this.individualData.branch.ct : '',
          nameofGrandFather: this.getGrandFatherName(),
          nameofFather: this.getFatherName(),
          nameofIssuedDistrict: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipIssueDistrict) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipIssueDistrict.ct)) ? this.individualData.citizenshipIssueDistrict.ct : '',
          dateofIssue: citizenshipIssuedDate ? citizenshipIssuedDate : '',
          citizenshipNo: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipNo) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipNo.ct)) ? this.individualData.citizenshipNo.ct : '',
          nameofPerson: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.name) &&
              !ObjectUtil.isEmpty(this.individualData.name.ct)) ? this.individualData.name.ct : '',
          wardNo: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentWard) &&
              !ObjectUtil.isEmpty(this.individualData.permanentWard.ct)) ? this.individualData.permanentWard.ct : '',
          vdc: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentMunicipality) &&
              !ObjectUtil.isEmpty(this.individualData.permanentMunicipality.ct)) ? this.individualData.permanentMunicipality.ct : '',
          district: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentDistrict) &&
              !ObjectUtil.isEmpty(this.individualData.permanentDistrict.ct)) ? this.individualData.permanentDistrict.ct : '',
          loanamountinFigure: finalAmount,
          loanamountinWords: loanAmountWord,
          age: age ? age : '',
          totalPeople: this.engToNepNumberPipe.transform(length.toString()) ? this.engToNepNumberPipe.transform(length.toString()) : '',
          interest: (this.educationalTemplateData && this.educationalTemplateData.ct) ? (this.educationalTemplateData.ct) : ((this.educationalTemplateData) ? (this.educationalTemplateData) : ('')),
          loanamountinFigureOd: this.tempData.loanAmountOd ? this.tempData.loanAmountOd.ct : '',
          loanamountinWordsOd: this.tempData.loanAmountOdInWords ? this.tempData.loanAmountOdInWords.ct : '',
          interestOd: this.tempData.yearlyInterestRateOd ? this.tempData.yearlyInterestRateOd.ct : '',
        }
    );
  }

  getGrandFatherName() {
    let grandFatherName;
    if (!ObjectUtil.isEmpty(this.individualData)) {
      if (this.individualData.gender.en === 'MALE') {
        grandFatherName = this.individualData.grandFatherName ? this.individualData.grandFatherName.ct : '';
      }
      if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '0') {
        grandFatherName = this.individualData.fatherInLawName ? this.individualData.fatherInLawName.ct : '';
      }
      if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '1') {
        grandFatherName = this.individualData.grandFatherName ? this.individualData.grandFatherName.ct : '';
      }
    }
    return grandFatherName;
  }

  getFatherName() {
    let fatherName;
    if (!ObjectUtil.isEmpty(this.individualData)) {
      if (this.individualData.gender.en === 'MALE') {
        fatherName = this.individualData.fatherName ? this.individualData.fatherName.ct : '';
      }
      if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '0') {
        fatherName = this.individualData.husbandName ? this.individualData.husbandName.ct : '';
      }
      if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '1') {
        fatherName = this.individualData.fatherName ? this.individualData.fatherName.ct : '';
      }
    }
    return fatherName;
  }

  ageCalculation(startDate) {
    startDate = this.datePipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
    const stDate = new Date(startDate);
    const endDate = new Date();
    let diff = (endDate.getTime() - stDate.getTime()) / 1000;
    diff = diff / (60 * 60 * 24);
    const yr = Math.abs(Math.round(diff / 365));
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
      let age;
      if (!ObjectUtil.isEmpty(nepData.dob) && !ObjectUtil.isEmpty(nepData.dob.en.eDate)) {
        const calAge = AgeCalculation.calculateAge(nepData.dob.en.eDate);
        age = this.ageCalculation(nepData.dob.en.eDate);
      } else {
        age = this.ageCalculation(nepData.dob.en);
      }
      let citizenshipIssuedDate;
      if (!ObjectUtil.isEmpty(nepData.citizenshipIssueDate.en.nDate)) {
        citizenshipIssuedDate = nepData.citizenshipIssueDate.en.nDate;
      } else {
        const convertedDate = this.datePipe.transform(nepData.citizenshipIssueDate.en);
        citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
      }
      formArray.push(this.formBuilder.group({
        nameofGrandFatherJoint : [nepData.grandFatherName ?
            nepData.grandFatherName.ct :
            nepData.fatherInLawName ? nepData.fatherInLawName.ct : ''],
        nameofFatherJoint : [ nepData.fatherName ?
            nepData.fatherName.ct :
            nepData.husbandName ? nepData.husbandName.ct : ''],
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

  buildSetSignature() {
    return this.formBuilder.group({
      loanHolderNameJoint : [undefined],
    });
  }

  setSignatureData(data) {
    const formArray = (this.form.get('signatureData') as FormArray);
    data.forEach(value => {
      const nepData = value;
      formArray.push(this.formBuilder.group({
        loanHolderNameJoint : [nepData.name ? nepData.name.ct : ''],
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
      if (documentName === 'Educational Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Personal Overdraft') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.yearlyInterestRate;
        }
      }
      if (documentName === 'Personal Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.yearlyFloatingInterestRate;
        }
      }
      if (documentName === 'Home Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.loan.interestRateCT;
        }
      }
      if (documentName === 'Mortage Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate.ct;
        }
      }
      if (documentName === 'Auto Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.yearlyInterestRate.ct;
        }
      }
      if (documentName === 'Udyamsil Karja Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate ?
              educationalOfferData.interestRate.ct : '';
        }
      }
      if (documentName === 'Personal overdraft without collateral') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.yearlyInterestRate ?
              educationalOfferData.yearlyInterestRate.ct : '';
        }
      }
      if (documentName === 'Personal loan and personal overdraft') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.yearlyInterestRate ?
              educationalOfferData.yearlyInterestRate.ct : '';
        }
      }
      if (documentName === 'DDSL Without Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate ?
              educationalOfferData.interestRate.ct : '';
        }
      }

      if (documentName === 'Interest subsidy sanction letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate ?
              educationalOfferData.interestRate.ct : '';
        }
      }
      // this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
      //     === this.offerDocumentChecklist.value(this.offerDocumentChecklist.EDUCATIONAL).toString())[0];
      // if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
      //   const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
      //   this.educationalTemplateData = educationalOfferData.interestRate;
      // }
    }
  }

  async getJointInfoData() {
    if (this.cadData.loanHolder.customerType === this.customerType.INDIVIDUAL
        && this.clientType === this.customerSubType.JOINT.toUpperCase()) {
      const associateId = this.cadData.loanHolder.associateId;
      this.spinner = true;
      await this.customerService.getJointInfoDetails(associateId).toPromise().then((res: any) => {
        this.jointInfoData = JSON.parse(res.detail.jointInfo);
        this.spinner = false;
      }, error => {
        console.log(error);
        this.spinner = false;
      });
    }
  }
}
