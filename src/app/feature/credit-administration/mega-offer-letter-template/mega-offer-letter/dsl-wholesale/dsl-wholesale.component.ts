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
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';

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
  ckeConfig = NepaliEditor.CK_CONFIG;
  reviewDropdown = [
    {key: 'Overdraft', value: 'अधिविकर्ष कर्जा'},
    {key: 'TermLoans', value: 'आवधिक प्रकृतीका कर्जा'},
    {key: 'DemandLoans', value: 'माग कर्जा'}
  ];
  loanTypesDropdown = [
    {key: 'TermLoans', value: 'विपन्न वर्ग आवधिक कर्जा (Deprived Sector Term Loan)'},
    {key: 'Overdraft', value: 'विपन्न वर्ग अधिविकर्ष कर्जा (Deprived Sector Overdraft)'},
    {key: 'DemandLoans', value: 'विपन्न वर्ग माग कर्जाहरु (Deprived Sector Demand)'}
  ];

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
    this.checkOfferLetterData();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
    console.log(this.loanHolderInfo, 'loanDATAhOLDER');
    if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
      this.form.patchValue({
        offerLetterReferenceNum: this.loanHolderInfo.miscellaneousDetail.offerReferenceNo ? this.loanHolderInfo.miscellaneousDetail.offerReferenceNo : '',
        date: this.loanHolderInfo.miscellaneousDetail.offerIssueDate ? this.loanHolderInfo.miscellaneousDetail.offerIssueDate : '',
        borrowerName: this.loanHolderInfo.nepaliName ? this.loanHolderInfo.nepaliName : '',
        districtPermanent: this.loanHolderInfo.institutionRegisteredAddress.district ? this.loanHolderInfo.institutionRegisteredAddress.district : '',
        municipalityPermanent: this.loanHolderInfo.institutionRegisteredAddress.municipality ? this.loanHolderInfo.institutionRegisteredAddress.municipality : '',
        wardPermanent: this.loanHolderInfo.institutionRegisteredAddress.wardNo ? this.loanHolderInfo.institutionRegisteredAddress.wardNo : '',
        districtCurrent: this.loanHolderInfo.institutionCurrentAddress.district ? this.loanHolderInfo.institutionCurrentAddress.district : '',
        municipalityCurrent: this.loanHolderInfo.institutionCurrentAddress.municipality ? this.loanHolderInfo.institutionCurrentAddress.municipality : '',
        wardCurrent: this.loanHolderInfo.institutionCurrentAddress.wardNo ? this.loanHolderInfo.institutionCurrentAddress.wardNo : '',
        toleCurrent: this.loanHolderInfo.institutionCurrentAddress.tole ? this.loanHolderInfo.institutionCurrentAddress.tole : '',
        authorizedPersonName: this.loanHolderInfo.authorizedPersonDetail.name ? this.loanHolderInfo.authorizedPersonDetail.name : '',
        drawdownPercent: this.loanHolderInfo.miscellaneousDetail.drawdownPer ? this.loanHolderInfo.miscellaneousDetail.drawdownPer : '',
        branchNameNepali: this.loanHolderInfo.branchDetail.branchNameInNepali ? this.loanHolderInfo.branchDetail.branchNameInNepali : '',
        branchDistrict: this.loanHolderInfo.branchDetail.branchDistrict ? this.loanHolderInfo.branchDetail.branchDistrict : '',
        telephoneNumber: this.loanHolderInfo.branchDetail.branchTelNo ? this.loanHolderInfo.branchDetail.branchTelNo : '',
        faxNumber: this.loanHolderInfo.branchDetail.branchFaxNo ? this.loanHolderInfo.branchDetail.branchFaxNo : '',
      });
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
      emailAddress: [undefined],
      currentProvinceNum: [undefined],
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
      loanProcessFee: [undefined],
      checkLoanProcessFee: true,
      loanRenewFee: [undefined],
      selectReview: [undefined],
      checkLoanRenewFee: true,
      checkCommitmentCharge: true,
      branchAddress: [undefined],
      checkBranch: true,
      proposalData: this.formBuilder.array([]),
      otherFee: this.formBuilder.array([]),
      otherFeeInNep: [undefined],
      otherFeeInEng: [undefined],
      addField: [undefined]
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
      this.initialInfoPrint = initialInfo;
      this.setProposal(initialInfo.proposalData);
      //this.setMore(initialInfo.otherFee, 'otherFee');
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

  removeDslWholesale(i) {
    (this.form.get('dslWholesale') as FormArray).removeAt(i);
  }

  onCheck(e, formControlName) {
    if (e) {
      this.form.get(formControlName).patchValue(e.target.checked);
    } else {
      this.form.get(formControlName).patchValue(e.target.value);
    }
  }

  checkLoanType(selectLoanType, index) {
    this.form.get(['proposalData', index, 'selectLoanType']).patchValue(selectLoanType);
  }

  buildProposalForm() {
    return this.formBuilder.group({
      selectLoanType: [undefined],
      nepaliAmountInFigures: [undefined],
      nepaliAmountInWords: [undefined],
      limitExpiry: [undefined],
      loanTenure: [undefined],
      equalInstallmentInNepaliFig: [undefined],
      equalInstallmentInNepaliWord: [undefined],
      premium: [undefined],
      selectTenure: [undefined],
      checkRepayment: true,
      checkLoanExpiry: true
    });
  }

  checkProposal(e, index, value) {
    if (e.target.selected) {
      this.form.get(['proposalData', index, value]).patchValue(value);
    }
  }

  setProposal(details) {
    const proposal = this.form.get('proposalData') as FormArray;
    details.forEach(data => {
      proposal.push(
          this.formBuilder.group({
            selectLoanType: [data.selectLoanType],
            nepaliAmountInFigures: [data.nepaliAmountInFigures],
            nepaliAmountInWords: [data.nepaliAmountInWords],
            limitExpiry: [data.limitExpiry],
            loanTenure: [data.loanTenure],
            equalInstallmentInNepaliFig: [data.equalInstallmentInNepaliFig],
            equalInstallmentInNepaliWord: [data.equalInstallmentInNepaliWord],
            premium: [data.premium],
            selectTenure: [data.selectTenure],
            checkRepayment: [data.checkRepayment],
            checkLoanExpiry: [data.checkLoanExpiry]
          })
      );
    });
  }

  onCheck2(e, i, formControlName) {
    if (e.target.checked) {
      this.form.get(['proposalData', i, formControlName]).patchValue(true);
    } else {
      this.form.get(['proposalData', i, formControlName]).patchValue(false);
    }
  }

  removeProposal(index: number) {
    (this.form.get('proposalData') as FormArray).removeAt(index);
  }

  addProposal() {
    const control = this.form.get('proposalData') as FormArray;
    control.push(this.buildProposalForm());
  }

  changeToNepAmountArray(event: any, i , formArrayName, target, from) {
    this.form.get([formArrayName, i, target]).patchValue(event.nepVal);
    this.form.get([formArrayName, i, from]).patchValue(event.val);
  }

  patchFunctionArray(formArrayName, i, formControlName) {
    const patchValue1 = this.form.get([formArrayName, i, formControlName]).value;
    return patchValue1;
  }

  removeAddMore(index: number, formArrayName) {
    (this.form.get(formArrayName) as FormArray).removeAt(index);
  }

  addMore(formArrayName) {
    const control = this.form.get(formArrayName) as FormArray;
    control.push(this.buildAddMoreForm());
  }

  buildAddMoreForm() {
    return this.formBuilder.group({
      otherFeeInNep: [undefined],
      otherFeeInEng: [undefined],
      addField: [undefined],
    });
  }

  setMore(details, formArrayName) {
    const addMore = this.form.get(formArrayName) as FormArray;
    details.forEach(data => {
      addMore.push(
          this.formBuilder.group({
            otherFeeInNep: [data.otherFeeInNep],
            otherFeeInEng: [data.otherFeeInEng],
            addField: [data.addField],
          })
      );
    });
  }
}
