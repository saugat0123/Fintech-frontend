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
  selector: 'app-consent-for-collateral',
  templateUrl: './consent-for-collateral.component.html',
  styleUrls: ['./consent-for-collateral.component.scss']
})
export class ConsentForCollateralComponent implements OnInit {
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
              private dialogRef: NbDialogRef<ConsentForCollateralComponent>,
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

    this.form.patchValue({
      customerName: this.nepData.name ? this.nepData.name : '',
      citizenshipNum: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      citizenshipIssueDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenshipIssueDate : '',
      citizenshipIssuePlace: this.nepData.citizenshipIssueDistrict ? this.nepData.citizenshipIssueDistrict : '',
      spouseName: this.nepData.husbandName ? this.nepData.husbandName : '',
      grandParentName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
    });

    if (!ObjectUtil.isEmpty(this.nepData.guarantorDetails)) {
      this.setGuarantors(this.nepData.guarantorDetails);
    }


  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            console.log(initialInfo);
            this.setTapsils(initialInfo.tapsils);
            this.setGuarantors(initialInfo.guarantors);
            this.form.patchValue(this.initialInfoPrint);
          } else {
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
      customerName: [undefined],
      customerName1: [undefined],
      customerName2: [undefined],

      tapsils: this.formBuilder.array([]),

      citizenshipNum: [undefined],
      citizenshipIssueDate: [undefined],
      citizenshipIssuePlace: [undefined],
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

  setTapsils(data) {
    const formArray = this.form.get('tapsils') as FormArray;
    if (data.length === 0) {
      this.addEmptyTapsil();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        jaggadhaniName: [value.jaggadhaniName],
        jaggadhaniParentName: [value.jaggadhaniParentName],
        jaggadhaniGrandParentName: [value.jaggadhaniGrandParentName],
        jaggaDistrict: [value.jaggaDistrict],
        jaggaMunicipality: [value.jaggaMunicipality],
        jaggaWardNum: [value.jaggaWardNum],
        jaggaSeatNum: [value.jaggaSeatNum],
        jaggaKittaNum: [value.jaggaKittaNum],
        jaggaArea: [value.jaggaArea],
      }));
    });
  }

  addEmptyTapsil() {
    (this.form.get('tapsils') as FormArray).push(
        this.formBuilder.group({
          jaggadhaniName: [undefined],
          jaggadhaniParentName: [undefined],
          jaggadhaniGrandParentName: [undefined],
          jaggaDistrict: [undefined],
          jaggaMunicipality: [undefined],
          jaggaWardNum: [undefined],
          jaggaSeatNum: [undefined],
          jaggaKittaNum: [undefined],
          jaggaArea: [undefined],
        }));
  }

  removeTapsil(index) {
    (this.form.get('tapsils') as FormArray).removeAt(index);
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(convertedVal);
  }

}
