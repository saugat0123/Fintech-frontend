import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../model/customerApprovedLoanCadDocumentation";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NabilOfferLetterConst} from "../../../nabil-offer-letter-const";
import {Province} from "../../../../admin/modal/province";
import {District} from "../../../../admin/modal/district";
import {MunicipalityVdc} from "../../../../admin/modal/municipality_VDC";
import {CadDocStatus} from "../../../model/CadDocStatus";
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NepaliToEngNumberPipe} from "../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../@core/pipe/nepali-currency-word.pipe";
import {SbTranslateService} from "../../../../../@core/service/sbtranslate.service";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {ToastService} from "../../../../../@core/utils";
import {AddressService} from "../../../../../@core/service/baseservice/address.service";
import {OfferDocument} from "../../../model/OfferDocument";
import {Attributes} from "../../../../../@core/model/attributes";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {PersonalLoanComponent} from "../../../mega-offer-letter-template/mega-offer-letter/personal-loan/personal-loan.component";

@Component({
  selector: 'app-personal-loan-template-data',
  templateUrl: './personal-loan-template-data.component.html',
  styleUrls: ['./personal-loan-template-data.component.scss']
})
export class PersonalLoanTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  tdValues: any = {};
  form: FormGroup;
  fieldFlag = false;
  selectedSecurityVal;
  selectedCountryVal;
  embassyName;
  spinner = false;
  loanLimit = false;
  existingOfferLetter = false;
  btnDisable = true;
  previewBtn = true;
  offerLetterConst = NabilOfferLetterConst;
  attributes;
  translatedData;
  dateTypeBS = false;
  dateTypeAD = false;
  dateTypeBS1 = false;
  dateTypeAD1 = false;
  cadDocStatus = CadDocStatus.key();

  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      private modelService: NgbModal,
      private ngDialogRef: NbDialogRef<PersonalLoanTemplateDataComponent>,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private addressService: AddressService,
  ) { }

  ngOnInit() {
    this.buildForm();
     }

  buildForm() {
    this.form = this.formBuilder.group({
      refNumber: [undefined],
      dateOfApproval: [undefined],
      dateofApplication: [undefined],
      loanPurpose: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyFloatingInterestRate: [undefined],
      loanAdminFee: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      companyName: [undefined],
      branchName: [undefined],
      accountNumber: [undefined],
      relationshipOfficer: [undefined],
      unitName : [undefined],
      managerName: [undefined],
      signatureDate : [undefined],
      sakshiDistrict: [undefined],
      sakshiMunicipality: [undefined],
      sakshiWardNum: [undefined],
      sakshiName: [undefined],
      employeeName : [undefined],

      // Translated Value
      refNumberTransVal: [undefined],
      dateOfApprovalTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      loanPurposeTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      yearlyFloatingInterestRateTransVal: [undefined],
      loanAdminFeeTransVal: [undefined],
      emiAmountTransVal: [undefined],
      emiAmountWordsTransVal: [undefined],
      companyNameTransVal: [undefined],
      branchNameTransVal: [undefined],
      accountNumberTransVal: [undefined],
      relationshipOfficerTransVal: [undefined],
      unitNameTransVal: [undefined],
      managerNameTransVal: [undefined],
      signatureDateTransVal: [undefined],
      sakshiDistrictTransVal: [undefined],
      sakshiMunicipalityTransVal: [undefined],
      sakshiWardNumTransVal: [undefined],
      sakshiNameTransVal: [undefined],
      employeeNameTransVal: [undefined]

    });
  }

  submit() {
    this.spinner = true;
    this.btnDisable = true;
    console.log('Doc Error',this.customerApprovedDoc);
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';


    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN);
      Object.keys(this.form.controls).forEach(key => {
        if (key === 'loanDetails') {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.tdValues[key];
        this.tdValues[key] = this.attributes;
      });
      this.translatedData = {};
      offerDocument.initialInformation = JSON.stringify(this.tdValues);
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.previewBtn = this.btnDisable = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = this.btnDisable = false;
    });
  }

  openModel() {
    this.dialogService.open(PersonalLoanComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }

  onClose() {
    this.modelService.dismissAll();
  }

  async translate() {
    this.spinner = true;
    this.translatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.translatedData;
    this.spinner = false;
    this.btnDisable = false;
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  checkboxVal(event, formControlName) {
    const checkVal = event.target.checked;
    this[formControlName + 'Check'] = checkVal;
    if (!checkVal) {
      this.clearForm(formControlName + 'TransVal');
    }
  }

  clearForm(controlName) {
    this.form.get(controlName).setValue(null);
  }

  setDateTypeBS() {
    this.dateTypeBS = true;
    this.dateTypeAD = false;
  }

  setDateTypeAD() {
    this.dateTypeBS = false;
    this.dateTypeAD = true;
  }
  setDateTypeBS1() {
    this.dateTypeBS1 = true;
    this.dateTypeAD1 = false;
  }

  setDateTypeAD1() {
    this.dateTypeBS1 = false;
    this.dateTypeAD1 = true;
  }

  calInterestRate() {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('yearlyFloatingInterestRate').patchValue(sum);
  }

}
