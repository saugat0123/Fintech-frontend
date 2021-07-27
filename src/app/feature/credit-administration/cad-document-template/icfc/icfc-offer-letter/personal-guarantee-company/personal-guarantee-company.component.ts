import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {RouterUtilsService} from '../../../../utils/router-utils.service';

@Component({
  selector: 'app-personal-guarantee-company',
  templateUrl: './personal-guarantee-company.component.html',
  styleUrls: ['./personal-guarantee-company.component.scss']
})
export class PersonalGuaranteeCompanyComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  personalGuaranteeCompany: FormGroup;
  spinner;
  offerLetterDocument: OfferDocument;
  offerLetterConst = IcfcOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  customGender;
  nepData;
  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<PersonalGuaranteeCompanyComponent>,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.personalGuaranteeCompany = this.formBuilder.group({
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
      field: [undefined],
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
      propertyDetailsTable: this.formBuilder.array([]),
      note: [undefined],
      ministryName: [undefined],
      registrarRegistrationOffice: [undefined],
      registrationNo: [undefined],
      registrationYear: [undefined],
      registrationMonth: [undefined],
      registrationDay: [undefined],
      registrarRegistrationOfficeProvince: [undefined],
      registrarRegistrationOfficeZone: [undefined],
      registrarRegistrationOfficeDistrict: [undefined],
      registrarRegistrationOfficeVDCMun: [undefined],
      registrarRegistrationOfficeWardNo: [undefined],
      panNo: [undefined],
      credit: [undefined],
      personalWealthGiver: [undefined],
      personalWealthGiverAddress: [undefined]
    });

  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    console.log(this.nepData.guarantorDetails);
    this.checkGender(this.nepData.gender);
    this.personalGuaranteeCompany.patchValue({
      temporaryProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
      permanentDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
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
        === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_GUARANTEE_COMPANY).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_GUARANTEE_COMPANY);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
      }
      this.personalGuaranteeCompany.patchValue(this.initialInfoPrint);
    }
  }


  submit() {
    console.log(this.personalGuaranteeCompany.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_COMPANY).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      console.log('Offer Document', offerDocument);
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_COMPANY);
      offerDocument.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
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

  checkGender(gender) {
    if (gender === '1') {
      this.customGender = 'k\'?if';
    } else {
      this.customGender = 'dlxnf';
    }
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.personalGuaranteeCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.personalGuaranteeCompany.get(wordLabel).patchValue(convertedVal);
  }
}
