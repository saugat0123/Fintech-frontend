import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-consent-for-loan-interest-payment',
  templateUrl: './consent-for-loan-interest-payment.component.html',
  styleUrls: ['./consent-for-loan-interest-payment.component.scss']
})
export class ConsentForLoanInterestPaymentComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  form: FormGroup;
  spinner;
  offerLetterConst = LegalDocumentCheckListEnum;
  initialInfoPrint;
  customGender;
  nepData;
  guarantorData;
  editor = NepaliEditor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<ConsentForLoanInterestPaymentComponent>,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.checkOfferLetter();
  }


  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    const customerAddress = this.nepData.permanentMunicipality + '-' + this.nepData.permanentWard + ', ' + this.nepData.permanentDistrict + ', ' + this.nepData.permanentProvince;
    this.setGuarantors(this.nepData.guarantorDetails);
    this.form.patchValue({
      customerName: this.nepData.name ? this.nepData.name : '',
      citizenshipNum: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      citizenshipIssueDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenshipIssueDate : '',
      spouseName: this.nepData.husbandName ? this.nepData.husbandName : '',
      grandParentName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
    });
  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.form.patchValue(this.initialInfoPrint);
          } else {
            this.addEmptyGuarantor();
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }


  submit() {
    console.log(this.form.value.amountInWords);
    this.spinner = true;
    let flag = true;

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          console.log('Initial Information ==> ', singleCadFile);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        console.log('Initial Information ==> ', cadFile.initialInformation);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
        console.log('cad data from the loan ===> ', cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      console.log('Initial Information ==> ', cadFile.initialInformation);
      this.cadData.cadFileList.push(cadFile);
      console.log('cad data from the loan ===> ', cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      branch: [undefined],
      branchAddress: [undefined],

      loanType: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      pariwar: [undefined],
      customerName: [undefined],

      customerName1: [undefined],
      customerName2: [undefined],
      citizenshipNum: [undefined],
      citizenshipIssueDate: [undefined],
      spouseName: [undefined],
      grandParentName: [undefined],

      guarantors: this.formBuilder.array([]),

      date1: [undefined],

    });

  }

  setGuarantors(data) {
    const formArray = this.form.get('guarantors') as FormArray;
    if (data.length === 0) {
      this.addEmptyGuarantor();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        citizenNumber: [value.citizenNumber],
        issuedYear: [value.issuedYear],
        issuedPlace: [value.issuedPlace],
        guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
        age: [value.age],
        name: [value.name],
      }));
    });
  }

  addEmptyGuarantor() {
    (this.form.get('guarantors') as FormArray).push(
        this.formBuilder.group({
          citizenNumber: [undefined],
          issuedYear: [undefined],
          issuedPlace: [undefined],
          guarantorLegalDocumentAddress: [undefined],
          age: [undefined],
          name: [undefined],
        }));
  }

  removeGuarantor(index) {
    (this.form.get('guarantors') as FormArray).removeAt(index);
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(convertedVal);
  }

}
