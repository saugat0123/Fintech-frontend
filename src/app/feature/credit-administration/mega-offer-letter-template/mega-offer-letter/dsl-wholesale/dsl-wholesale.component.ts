import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-dsl-wholesale',
  templateUrl: './dsl-wholesale.component.html',
  styleUrls: ['./dsl-wholesale.component.scss']
})
export class DslWholesaleComponent implements OnInit {

  form: FormGroup;
  spinner = false;
  existingOfferLetter = false;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;
  initialInfoPrint;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  finalNepaliWord = [];
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  nepData;
  external = [];
  loanHolderInfo;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private router: Router,
              private administrationService: CreditAdministrationService,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe) {
  }

  ngOnInit() {
    this.buildForm();
    console.log('cadOfferLetterApprovedDoc', this.cadOfferLetterApprovedDoc);
    this.checkOfferLetterData();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      dslWholesale: this.formBuilder.array([]),
      date: [undefined],
      offerLetterReferenceNum: [undefined],
      borrowerName: [undefined],
      districtPermanent: [undefined],
      municipalityPermanent: [undefined],
      wardPermanent: [undefined],
      provinceCurrent: [undefined],
      districtCurrent: [undefined],
      municipalityCurrent: [undefined],
      wardCurrent: [undefined],
      toleCurrent: [undefined],
      currentHouseNum: [undefined],
      currentStreet: [undefined],
      authorizedPersonName: [undefined],
      authorizedPersonContactNum: [undefined],
      faxNum: [undefined],
      nepaliAmountInFigures: [undefined],
      nepaliAmountInWords: [undefined],
      loanTenure: [undefined],
      equalInstallmentInNepaliFig: [undefined],
      equalInstallmentInNepaliWord: [undefined],
      premium: [undefined],
      fiscalYear: [undefined],
      quaterly: [undefined],
      baseRate: [undefined],
      GuarantorName: [undefined],
      loanFacility: [undefined],
      postBoxNumber: [undefined],
      branchNameNepali: [undefined],
      branchDistrict: [undefined],
      telephoneNumber: [undefined],
      faxNumber: [undefined],
      borrowerNameNepali: [undefined],
      permanentDistrict: [undefined],
      permanentVdcOrMun: [undefined],
      currentProvinceNum: [undefined],
      currentDistrict: [undefined],
      currentVdcMunicipality: [undefined],
      currentWardNum: [undefined],
      currentTole: [undefined],
      emailAddress: [undefined],
      currentContactNum: [undefined],
      currentFaxPostBox: [undefined],
      name3: [undefined],
      department1: [undefined],
      name4: [undefined],
      department2: [undefined],
      offerletterIssuedDate: [undefined],
      email: [undefined],
      faxPostBoxNum: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      timeOfDay: [undefined],
      from: [undefined],
      permanentWardNum: [undefined],
    });
  }

  checkOfferLetterData() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.DSL_WHOLESALE).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.addEmptyDslWholesaleForm();
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.DSL_WHOLESALE);
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      console.log(initialInfo);
      this.initialInfoPrint = initialInfo;
      console.log(this.offerLetterDocument);
      this.existingOfferLetter = true;
      this.form.patchValue(initialInfo);
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setDslWholesale(initialInfo.dslWholesale);
      }
      this.initialInfoPrint = initialInfo;
    }
  }

  submit() {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;
    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.DSL_WHOLESALE).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.DSL_WHOLESALE);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
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

  addEmptyDslWholesale() {
    return this.formBuilder.group({
      facilityType: [undefined],
      adhiktamAmount: [undefined],
      amountInWord: [undefined],
      sadharanShare: [undefined],
      maximumAmount: [undefined],
      limitExpiryDate: [undefined],
      interestAmount: [undefined],
    });
  }

  addEmptyDslWholesaleForm() {
    (this.form.get('dslWholesale') as FormArray).push(this.addEmptyDslWholesale());
  }

  setDslWholesale(data) {
    const formArray = this.form.get('dslWholesale') as FormArray;
    if (ObjectUtil.isEmpty(data)) {
      this.addEmptyDslWholesaleForm();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        facilityType: [value.facilityType],
        adhiktamAmount: [value.adhiktamAmount],
        amountInWord: [value.amountInWord],
        sadharanShare: [value.sadharanShare],
        maximumAmount: [value.maximumAmount],
        limitExpiryDate: [value.limitExpiryDate],
        interestAmount: [value.interestAmount],
      }));
    });
  }

  removedslWholesale(i) {
    (this.form.get('dslWholesale') as FormArray).removeAt(i);
  }
}
