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
import {objectKeys} from 'codelyzer/util/objectKeys';

@Component({
  selector: 'app-promissory-note-individual-combined',
  templateUrl: './promissory-note-individual-combined.component.html',
  styleUrls: ['./promissory-note-individual-combined.component.scss']
})
export class PromissoryNoteIndividualCombinedComponent implements OnInit {
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
  freeText: Array<any> = new Array<any>();
  cadInitialInfo: any;

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
    if (!ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.loanHolder) &&
        !ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];
    }
    if (!ObjectUtil.isEmpty(this.cadData) &&
    !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].initialInformation)) {
        this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
    }
    await this.getJointInfoData();
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
        }
      });
    }
    this.fillform();
    this.fillGuarantee();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      promissoryNoteFormArray: this.formBuilder.array([])
    });
    this.setPromissoryFormArray();
  }
  setPromissoryFormArray() {
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
    }
    console.log('this.tempData:', this.tempData);
    console.log('Individual Data:', this.individualData);
    if (!ObjectUtil.isEmpty(this.cadData) &&
    !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.cadData.assignedLoan.forEach((val, i) => {
        (this.form.get('promissoryNoteFormArray') as FormArray).push(
            this.formBuilder.group({
              date: [undefined],
              loanamountinFigure: [!ObjectUtil.isEmpty(val.proposal) &&
              !ObjectUtil.isEmpty(val.proposal.proposedLimit) ? this.engToNepNumberPipe.transform(val.proposal.proposedLimit.toString()) : ''],
              loanamountinWords: [!ObjectUtil.isEmpty(val.proposal) &&
              !ObjectUtil.isEmpty(val.proposal.proposedLimit) ? this.nepaliCurrencyWordPipe.transform(val.proposal.proposedLimit) : ''],
              loanamountinFigureOd: [undefined],
              loanamountinWordsOd: [undefined],
              nameofGrandFather: [this.getGrandFatherName()],
              nameofFather: [this.getFatherName()],
              district: [!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentDistrict) &&
              !ObjectUtil.isEmpty(this.individualData.permanentDistrict.ct) ? this.individualData.permanentDistrict.ct : ''],
              vdc: [!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentMunicipality) &&
              !ObjectUtil.isEmpty(this.individualData.permanentMunicipality.ct) ? this.individualData.permanentMunicipality.ct : ''],
              wardNo: [!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentWard) &&
              !ObjectUtil.isEmpty(this.individualData.permanentWard.ct) ? this.individualData.permanentWard.ct : ''],
              age: [age ? age : ''],
              nameofPerson: [!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.name) &&
              !ObjectUtil.isEmpty(this.individualData.name.ct) ? this.individualData.name.ct : ''],
              citizenshipNo: [!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipNo) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipNo.ct) ? this.individualData.citizenshipNo.ct : ''],
              dateofIssue: [citizenshipIssuedDate ? citizenshipIssuedDate : ''],
              nameofIssuedDistrict: [!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipIssueDistrict) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipIssueDistrict.ct) ? this.individualData.citizenshipIssueDistrict.ct : ''],
              totalPeople: [length ? this.engToNepNumberPipe.transform(length.toString()) : ''],
              sakshiDistrict: [undefined],
              sakshiVdc: [undefined],
              sakshiWardNo: [undefined],
              sakshiAge: [undefined],
              nameofWitness: [undefined],
              interest: [this.getInterestRate(val)],
              sakshiDistrict1: [undefined],
              sakshiVdc1: [undefined],
              sakshiWardNo1: [undefined],
              sakshiAge1: [undefined],
              nameofWitness1: [undefined],
              nameofBranchLocated: [!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.branch) &&
              !ObjectUtil.isEmpty(this.individualData.branch.ct) ? this.individualData.branch.ct : ''],
              signature: [undefined],
              nameofStaff: [undefined],
              loanHolderName: [undefined],
              jointDetailsArr: this.formBuilder.array([]),
              signatureData: this.formBuilder.array([]),
            })
        );
      });
    }
  }
  getInterestRate (loanHolderData) {
    let interestRate: any;
    if (!ObjectUtil.isEmpty(loanHolderData) && !ObjectUtil.isEmpty(this.tempData)) {
      if (!ObjectUtil.isEmpty(loanHolderData.loan) && !ObjectUtil.isEmpty(loanHolderData.loan.name)) {
        const loanName = loanHolderData.loan.name;
        if (loanName === 'AUTO LOAN COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.autoLoanCombinedForm) &&
              !ObjectUtil.isEmpty(this.tempData.autoLoanCombinedForm.autoLoanCombinedFormArray)) {
            this.tempData.autoLoanCombinedForm.autoLoanCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'PERSONAL LOAN COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.personalLoanCombinedForm) &&
              !ObjectUtil.isEmpty(this.tempData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
            this.tempData.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'PERSONAL OVERDRAFT COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.personalOverdraftCombinedForm) &&
              !ObjectUtil.isEmpty(this.tempData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray)) {
            this.tempData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.personalOverDraftWithoutCollateralCombinedForm) &&
              !ObjectUtil.isEmpty(this.tempData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
            this.tempData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'EDUCATION LOAN COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.educationLoanForm) &&
              !ObjectUtil.isEmpty(this.tempData.educationLoanForm.educationLoanCombinedFormArray)) {
            this.tempData.educationLoanForm.educationLoanCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'MORTGAGE LOAN COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.mortgageCombineForm) &&
              !ObjectUtil.isEmpty(this.tempData.mortgageCombineForm.mortgageCombineLoanFormArray)) {
            this.tempData.mortgageCombineForm.mortgageCombineLoanFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'HOME LOAN COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.homeLoanCombinedForm) &&
              !ObjectUtil.isEmpty(this.tempData.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
            this.tempData.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'NABIL SAHAYATRI KARJA') {
          if (!ObjectUtil.isEmpty(this.tempData.nabilSahayatriCombinedForm) &&
              !ObjectUtil.isEmpty(this.tempData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray)) {
            this.tempData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'NABIL SHARE LOAN POD COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.nabilShareLoanPODForm) &&
              !ObjectUtil.isEmpty(this.tempData.nabilShareLoanPODForm.nabilShareLoanPODFormArray)) {
            this.tempData.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
        if (loanName === 'SHARE LOAN DEMAND COMBINED') {
          if (!ObjectUtil.isEmpty(this.tempData.shareLoanDemandCombinedForm) &&
              !ObjectUtil.isEmpty(this.tempData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
            this.tempData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach((val, i) => {
              if (val.loanId === loanHolderData.proposal.id) {
                interestRate = !ObjectUtil.isEmpty(val.interestRateCT) ? val.interestRateCT : '';
              }
            });
          }
        }
      }
    }
    return interestRate;
  }
  fillform() {
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
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
  }

  getGrandFatherName() {
    let grandFatherName;
    if (!ObjectUtil.isEmpty(this.individualData) && !ObjectUtil.isEmpty(this.individualData.gender) &&
        !ObjectUtil.isEmpty(this.individualData.gender.en)) {
      if (this.individualData.gender.en === 'MALE') {
        if (!ObjectUtil.isEmpty(this.individualData.grandFatherName)) {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.grandFatherName) &&
          !ObjectUtil.isEmpty(this.individualData.grandFatherName.ct) ? this.individualData.grandFatherName.ct : '';
        }
      }
      if (!ObjectUtil.isEmpty(this.individualData.relationMedium) && !ObjectUtil.isEmpty(this.individualData.relationMedium.en)) {
        if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '0') {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.fatherInLawName) &&
          !ObjectUtil.isEmpty(this.individualData.fatherInLawName.ct) ? this.individualData.fatherInLawName.ct : '';
        }
        if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '1') {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.grandFatherName) &&
          !ObjectUtil.isEmpty(this.individualData.grandFatherName.ct) ? this.individualData.grandFatherName.ct : '';
        }
      }
    }
    return grandFatherName;
  }

  getFatherName() {
    let fatherName;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.gender) &&
        !ObjectUtil.isEmpty(this.individualData.gender.en)) {
      if (this.individualData.gender.en === 'MALE') {
        fatherName = !ObjectUtil.isEmpty(this.individualData.fatherName) &&
        !ObjectUtil.isEmpty(this.individualData.fatherName.ct) ? this.individualData.fatherName.ct : '';
      }
      if (this.individualData.gender.en === 'FEMALE') {
        if (!ObjectUtil.isEmpty(this.individualData.relationMedium) && !ObjectUtil.isEmpty(this.individualData.relationMedium.en)) {
          if (this.individualData.relationMedium.en === '0') {
            fatherName = !ObjectUtil.isEmpty(this.individualData.husbandName) &&
            !ObjectUtil.isEmpty(this.individualData.husbandName.ct) ? this.individualData.husbandName.ct : '';
          }
          if (this.individualData.relationMedium.en === '1') {
            fatherName = !ObjectUtil.isEmpty(this.individualData.fatherName) &&
            !ObjectUtil.isEmpty(this.individualData.fatherName.ct) ? this.individualData.fatherName.ct : '';
          }
        }
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
    this.spinner = true;
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
        this.initialInfoPrint = cadFile.supportedInformation;
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      // cadFile.initialInformation = JSON.stringify(this.form.value);
      this.initialInfoPrint = cadFile.supportedInformation;
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  setFreeText() {
    const free = this.form.value;
    for (let val = 0; val < free.promissoryNoteFormArray.length; val++) {
      const tempFreeText = {
        date: this.form.get(['promissoryNoteFormArray', val, 'date']) ? this.form.get(['promissoryNoteFormArray', val, 'date']).value : '',
        sakshiDistrict: this.form.get(['promissoryNoteFormArray', val, 'sakshiDistrict']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiDistrict']).value : '',
        sakshiDistrict1: this.form.get(['promissoryNoteFormArray', val, 'sakshiDistrict1']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiDistrict1']).value : '',
        sakshiVdc: this.form.get(['promissoryNoteFormArray', val, 'sakshiVdc']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiVdc']).value : '',
        sakshiVdc1: this.form.get(['promissoryNoteFormArray', val, 'sakshiVdc1']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiVdc1']).value : '',
        sakshiWardNo: this.form.get(['promissoryNoteFormArray', val, 'sakshiWardNo']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiWardNo']).value : '',
        sakshiWardNo1: this.form.get(['promissoryNoteFormArray', val, 'sakshiWardNo1']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiWardNo1']).value : '',
        sakshiAge: this.form.get(['promissoryNoteFormArray', val, 'sakshiAge']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiAge']).value : '',
        sakshiAge1: this.form.get(['promissoryNoteFormArray', val, 'sakshiAge1']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'sakshiAge1']).value : '',
        nameofWitness: this.form.get(['promissoryNoteFormArray', val, 'nameofWitness']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'nameofWitness']).value : '',
        nameofWitness1: this.form.get(['promissoryNoteFormArray', val, 'nameofWitness1']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'nameofWitness1']).value : '',
        nameofStaff: this.form.get(['promissoryNoteFormArray', val, 'nameofStaff']).value ?
            this.form.get(['promissoryNoteFormArray', val, 'nameofStaff']).value : '',
      };
      this.freeText.push(tempFreeText);
    }
    return JSON.stringify(this.freeText);
  }

  fillGuarantee() {
    if (this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.cadInitialInfo = JSON.parse(singleCadFile.supportedInformation);
          }
        });
        const free = this.form.value;
        if (this.cadInitialInfo !== null) {
          for (let val = 0; val < free.promissoryNoteFormArray.length; val++) {
            // tslint:disable-next-line:max-line-length
            this.form.get(['promissoryNoteFormArray', val, 'date']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                !ObjectUtil.isEmpty(this.cadInitialInfo[val].date) ?
                    this.cadInitialInfo[val].date : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiDistrict1']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiDistrict1) ?
                    this.cadInitialInfo[val].sakshiDistrict1 : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiDistrict']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiDistrict) ?
                    this.cadInitialInfo[val].sakshiDistrict : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiVdc']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiVdc) ?
                    this.cadInitialInfo[val].sakshiVdc : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiVdc1']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiVdc1) ?
                    this.cadInitialInfo[val].sakshiVdc1 : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiAge1']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiAge1) ?
                    this.cadInitialInfo[val].sakshiAge1 : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiAge']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiAge) ?
                    this.cadInitialInfo[val].sakshiAge : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiWardNo1']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiWardNo1) ?
                    this.cadInitialInfo[val].sakshiWardNo1 : '');
            this.form.get(['promissoryNoteFormArray', val, 'sakshiWardNo']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].sakshiWardNo) ?
                    this.cadInitialInfo[val].sakshiWardNo : '');
            this.form.get(['promissoryNoteFormArray', val, 'nameofWitness1']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].nameofWitness1) ?
                    this.cadInitialInfo[val].nameofWitness1 : '');
            this.form.get(['promissoryNoteFormArray', val, 'nameofWitness']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].nameofWitness) ?
                    this.cadInitialInfo[val].nameofWitness : '');
            this.form.get(['promissoryNoteFormArray', val, 'nameofStaff']).patchValue(
                !ObjectUtil.isEmpty(this.cadInitialInfo) && !ObjectUtil.isEmpty(this.cadInitialInfo[val]) &&
                    !ObjectUtil.isEmpty(this.cadInitialInfo[val].nameofStaff) ?
                    this.cadInitialInfo[val].nameofStaff : '');
          }
        }
      }
    }
  }

  setJointDetailsArr(data) {
    console.log('Joint Data:', data);
    if (!ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.cadData.assignedLoan.forEach((val, i) => {
        const formArray = (this.form.get(['promissoryNoteFormArray', i, 'jointDetailsArr']) as FormArray);
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
            nameofGrandFatherJoint: [nepData.grandFatherName ?
                nepData.grandFatherName.ct :
                nepData.fatherInLawName ? nepData.fatherInLawName.ct : ''],
            nameofFatherJoint: [nepData.fatherName ?
                nepData.fatherName.ct :
                nepData.husbandName ? nepData.husbandName.ct : ''],
            districtJoint: [nepData.permanentDistrict.ct],
            vdcJoint: [nepData.permanentMunicipality.ct],
            wardNoJoint: [nepData.permanentWard.np || nepData.permanentWard.ct],
            ageJoint: [age ? age : ''],
            nameofPersonJoint: [nepData.name.np || nepData.name.ct],
            citizenshipNoJoint: [nepData.citizenNumber.np || nepData.citizenNumber.ct],
            dateofIssueJoint: [citizenshipIssuedDate ? citizenshipIssuedDate : ''],
            nameofIssuedDistrictJoint: [nepData.citizenshipIssueDistrict.en.nepaliName],
          }));
        });
      });
    }
  }

  buildSetSignature() {
    return this.formBuilder.group({
      loanHolderNameJoint : [undefined],
    });
  }

  setSignatureData(data) {
    if (!ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.cadData.assignedLoan.forEach((val, i) => {
        const formArray = (this.form.get(['promissoryNoteFormArray', i, 'signatureData']) as FormArray);
        data.forEach(value => {
          const nepData = value;
          formArray.push(this.formBuilder.group({
            loanHolderNameJoint: [nepData.name ? nepData.name.ct : ''],
          }));
        });
      });
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
