import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {OfferDocument} from '../../../../model/OfferDocument';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-margin-call-deed-share-loan',
  templateUrl: './margin-call-deed-share-loan.component.html',
  styleUrls: ['./margin-call-deed-share-loan.component.scss']
})
export class MarginCallDeedShareLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
    marginShareLoan: FormGroup;
    spinner;
    offerLetterDocument: OfferDocument;
    offerLetterConst = IcfcOfferLetterConst;
    customerOfferLetter: CustomerOfferLetter;
    initialInfoPrint;
    existingOfferLetter = false;
    customGender;
    nepData;

  constructor(private fromBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              private dialogRef: NbDialogRef<MarginCallDeedShareLoanComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.marginShareLoan = this.fromBuilder.group({
      shareLoan: [undefined],
      shareLoanWords: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      zoneName: [undefined],
      districtName: [undefined],
      municipalityOrVdc: [undefined],
      wardNo: [undefined],
      tempZone: [undefined],
      tempDistrict: [undefined],
      tempMunicipalityOrVdc: [undefined],
      tempWardNo: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      interestRate: [undefined],
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
      subham: [undefined],
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    // console.log(this.nepData);
    this.marginShareLoan.patchValue({
      grandFatherName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      fatherName: this.nepData.fatherName ? this.nepData.fatherName : '',
      zoneName: [undefined],
      districtName: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      municipalityOrVdc: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      wardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      tempZone: [undefined],
      tempDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      tempMunicipalityOrVdc: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      tempWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      borrowerAge: this.nepData.age ? this.nepData.age : '',
      borrowerName: this.nepData.name ? this.nepData.name : '',
    });
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
    === this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN).toString())[0];
    console.log('offer letter document name', this.offerLetterDocument);
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {}
      this.marginShareLoan.patchValue(this.initialInfoPrint);
    }
  }

  submit() {
    console.log(this.marginShareLoan.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
        this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.marginShareLoan.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CALL_DEED_SHARE_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.marginShareLoan.value);
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
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.marginShareLoan.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.marginShareLoan.get(wordLabel).patchValue(convertedVal);
  }

}
