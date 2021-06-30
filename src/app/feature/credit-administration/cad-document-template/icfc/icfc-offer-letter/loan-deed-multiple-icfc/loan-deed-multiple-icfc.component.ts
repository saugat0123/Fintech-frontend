import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {OfferDocument} from '../../../../model/OfferDocument';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-loan-deed-multiple-icfc',
  templateUrl: './loan-deed-multiple-icfc.component.html',
  styleUrls: ['./loan-deed-multiple-icfc.component.scss']
})
export class LoanDeedMultipleIcfcComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  loanDeedMultiple: FormGroup;
  multipleData;
  spinner;
  nepData;
  offerLetterDocument: OfferDocument;
  offerLetterConst = IcfcOfferLetterConst;
  initialInfoPrint;
  existingOfferLetter = false;
  guarantorData;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<LoanDeedMultipleIcfcComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private nepaliPercentWordPipe: NepaliPercentWordPipe) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }


  buildForm() {
    this.loanDeedMultiple = this.formBuilder.group({
      branch: [undefined],
      permanentProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      grandParents: [undefined],
      parents: [undefined],
      temporaryProvince: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      age: [undefined],
      relation: [undefined],
      citizenshipNo: [undefined],
      issueDate: [undefined],
      issueDistrict: [undefined],
      date: [undefined],
      loan: [undefined],
      purpose: [undefined],
      onePerson: [undefined],
      rate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      timeDuration: [undefined],
      debtorName: [undefined],
      debtorName2: [undefined],
      rohbarBankEmployeeName: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      districtOfWitness: [undefined],
      municipalityVDCOfWitness: [undefined],
      wardNoOfWitness: [undefined],
      ageOfWitness: [undefined],
      relationOfWitness: [undefined],
      districtOfWitness2: [undefined],
      municipalityVDCOfWitness2: [undefined],
      wardNoOfWitness2: [undefined],
      ageOfWitness2: [undefined],
      relationOfWitness2: [undefined],
      propertyDetailsTable: this.formBuilder.array([]),
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.loanDeedMultiple.patchValue({
      permanentDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      permanentMunicipalityVDC: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      permanentWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      grandParents: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      parents: this.nepData.fatherName ? this.nepData.fatherName : '',
      temporaryDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      temporaryMunicipalityVDC: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      temporaryWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      age: this.nepData.age ? this.nepData.age : '',
      relation: this.nepData.name ? this.nepData.name : '',
      citizenshipNo: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      issueDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenshipIssueDate : '',
      issueDistrict: this.nepData.citizenshipIssueDistrict ? this.nepData.citizenshipIssueDistrict : '',
    });
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_MULTIPLE).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_MULTIPLE);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setPropertyDetailsTable(initialInfo.propertyDetailsTable);
      }
      this.loanDeedMultiple.patchValue(this.initialInfoPrint);
    }
  }

  addTableData() {
    (this.loanDeedMultiple.get('propertyDetailsTable') as FormArray).push(
        this.formBuilder.group({
          landOwnerDesc: [undefined],
          landOwnerName: [undefined],
          landOwnerMunicipalityVDC: [undefined],
          landOwnerWardNo: [undefined],
          seatNo: [undefined],
          kNo: [undefined],
          area: [undefined],
          rNoDate: [undefined],
        })
    );
  }

  setPropertyDetailsTable(data) {
    const formArray = this.loanDeedMultiple.get('propertyDetailsTable') as FormArray;
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        landOwnerDesc: [value.landOwnerDesc],
        landOwnerName: [value.landOwnerName],
        landOwnerMunicipalityVDC: [value.landOwnerMunicipalityVDC],
        landOwnerWardNo: [value.landOwnerWardNo],
        seatNo: [value.seatNo],
        kNo: [value.kNo],
        area: [value.area],
        rNoDate: [value.rNoDate],
      }));
    });
  }

  removeTableData(index) {
    (this.loanDeedMultiple.get('propertyDetailsTable') as FormArray).removeAt(index);
  }


  submit() {
    console.log(this.loanDeedMultiple.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
        this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_MULTIPLE).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.loanDeedMultiple.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      console.log('Offer Document', offerDocument);
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_MULTIPLE);
      offerDocument.initialInformation = JSON.stringify(this.loanDeedMultiple.value);
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

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanDeedMultiple.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.loanDeedMultiple.get(wordLabel).patchValue(convertedVal);
  }

}
