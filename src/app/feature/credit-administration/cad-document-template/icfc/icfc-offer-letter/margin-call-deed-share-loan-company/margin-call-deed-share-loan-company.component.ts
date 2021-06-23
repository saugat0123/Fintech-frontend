import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-margin-call-deed-share-loan-company',
  templateUrl: './margin-call-deed-share-loan-company.component.html',
  styleUrls: ['./margin-call-deed-share-loan-company.component.scss']
})
export class MarginCallDeedShareLoanCompanyComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  shareLoanCompany: FormGroup;
  spinner;
  offerLetterConst = IcfcOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<MarginCallDeedShareLoanCompanyComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.shareLoanCompany = this.formBuilder.group({
      shareLoan: [undefined],
      shareLoanWords: [undefined],
      governmentOfficeName: [undefined],
      governmentOfficeAddress: [undefined],
      registrationNo: [undefined],
      registeredDate: [undefined],
      province: [undefined],
      zoneName: [undefined],
      districtName: [undefined],
      municipalityOrVdc: [undefined],
      wardNo: [undefined],
      panNo: [undefined],
      orgOwnerName: [undefined],
      grandfatherName: [undefined],
      fatherName: [undefined],
      borrowerProvince: [undefined],
      borrowerZone: [undefined],
      borrowerDistrict: [undefined],
      borrowerVdcOrMunicipality: [undefined],
      borrowerWardNo: [undefined],
      tempProvince: [undefined],
      tempZone: [undefined],
      tempDistrict: [undefined],
      tempMunicipalityOrVdc: [undefined],
      tempWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      interestRate: [undefined],
      interestAmount: [undefined],
      serviceRate: [undefined],
      repaymentPeriod: [undefined],
      duration: [undefined],
      loanValueRate: [undefined],
      debtFlowRate: [undefined],
      singedYear: [undefined],
      signedMonth: [undefined],
      singedDate: [undefined],
      singedDay: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDate: [undefined],
      docWrittenDay: [undefined],
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    // Checking the data:
    console.log(this.nepData);
    this.shareLoanCompany.patchValue({
      // province: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      // zoneName: [undefined],
      // districtName: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      // municipalityOrVdc: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      // wardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      // panNo: [undefined],
      // orgOwnerName: [undefined],
      grandfatherName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      fatherName: this.nepData.fatherName ? this.nepData.fatherName : '',
      borrowerProvince: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      borrowerDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      borrowerVdcOrMunicipality: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      borrowerWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      tempProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
      tempDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      tempMunicipalityOrVdc: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      tempWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      borrowerAge: this.nepData.age ? this.nepData.age : '',
      borrowerName: this.nepData.name ? this.nepData.name : '',
    });
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
    === this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN_COMPANY).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN_COMPANY);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.shareLoanCompany.patchValue(this.initialInfoPrint);
    }
  }


  submit() {
    console.log(this.shareLoanCompany.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
        this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN_COMPANY).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.shareLoanCompany.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN_COMPANY);
      offerDocument.initialInformation = JSON.stringify(this.shareLoanCompany.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.shareLoanCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.shareLoanCompany.get(wordLabel).patchValue(convertedVal);
  }



}
