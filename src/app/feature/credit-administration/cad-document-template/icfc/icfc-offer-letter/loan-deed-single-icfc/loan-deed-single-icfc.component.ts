import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-loan-deed-single-icfc',
  templateUrl: './loan-deed-single-icfc.component.html',
  styleUrls: ['./loan-deed-single-icfc.component.scss']
})
export class LoanDeedSingleIcfcComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  loanDeedSingle: FormGroup;
  singleData;
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
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.loanDeedSingle = this.formBuilder.group({
      branch: [undefined],
      grandParents: [undefined],
      temporaryProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityVDC: [undefined],
      permanentWardNo: [undefined],
      parents: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityVDC: [undefined],
      temporaryWardNo: [undefined],
      temporaryAddress: [undefined],
      age: [undefined],
      relation: [undefined],
      citizenshipNo: [undefined],
      issueDate: [undefined],
      issueDistrict: [undefined],
      loanRequestDate: [undefined],
      loan: [undefined],
      purpose: [undefined],
      annualRate: [undefined],
      onePerson: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      timeDuration: [undefined],
      rohbarBankEmployeeName: [undefined],
      guarantorName: [undefined],
      guarantorName2: [undefined],
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
      debtorName: [undefined],
      propertyDetailsTable: this.formBuilder.array([]),
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.loanDeedSingle.patchValue({
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
        === this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SINGLE).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SINGLE);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setPropertyDetailsTable(initialInfo.propertyDetailsTable);
      }
      this.loanDeedSingle.patchValue(this.initialInfoPrint);
    }
  }

  addTableData() {
    (this.loanDeedSingle.get('propertyDetailsTable') as FormArray).push(
        this.formBuilder.group({
          sNo: [undefined],
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

  removeTableData(index) {
    (this.loanDeedSingle.get('propertyDetailsTable') as FormArray).removeAt(index);
  }

  setPropertyDetailsTable(data) {
    const formArray = this.loanDeedSingle.get('propertyDetailsTable') as FormArray;
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        sNo: [value.sNo],
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


  submit() {
    console.log(this.loanDeedSingle.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SINGLE).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.loanDeedSingle.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SINGLE);
      offerDocument.initialInformation = JSON.stringify(this.loanDeedSingle.value);
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
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanDeedSingle.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.loanDeedSingle.get(wordLabel).patchValue(convertedVal);
  }

}
