import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CustomerType} from '../../../../customer/model/customerType';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {District} from '../../../../admin/modal/district';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {DatePipe} from '@angular/common';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CustomerService} from '../../../../customer/service/customer.service';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';

@Component({
  selector: 'app-letter-of-set-off',
  templateUrl: './letter-of-set-off.component.html',
  styleUrls: ['./letter-of-set-off.component.scss']
})
export class LetterOfSetOffComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() preview;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() nepaliAmount: NepaliNumberAndWords;
  offerDocument: Array<OfferDocument>;
  initialInformation: any;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  letterOfSetOff: FormGroup;
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];

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
    this.checkOfferLetterData();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.letterOfSetOff.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.offerDocument = this.cadData.offerDocumentList;
      this.offerDocument.forEach(offerDocument => {
        this.initialInformation = JSON.parse(offerDocument.initialInformation);
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
    this.letterOfSetOff = this.formBuilder.group({
      date: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      district: [undefined],
      vdc: [undefined],
      wardNo: [undefined],
      age: [undefined],
      daughterName: [undefined],
      nameOfCustomer: [undefined],
      citizenshipNo: [undefined],
      dateOfIssue: [undefined],
      identifyIssuedDistrictName: [undefined],
      actDetails: [undefined],
      actYearFigure: [undefined],
      nameOfDepartment: [undefined],
      dateOfRegistration: [undefined],
      registrationNo: [undefined],
      nameOfUnit:  [undefined],
      grandDaughterName: [undefined],
      nameOfWife: [undefined],
      grandSonName: [undefined],
      sonName: [undefined],
      nameOfSon: [undefined],
      nameOfBorrower: [undefined],
      nameOfBranch: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountFigure: [undefined],
      loanAmountWord: [undefined],
      accountNo: [undefined],
      nameOfTd: [undefined],
      fixedDeposit: [undefined],
      purposeOfLoan: [undefined],
      numberOfPerson: [undefined],
      sakshiDistrict: [undefined],
      sakshiVdc: [undefined],
      sakshiWardNo: [undefined],
      sakshiAge: [undefined],
      nameOfWitness: [undefined],
      nameOfWitnessFromBank: [undefined],
      jointDetailsArr: this.formBuilder.array([]),
    });
  }

  fillform() {
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
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
    let dateOfApproval;
    if (!ObjectUtil.isEmpty(this.educationalTemplateData)) {
      const selectedDateType = this.educationalTemplateData.dateOfApprovalType ? this.educationalTemplateData.dateOfApprovalType.en : '';
      if (selectedDateType === 'AD') {
        const tempData = this.datePipe.transform(this.educationalTemplateData.dateOfApproval.en);
        dateOfApproval = this.engToNepaliDate.transform(tempData, true);
      } else {
        dateOfApproval = this.educationalTemplateData.dateOfApprovalNepali.en.nDate;
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInformation.accountNumber)) {
      this.letterOfSetOff.get('accountNo').patchValue(this.initialInformation.accountNumber.ct);
    }
    if (!ObjectUtil.isEmpty(this.initialInformation.bankName)) {
      this.letterOfSetOff.get('nameOfTd').patchValue(this.initialInformation.bankName.ct);
    }
    if (!ObjectUtil.isEmpty(this.initialInformation.tenureDepositReceiptNumber)) {
      this.letterOfSetOff.get('fixedDeposit').patchValue(this.initialInformation.tenureDepositReceiptNumber.ct);
    }
      this.letterOfSetOff.patchValue(
        {
          nameOfBranch: this.individualData.branch.ct ?
              this.individualData.branch.ct : '',
          grandFatherName: this.getGrandFatherName(),
          fatherName: this.getFatherName(),
          identifyIssuedDistrictName: this.individualData.citizenshipIssueDistrict.ct ?
              this.individualData.citizenshipIssueDistrict.ct : '',
          dateOfIssue: citizenshipIssuedDate ? citizenshipIssuedDate : '',
          citizenshipNo: this.individualData.citizenshipNo ?
              this.individualData.citizenshipNo.ct : '',
          wardNo: this.individualData.permanentWard.ct ?
              this.individualData.permanentWard.ct : '',
          vdc: this.individualData.permanentMunicipality.ct ?
              this.individualData.permanentMunicipality.ct : '',
          district: this.individualData.permanentDistrict.ct ?
              this.individualData.permanentDistrict.ct : '',
          nameOfCustomer: this.individualData.name.ct ?
              this.individualData.name.ct : '',
          age: age ? age : '',
          numberOfPerson: this.engToNepNumberPipe.transform(length.toString()) ? this.engToNepNumberPipe.transform(length.toString()) : '',
          loanAmountFigure: finalAmount,
          loanAmountWord: loanAmountWord,
          purposeOfLoan: this.educationalTemplateData ?
              this.educationalTemplateData.purposeOfLoan ?
                  this.educationalTemplateData.purposeOfLoan.ct : this.educationalTemplateData.purposeOfLoan.np : '',
          sanctionLetterIssuedDate: dateOfApproval ? dateOfApproval : '',
          // sanctionLetterIssuedDate: this.educationalTemplateData.sanctionLetterIssuedDate.ct ?
          //     this.educationalTemplateData.sanctionLetterIssuedDate.ct : this.educationalTemplateData.sanctionLetterIssuedDate.np,
          // nameOfTd: this.educationalTemplateData.nameOfTd.ct ?
          //     this.educationalTemplateData.nameOfTd.ct : this.educationalTemplateData.nameOfTd.np,
          // fixedDeposit: this.educationalTemplateData.fixedDeposit.ct ?
          //     this.educationalTemplateData.fixedDeposit.ct : this.educationalTemplateData.fixedDeposit.np

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
    const yr = Math.abs(Math.round(diff / 365.25));
    return this.engToNepNumberPipe.transform(yr.toString());
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
        this.initialInfoPrint = cadFile.initialInformation;
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
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
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.letterOfSetOff.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.letterOfSetOff.get(wordLabel).patchValue(returnVal);
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
    const formArray = (this.letterOfSetOff.get('jointDetailsArr') as FormArray);
    if (ObjectUtil.isEmpty(data)) {
      return;
    }
    data.forEach(value => {
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
        districtJoint : [nepData.permanentDistrict ? nepData.permanentDistrict.ct : ''],
        vdcJoint : [nepData.permanentMunicipality ? nepData.permanentMunicipality.ct : ''],
        wardNoJoint : [nepData.permanentWard ? nepData.permanentWard.ct : ''],
        ageJoint : [age ? age : ''],
        nameofPersonJoint : [nepData.name ? nepData.name.ct : ''],
        citizenshipNoJoint : [nepData.citizenNumber ? nepData.citizenNumber.ct : ''],
        dateofIssueJoint : [citizenshipIssuedDate ? citizenshipIssuedDate : ''],
        nameofIssuedDistrictJoint : [nepData.citizenshipIssueDistrict ? nepData.citizenshipIssueDistrict.en.nepaliName : ''],
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
          this.educationalTemplateData = educationalOfferData;
        }
      }
      if (documentName === 'Personal Overdraft') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData;
        }
      }
      if (documentName === 'Personal Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData;
        }
      }
      // this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString() === this.offerDocumentChecklist.value(this.offerDocumentChecklist.EDUCATIONAL).toString())[0];
      // if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
      //   const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
      //   this.educationalTemplateData = educationalOfferData;
      // }
    }
  }

  async getJointInfoData() {
    if (this.cadData.loanHolder.customerType === this.customerType.INDIVIDUAL
        && this.clientType === this.customerSubType.JOINT.toUpperCase()) {
      const associateId = this.cadData.loanHolder.associateId;
      await this.customerService.getJointInfoDetails(associateId).toPromise().then((res: any) => {
        this.jointInfoData = JSON.parse(res.detail.jointInfo);
      }, error => {
        console.error(error);
      });
    }
  }
}