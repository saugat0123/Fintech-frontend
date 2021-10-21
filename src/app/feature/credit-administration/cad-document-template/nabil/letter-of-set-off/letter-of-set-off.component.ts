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
    });
  }

  fillform() { let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    let citizenshipIssuedDate;
    if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDate.en.nDate)) {
      citizenshipIssuedDate = this.individualData.citizenshipIssueDate.en.nDate;
    } else {
      const convertedDate = this.datePipe.transform(this.individualData.citizenshipIssueDate.en);
      citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
    }
    let age;
    if (!ObjectUtil.isEmpty(this.individualData.dob) && !ObjectUtil.isEmpty(this.individualData.dob.en.eDate)) {
      const calAge = AgeCalculation.calculateAge(this.individualData.dob.en.eDate);
      // age = this.engToNepNumberPipe.transform(String(calAge));
      age = this.ageCalculation(this.individualData.dob.en.eDate);
    } else {
      // const calAge = AgeCalculation.calculateAge(this.individualData.dob.en);
      // age = this.engToNepNumberPipe.transform(String(calAge));
      age = this.ageCalculation(this.individualData.dob.en);
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
    const tempApprDate = this.educationalTemplateData.dateOfApproval ? this.educationalTemplateData.dateOfApproval.en : '';
    let dateOfApproval;
    if (!ObjectUtil.isEmpty(tempApprDate)) {
      if (!ObjectUtil.isEmpty(tempApprDate.nDate)) {
        dateOfApproval = tempApprDate.nDate;
      } else  {
        const tempData = this.datePipe.transform(tempApprDate);
        dateOfApproval = this.engToNepaliDate.transform(tempData, true);
      }
    }
    this.letterOfSetOff.patchValue(
        {
          nameOfBranch: this.individualData.branch.ct ?
              this.individualData.branch.ct : '',
          grandFatherName: this.individualData.grandFatherName.ct ?
              this.individualData.grandFatherName.ct : '',
          fatherName: !ObjectUtil.isEmpty(this.individualData.fatherName) && this.individualData.fatherName.ct ?
              this.individualData.fatherName.ct : this.individualData.fatherInLawName ?
                  this.individualData.fatherInLawName.ct : '',
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
          purposeOfLoan: this.educationalTemplateData.purposeOfLoan.ct ?
              this.educationalTemplateData.purposeOfLoan.ct : this.educationalTemplateData.purposeOfLoan.np,
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
      this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
          === this.offerDocumentChecklist.value(this.offerDocumentChecklist.EDUCATIONAL).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
        this.educationalTemplateData = educationalOfferData;
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
        console.error(error);
      });
    }
  }
}
