import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';


@Component({
  selector: 'app-loan-deed-company-icfc',
  templateUrl: './loan-deed-company-icfc.component.html',
  styleUrls: ['./loan-deed-company-icfc.component.scss']
})
export class LoanDeedCompanyIcfcComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  loanDeedCompany: FormGroup;
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
              private dialogRef: NbDialogRef<LoanDeedCompanyIcfcComponent>,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.loanDeedCompany = this.formBuilder.group({
      branch: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      permanentProvince: [undefined],
      permanentZone: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      temporaryProvince: [undefined],
      temporaryZone: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      age: [undefined],
      borrowerName: [undefined],
      citizenshipNo: [undefined],
      issueYear: [undefined],
      issueMonth: [undefined],
      issueDay: [undefined],
      issueDistrict: [undefined],
      field2: [undefined],
      year2: [undefined],
      month2: [undefined],
      day2: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      accountNo: [undefined],
      witness: [undefined],
      witness2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      propertyDetailsTable: this.formBuilder.array([this.buildPropertyDetails()]),
      note: [undefined],
      ministryName: [undefined],
      registrarOffice: [undefined],
      registrationNo: [undefined],
      registrationYear: [undefined],
      registrationMonth: [undefined],
      registrationDay: [undefined],
      registrarOfficeProvince: [undefined],
      registrarOfficeZone: [undefined],
      registrarOfficeDistrict: [undefined],
      registrarOfficeVDCMun: [undefined],
      registrarOfficeWardNo: [undefined],
      panNo: [undefined],
      field: [undefined],
    });

  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    console.log(this.nepData.guarantorDetails);
    this.checkGender(this.nepData.gender);
    this.loanDeedCompany.patchValue({
      temporaryProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
      permanentDistrict: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      permanentMunicipalityVDC: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      permanentWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      permanentProvince: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      grandParents: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      parents: this.nepData.fatherName ? this.nepData.fatherName : '',
      temporaryDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      temporaryMunicipalityVDC: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      temporaryWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      age: this.nepData.age ? this.nepData.age : '',
      borrowerName: this.nepData.name ? this.nepData.name : '',
      citizenshipNo: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      issueDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenshipIssueDate : '',
      issueDistrict: this.nepData.citizenshipIssueDistrict ? this.nepData.citizenshipIssueDistrict : '',
    });
  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            if (!ObjectUtil.isEmpty(initialInfo)) {
              this.setPropertyDetailsTable(initialInfo.propertyDetailsTable);
            }
            this.loanDeedCompany.patchValue(this.initialInfoPrint);
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
    console.log(this.loanDeedCompany.value.amountInWords);
    this.spinner = true;
    let flag = true;

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
          console.log('Initial Information ==> ', singleCadFile);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
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
      cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
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

  buildPropertyDetails() {
    return this.formBuilder.group({
      year3: [undefined],
      month3: [undefined],
      day3: [undefined],
      creditAmount: [undefined],
      interestRate: [undefined],
      serviceCharge: [undefined],
      bankingServiceAndDate: [undefined]
    });
  }

  addTableData() {
    (this.loanDeedCompany.get('propertyDetailsTable') as FormArray).push(this.buildPropertyDetails());
  }

  removeTableData(index) {
    (this.loanDeedCompany.get('propertyDetailsTable') as FormArray).removeAt(index);
  }

  setPropertyDetailsTable(data) {
    const formArray = this.loanDeedCompany.get('propertyDetailsTable') as FormArray;
    (this.loanDeedCompany.get('propertyDetailsTable') as FormArray).clear();
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        year3: [undefined],
        month3: [undefined],
        day3: [undefined],
        creditAmount: [undefined],
        interestRate: [undefined],
        serviceCharge: [undefined],
        bankingServiceAndDate: [undefined]
      }));
    });
  }

  checkGender(gender) {
    if (gender === '1') {
      this.customGender = 'k\'?if';
    } else {
      this.customGender = 'dlxnf';
    }
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanDeedCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.loanDeedCompany.get(wordLabel).patchValue(convertedVal);
  }

}
