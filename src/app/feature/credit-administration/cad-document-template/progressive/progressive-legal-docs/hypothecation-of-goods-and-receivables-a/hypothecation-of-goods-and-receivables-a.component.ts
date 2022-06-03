import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {sum} from 'd3';

@Component({
  selector: 'app-hypothecation-of-goods-and-receivables-a',
  templateUrl: './hypothecation-of-goods-and-receivables-a.component.html',
  styleUrls: ['./hypothecation-of-goods-and-receivables-a.component.scss']
})
export class HypothecationOfGoodsAndReceivablesAComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  spinner;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  totalAmt = new Array<number>();
  totalAmount: number = 0;
  totalAmount2: number = 0;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<HypothecationOfGoodsAndReceivablesAComponent>) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
    if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
      this.initialInfoPrint.koshMaAdharit.forEach(val => {
        this.totalAmt.push(this.nepToEngNumberPipe.transform(val.amount));
      });
    }
  }

  onSubmit(): void {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          this.initialInfoPrint = singleCadFile.initialInformation;
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);

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

  setAnusuchis(data) {
    const formArray = this.form.get('anusuchis') as FormArray;
    if (data.length === 0) {
      this.addEmptyAnusuchi();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        quantity: [value.quantity],
        amount: [value.amount],
        remarks: [value.remarks],
      }));
    });
  }

  addEmptyAnusuchi() {
    (this.form.get('anusuchis') as FormArray).push(
        this.formBuilder.group({
          name: [undefined],
          quantity: [undefined],
          amount: [undefined],
          remarks: [undefined],
        }));
  }

  removeAnusuchi(index) {
    (this.form.get('anusuchis') as FormArray).removeAt(index);
  }


  setFinanceGuarantors(data) {
    const formArray = this.form.get('financeGuarantors') as FormArray;
    if (data.length === 0) {
      this.addEmptyFinanceGuarantor();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
      }));
    });
  }

  addEmptyFinanceGuarantor() {
    (this.form.get('financeGuarantors') as FormArray).push(
        this.formBuilder.group({
          name: [undefined],
        }));
  }

  removeFinanceGuarantor(index) {
    (this.form.get('financeGuarantors') as FormArray).removeAt(index);
  }

  setKoshMaAdharit(data) {
    const formArray = this.form.get('koshMaAdharit') as FormArray;
    /*if (data.length === 0) {
      this.addEmptyKoshMaAdharit();
      return;
    }*/
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        amount: [value.amount]
      }));
    });
  }

  addEmptyKoshMaAdharit() {
    (this.form.get('koshMaAdharit') as FormArray).push(
        this.formBuilder.group({
          name: [undefined],
          amount: [undefined]
        }));
  }

  removeKoshMaAdharit(index) {
    this.addAmounts();
    this.totalAmount = 0;
    let sumAmount: number;
    this.totalAmt.splice(index, 1);
    if (this.totalAmt.length > 0) {
      this.totalAmt.forEach(value => {
        this.totalAmount = this.totalAmount + Number(value);
      });
    }
    sumAmount = this.totalAmount + this.totalAmount2;
    this.form.patchValue({
      totalLimitAmount: this.engToNepNumberPipe.transform((sumAmount).toString()),
      totalLimitAmountInWords: this.nepaliCurrencyWordPipe.transform(sumAmount)
    });
    (this.form.get('koshMaAdharit') as FormArray).removeAt(index);
  }

  setGuarantors(data) {
    const formArray = this.form.get('guarantors') as FormArray;
    if (data.length === 0) {
      this.addEmptyGuarantor();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
      }));
    });
  }

  addEmptyGuarantor() {
    (this.form.get('guarantors') as FormArray).push(
        this.formBuilder.group({
          name: [undefined],
        }));
  }

  removeGuarantor(index) {
    (this.form.get('guarantors') as FormArray).removeAt(index);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      financePlace: [undefined],
      financeMuni: [undefined],
      financeWard: [undefined],
      financeBranch: [undefined],
      companyName: [undefined],
      companyAddress: [undefined],
      transactionPlace: [undefined],
      regNum: [undefined],
      regDate: [undefined],
      regOffice: [undefined],
      proprietorName: [undefined],
      proprietorAge: [undefined],
      proprietorCitizenNum: [undefined],
      proprietorCitizenAddress: [undefined],
      proprietorCurrentAddress: [undefined],
      proprietorParentName: [undefined],
      proprietorGrandParentName: [undefined],
      loanApproveDate: [undefined],
      loanApprovePasa: [undefined],
      jamanatAmount: [undefined],
      jamanatOther: [undefined],
      jamanatOtherAmount: [undefined],
      cashCreditAmount: [undefined],
      revolvingAmount: [undefined],
      demandLoanAmount: [undefined],
      fixedTermAmount: [undefined],
      koshOther1: [undefined],
      koshOtherAmount1: [undefined],
      koshOther2: [undefined],
      koshOtherAmount2: [undefined],
      koshOther3: [undefined],
      koshOtherAmount3: [undefined],
      totalLimitAmount: [undefined],
      totalLimitAmountInWords: [undefined],
      docYear: [undefined],
      docMonth: [undefined],
      docDate: [undefined],
      docRoj: [undefined],
      docSubham: [undefined],

      guarantors: this.formBuilder.array([]),
      financeGuarantors: this.formBuilder.array([]),
      anusuchis: this.formBuilder.array([]),
      koshMaAdharit: this.formBuilder.array([]),
    });
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.setAnusuchis(initialInfo.anusuchis);
          this.setFinanceGuarantors(initialInfo.financeGuarantors);
          this.setGuarantors(initialInfo.guarantors);
          this.setKoshMaAdharit(initialInfo.koshMaAdharit);
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      const tempAddress = this.nepaliData.companyDistrict + ', ' +
          this.nepaliData.companyVdcMun + ', ' + this.nepaliData.companyWardNo;
      const tempPropCitizenAddress = this.nepaliData.representativePermanentDistrict + ', ' +
          this.nepaliData.representativePermanentVdc + ', ' + this.nepaliData.representativePermanentVdcWard;
      const tempPropCurrentAddress = this.nepaliData.representativeTemporaryDistrict + ', ' +
          this.nepaliData.representativeTemporaryMunicipality + ', ' + this.nepaliData.representativeTemporaryWard;
      const tempParentName = (!ObjectUtil.isEmpty(this.nepaliData.representativeFatherName) ?
          this.nepaliData.representativeFatherName : '') + ' ÷ ' + (!ObjectUtil.isEmpty(this.nepaliData.representativeHusbandWifeName)
          ? this.nepaliData.representativeHusbandWifeName : '');
      this.form.patchValue({
        financePlace: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        financeMuni: this.nepaliData.branchMunVdc ? this.nepaliData.branchMunVdc : '',
        financeWard: this.nepaliData.branchWardNo ? this.nepaliData.branchWardNo : '',
        financeBranch: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        companyName: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        companyAddress: [tempAddress ? tempAddress : ''],
        regNum: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
        regDate: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
        proprietorName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        proprietorCitizenNum: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        proprietorCitizenAddress: tempPropCitizenAddress ? tempPropCitizenAddress : '',
        proprietorCurrentAddress: tempPropCurrentAddress ? tempPropCurrentAddress : '',
        proprietorParentName: tempParentName ? tempParentName : '',
        proprietorGrandParentName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
      });
    }
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  addAmounts() {
    this.totalAmount2 = 0;
    let res;
    const toAddFormControl = [
      'jamanatAmount',
      'jamanatOtherAmount',
      'cashCreditAmount',
      'revolvingAmount',
      'demandLoanAmount',
      'fixedTermAmount',
    ];
    toAddFormControl.forEach(f => {
      res = +this.nepToEngNumberPipe.transform(this.form.get(f).value);
      this.totalAmount2 += res;
      const sumAmount: number = this.totalAmount + this.totalAmount2;
      this.form.patchValue({
        totalLimitAmount: this.engToNepNumberPipe.transform((sumAmount).toString()),
        totalLimitAmountInWords: this.nepaliCurrencyWordPipe.transform(sumAmount)
      });
    });
  }

  updateAmount(amount, i) {
    this.addAmounts();
    let sumAmount: number;
    this.totalAmount = 0;
    this.totalAmt[i] = Number(this.nepToEngNumberPipe.transform(this.form.get(['koshMaAdharit', i, amount]).value));
    if (this.totalAmt.length > 0) {
      this.totalAmt.forEach(value => {
        this.totalAmount = this.totalAmount + Number(value);
      });
    }
    sumAmount = this.totalAmount + this.totalAmount2;
    this.form.patchValue({
      totalLimitAmount: this.engToNepNumberPipe.transform((sumAmount).toString()),
      totalLimitAmountInWords: this.nepaliCurrencyWordPipe.transform(sumAmount)
    });
  }

  /*addSumKoshMaAdharit(target1, target2) {
    const totalSum: number = this.totalAmount + this.totalAmount2;
    console.log('total Sum', totalSum);
    this.form.get(target1).patchValue(totalSum.toString());
    this.form.get(target2).patchValue(this.nepaliCurrencyWordPipe.transform(totalSum));
  }*/
}
