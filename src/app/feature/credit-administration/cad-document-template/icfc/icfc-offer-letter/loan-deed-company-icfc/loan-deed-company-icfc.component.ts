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
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';


@Component({
  selector: 'app-loan-deed-company-icfc',
  templateUrl: './loan-deed-company-icfc.component.html',
  styleUrls: ['./loan-deed-company-icfc.component.scss']
})
export class LoanDeedCompanyIcfcComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  loanDeedCompany: FormGroup;
  spinner;
  offerLetterDocument: OfferDocument;
  offerLetterConst = IcfcOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
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
      issueDate: [undefined],
      issueDistrict: [undefined],
      date2: [undefined],
      date3: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      accountNo: [undefined],
      witness: [undefined],
      witness2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      propertyDetailsTable: this.formBuilder.array([]),
      note: [undefined]
    });

  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
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
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
      === this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_COMPANY).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED_INDIVIDUAL_SAME);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setPropertyDetailsTable(initialInfo.propertyDetailsTable);
      }
      this.loanDeedCompany.patchValue(this.initialInfoPrint);
    }
  }


  submit() {
    console.log(this.loanDeedCompany.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
          this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_COMPANY).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.loanDeedCompany.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      console.log('Offer Document', offerDocument);
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_COMPANY);
      offerDocument.initialInformation = JSON.stringify(this.loanDeedCompany.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

  addTableData() {
    (this.loanDeedCompany.get('propertyDetailsTable') as FormArray).push(
        this.formBuilder.group({
          date3: [undefined],
          creditAmount: [undefined],
          interestRate: [undefined],
          serviceCharge: [undefined],
          bankingServiceAndDate: [undefined]
        })
    );
  }

  removeTableData(index) {
    (this.loanDeedCompany.get('propertyDetailsTable') as FormArray).removeAt(index);
  }

  setPropertyDetailsTable(data) {
    const formArray = this.loanDeedCompany.get('propertyDetailsTable') as FormArray;
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        date3: [undefined],
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
