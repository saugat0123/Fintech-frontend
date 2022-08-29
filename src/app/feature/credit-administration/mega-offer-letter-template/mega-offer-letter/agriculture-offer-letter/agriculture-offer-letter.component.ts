import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';

@Component({
  selector: 'app-agriculture-offer-letter',
  templateUrl: './agriculture-offer-letter.component.html',
  styleUrls: ['./agriculture-offer-letter.component.scss']
})
export class AgricultureOfferLetterComponent implements OnInit { form: FormGroup;
  // todo replace enum constant string compare
  spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedLoanArray = [];
  selectedNatureOfLoanArray = [];
  nepData;
  external = [];
  loanHolderInfo;
  loanTypes = [
    {key: 'CommercialAgricultureAndLivestock', value: 'व्यावसायिक कृषि तथा पशुपन्छी कर्जा (Commercial Agriculture and Livestock Loans)'},
    {key: 'EducatedYouthSelfEmployment', value: 'डशिक्षित युवा स्वरोजगार कर्जा (Educated Youth Self Employment)'},
    {key: 'YouthProjectLoanForReturneesFromAbroad', value: 'विदेशबाट फर्केका युवा परियोजना कर्जा (Youth Project Loan For Returnees From Abroad)'},
    {key: 'LoansToWomenEntrepreneurs', value: 'महिला उद्यमशिल कर्जा (Loans to Women Entrepreneurs)'},
    {key: 'DalitCommunityBusinessDevelopmentLoan', value: 'दलित समुदाय व्यवसाय विकास कर्जा (Dalit Community Business Development Loan)'},
    {key: 'HigherAndTechnicalAndVocationalEducationLoans', value: 'उच्च र प्राविधिक तथा व्यावसायिक शिक्षा कर्जा (Higher and Technical and Vocational Education Loans)'},
    {key: 'TextileIndustryOperationLoan', value: 'कपडा उधोग सञ्चालन कर्जा (Textile Industry Operation Loan)'},
    {key: 'TrainingLoansFromInstitutionsRecognizedByTheTechnicalEducationAndVocationalTrainingCouncil', value: 'प्राविधिक शिक्षा तथा व्यावसायिक तालिम परिषद््बाट मान्यता प्राप्त संस्थाबाट लिईने तालिम कर्जा (Training loans from institutions recognized by the Technical Education and Vocational Training Council)'},
    {key: 'YouthClassSelfEmploymentLoan', value: 'युवा बर्ग स्वरोजगार कर्जा (Youth Class Self Employment Loan)'},
    {key: 'AgricultureAndLivestockLoans', value: 'कृषि तथा पशुपन्छी कर्जा (Agriculture and Livestock Loans)'},
    {key: 'DeprivedClassLoans', value: 'विपन्न वर्ग कर्जा (Deprived Class Loans)'},
    {key: 'FlexiLoan', value: 'फ्लेक्सी कर्जा (Flexi Loan)'},
    {key: 'OtherLoans', value: 'अन्य कर्जाहरु (Other Loans)'}
  ];
  natureOfLoanTypes = [
      {key: 'Overdraft', value: 'अधिविकर्ष कर्जा (Overdraft Loans)'},
      {key: 'TermLoans', value: 'आवधिक कर्जा (Term Loans)'},
      {key: 'DemandLoans', value: 'माग कर्जा (Demand Loans)'},
      {key: 'OtherNatureOfLoans', value: 'अन्य कर्जाहरु (Other Loans)'}
  ];
  loanTypesDropdown = [
    {key: 'Overdraft', value: 'अधिविकर्ष कर्जा (Overdraft Loans)'},
    {key: 'TermLoans', value: 'आवधिक कर्जा (Term Loans)'},
    {key: 'OtherNatureOfLoans', value: 'अन्य कर्जाहरु (Other Loans)'}
  ];
  listOfLoan = [];
  commercialAgricultureAndLivestock = false;
  educatedYouthSelfEmployment = false;
  youthProjectLoanForReturneesFromAbroad = false;
  loansToWomenEntrepreneurs = false;
  dalitCommunityBusinessDevelopment = false;
  higherAndTechnicalAndVocationalEducation = false;
  textileIndustryOperation = false;
  trainingLoansFromInstitutionsRecognizedByTheTechnicalEducationAndVocationalTrainingCouncil = false;
  youthClassSelfEmployment = false;
  agricultureAndLivestockLoans = false;
  deprivedClassLoans = false;
  flexiLoan = false;
  otherLoans = false;

  overdraft = false;
  termLoans = false;
  demandLoans = false;
  otherNatureOfLoans = false;

  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  ckeConfig = NepaliEditor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private administrationService: CreditAdministrationService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepPercentWordPipe: NepaliPercentWordPipe,
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) {
  }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetterData();
    this.chooseLoanType(this.selectedLoanArray);
    this.chooseNatureOfLoanType(this.selectedNatureOfLoanArray);
    this.listOfLoan.push(this.form.get('loanTypeSelectedArray').value);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      olRefNo: [undefined],
      olIssueDate: [undefined],
      borrowerName: [undefined],
      borrowerPerDis: [undefined],
      borrowerPerMun: [undefined],
      borrowerPerWard: [undefined],
      borrowerTempProvince: [undefined],
      borrowerTempDis: [undefined],
      borrowerTempMun: [undefined],
      borrowerTempWard: [undefined],
      borrowerTempTole: [undefined],
      borrowerHouseNo: [undefined],
      borrowerTempStreet: [undefined],
      borrowerEmail: [undefined],
      borrowerMobile: [undefined],
      borrowerFax: [undefined],
      mobileNo: [undefined],
      loanAmount: [undefined],
      loanNameInWord: [undefined],
      loanAmount2: [undefined],
      loanNameInWord2: [undefined],
      challaniNo: [undefined],
      perDis: [undefined],
      perMun: [undefined],
      perWardNo: [undefined],
      perTole: [undefined],
      province: [undefined],
      province2: [undefined],
      tempDis: [undefined],
      tempMun: [undefined],
      tempWard: [undefined],
      tempTole: [undefined],
      tempHouseNo: [undefined],
      tempStreet: [undefined],
      email: [undefined],
      faxNo: [undefined],
      TempHouseNo: [undefined],
      TempStreet: [undefined],
      purposeDate: [undefined],
      limitExpiryDate: [undefined],
      limitExpiryDateExtend: [undefined],
      interest: [undefined],
      purpose: [undefined],
      limitExpiryDate2: [undefined],
      limitExpiryDateExtend2: [undefined],
      tenure2: [undefined],
      interest2: [undefined],
      renewalFee: [undefined],
      avgUtil: [undefined],
      unutilAmt: [undefined],
      otherFee: [undefined],
      securityDate: [undefined],
      tapasilDate: [undefined],
      tapasilAmt: [undefined],
      tarfa: [undefined],
      tapasilAmt2: [undefined],
      tapasilAmtInWords2: [undefined],
      malpotName: [undefined],
      malpotDate: [undefined],
      malpotDis: [undefined],
      malpotMun: [undefined],
      malpotWard: [undefined],
      malpotTempDis: [undefined],
      malpotTempMun: [undefined],
      malpotTempWard: [undefined],
      plotNo: [undefined],
      area: [undefined],
      raNo: [undefined],
      dhitoLikhit: [undefined],
      jariMiti: [undefined],
      nabikaranMiti: [undefined],
      postBox: [undefined],
      marfatBank: [undefined],
      branchName: [undefined],
      branchDis: [undefined],
      branchTelNo: [undefined],
      branchFax: [undefined],

      bankStaff: [undefined],
      designation: [undefined],
      bankDate: [undefined],
      bankStaff2: [undefined],
      designation2: [undefined],
      patraNo: [undefined],
      patraMiti: [undefined],
      borrowerName3: [undefined],
      borrowerAddress: [undefined],
      borrowerDate: [undefined],
      borrowerName4: [undefined],
      guarantorName: [undefined],
      guarantorDis: [undefined],
      guarantorMun: [undefined],
      guarantorWard: [undefined],
      guarantorTempProvince: [undefined],
      guarantorTempDis: [undefined],
      guarantorTempMun: [undefined],
      guarantorTempWard: [undefined],
      guarantorTole: [undefined],
      guarantorHouseNo: [undefined],
      guarantorStreet: [undefined],
      guarantorEmail: [undefined],
      guarantorMobile: [undefined],
      guarantorDate: [undefined],
      guarantorName2: [undefined],
      guarantorDis2: [undefined],
      guarantorMun2: [undefined],
      guarantorWard2: [undefined],
      guarantorTempProvince2: [undefined],
      guarantorTempDis2: [undefined],
      guarantorTempMun2: [undefined],
      guarantorTempWard2: [undefined],
      guarantorTole2: [undefined],
      guarantorHouseNo2: [undefined],
      guarantorStreet2: [undefined],
      guarantorEmail2: [undefined],
      guarantorMobile2: [undefined],
      guarantorDate2: [undefined],
      jamanikartaName: [undefined],
      akhtiyarName: [undefined],
      jamanikartaAddress: [undefined],
      dateBtm: [undefined],
      registrarOffice: [undefined],
      postBoxNo : [undefined],
      attention: [undefined],
      dhyanakarshan: [undefined],
      witness: [undefined],
      witness2: [undefined],
      authorizedPerson : [undefined],
      borrowerMobileNo: [undefined],
      overdraftNepali: [undefined],
      overdraftEnglish: [undefined],
      loanTypeSelectedArray: [undefined],
      tenureTermLoan: [undefined],
      otherTenureLoan : [undefined],
      noOfEmi: [undefined],
      repaymentTermLoan: [undefined],
      repaymentEngDate: [undefined],
      proposalData: this.formBuilder.array([this.buildProposalForm()]),
      otherLoan: this.formBuilder.array([this.buildOtherLoanForm()]),
      loanAdminFee: [undefined],
      loanRenewFee: [undefined],
      loanAdminFeeNonFunded: [undefined],
      baseRate: [undefined],
      dcgfPremium: [undefined],
      otherLoanName: [undefined],
      surakchyanName: [undefined],
      surakchyanDate: [undefined],
      surakchyanDis: [undefined],
      surakchyanMun: [undefined],
      surakchyanWard: [undefined],
      surakchyanTempDis: [undefined],
      surakchyanTempMun: [undefined],
      surakchyanTempWard: [undefined],
      surakchyanKittaNo: [undefined],
      surakchyanArea: [undefined],
      surakchyanMulyankankarta: [undefined],
      noOfVehicle: [undefined],
      vehicleModel: [undefined],
      vehicleNo: [undefined],
      reviewLoanType: [undefined],
      surakchyanPg: [undefined],
      surakchyanReviewYrs: [undefined],
      reviewOtherLoan: [undefined],
      covenant: [undefined],
      branchAddress: [undefined],
      loanDate: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined],
      subham: [undefined],
      surakchyanLoanAmount: [undefined],
      surakchyanLoanNameInWord: [undefined],
      surakchyanFmv: [undefined],
      surakchyanFmvInWord: [undefined],
      surakchyanDistress: [undefined],
      surakchyanDistressInWord: [undefined],
    });
  }

  buildProposalForm() {
    return this.formBuilder.group({
      facilityName: [undefined],
      natureOfLoan: [undefined],
      isOtherLoan: false,
      otherNatureOfLoanInNep: [undefined],
      otherNatureOfLoanInEng: [undefined],
      overDraftLoan: this.formBuilder.array([this.buildNatureOfLoanForm()]),
      demandLoan: this.formBuilder.array([this.buildNatureOfLoanForm()]),
      termLoan: this.formBuilder.array([this.buildNatureOfLoanForm()]),
      otherLoan: this.formBuilder.array([this.buildNatureOfLoanForm()])
    });
  }

  buildOtherLoanForm() {
    return this.formBuilder.group({
      otherLoan: [undefined],
    });
  }

  buildNatureOfLoanForm() {
    return this.formBuilder.group({
      loanAmount: [undefined],
      loanNameInWord: [undefined],
    });
  }


  checkFacilityName(facilityName, index) {
    this.form.get(['proposalData', index, 'facilityName']).patchValue(facilityName);

  }

  checkNatureOfLoan(natureOfLoan, index) {
    this.form.get(['proposalData', index, 'natureOfLoan']).patchValue(natureOfLoan);
  }

  addProposal() {
    const control = this.form.get('proposalData') as FormArray;
    control.push(this.buildProposalForm());
  }

  addOtherLoan() {
    const control = this.form.get('otherLoan') as FormArray;
    control.push(this.buildOtherLoanForm());
  }

  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.AGRICULTURE_OFFER_LETTER).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AGRICULTURE_OFFER_LETTER);
      } else {
        const  initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        this.form.patchValue(initialInfo, {emitEvent: false});
        this.selectedLoanArray = initialInfo.loanTypeSelectedArray;
        this.selectedNatureOfLoanArray = initialInfo.natureOfLoanTypeSelectedArray;
        this.chooseLoanType(this.selectedLoanArray);
        this.chooseNatureOfLoanType(this.selectedNatureOfLoanArray);
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.form.patchValue(initialInfo, {emitEvent: false});
        this.initialInfoPrint = initialInfo;
      }
    }
  }


  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.AGRICULTURE_OFFER_LETTER)
            .toString()) {
          this.form.get('loanTypeSelectedArray').patchValue(this.selectedLoanArray);
          this.form.get('natureOfLoanTypeSelectedArray').patchValue(this.selectedNatureOfLoanArray);
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AGRICULTURE_OFFER_LETTER);
      this.form.get('loanTypeSelectedArray').patchValue(this.selectedLoanArray);
      this.form.get('natureOfLoanTypeSelectedArray').patchValue(this.selectedNatureOfLoanArray);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Agriculture Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Agriculture Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }


  changeToNepAmount(event: any, target, from) {
    this.form.get([target]).patchValue(event.nepVal);
    this.form.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.form.get([target]).value;
    return patchValue1;
  }

  changeToNepAmountArray(event: any, i , formArrayName, target, from) {
    this.form.get([formArrayName, i, target]).patchValue(event.nepVal);
    this.form.get([formArrayName, i, from]).patchValue(event.val);
  }

  patchFunctionArray(formArrayName, i, formControlName) {
    const patchValue1 = this.form.get([formArrayName, i, formControlName]).value;
    return patchValue1;
  }

  calcYearlyRate(base , premium , target) {
    const baseRate = this.nepToEngNumberPipe.transform(this.form.get(base).value);
    const premiumRate = this.nepToEngNumberPipe.transform(this.form.get(premium).value);
    const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
    const finalValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.form.get(target).patchValue(finalValue);
  }

  chooseLoanType(selectedLoanTypeArray) {
    this.selectedLoanArray = selectedLoanTypeArray;
    this.commercialAgricultureAndLivestock = this.educatedYouthSelfEmployment = this.youthProjectLoanForReturneesFromAbroad
        = this.loansToWomenEntrepreneurs = this.dalitCommunityBusinessDevelopment = this.higherAndTechnicalAndVocationalEducation
        = this.textileIndustryOperation = this.trainingLoansFromInstitutionsRecognizedByTheTechnicalEducationAndVocationalTrainingCouncil
        = this.youthClassSelfEmployment = this.agricultureAndLivestockLoans = this.deprivedClassLoans
        = this.flexiLoan = false;
    selectedLoanTypeArray.forEach(selectedValue => {
      switch (selectedValue) {
        case 'CommercialAgricultureAndLivestock':
          this.commercialAgricultureAndLivestock = true;
          break;
        case 'EducatedYouthSelfEmploymentLoan':
          this.educatedYouthSelfEmployment = true;
          break;
        case 'YouthProjectLoanForReturneesFromAbroad':
          this.youthProjectLoanForReturneesFromAbroad = true;
          break;
        case 'LoansToWomenEntrepreneurs':
          this.loansToWomenEntrepreneurs = true;
          break;
        case 'DalitCommunityBusinessDevelopmentLoan':
          this.dalitCommunityBusinessDevelopment = true;
          break;
        case 'HigherAndTechnicalAndVocationalEducationLoans':
          this.higherAndTechnicalAndVocationalEducation = true;
          break;
        case 'TextileIndustryOperationLoan':
          this.textileIndustryOperation = true;
          break;
        case 'TrainingLoansFromInstitutionsRecognizedByTheTechnicalEducationAndVocationalTrainingCouncil':
          this.trainingLoansFromInstitutionsRecognizedByTheTechnicalEducationAndVocationalTrainingCouncil = true;
          break;
        case 'YouthClassSelfEmployment':
          this.youthClassSelfEmployment = true;
          break;
        case 'AgricultureAndLivestockLoans':
          this.agricultureAndLivestockLoans = true;
          break;
        case 'DeprivedClassLoans':
          this.deprivedClassLoans = true;
          break;
        case 'FlexiLoan':
          this.flexiLoan = true;
          break;
        case 'OtherLoans':
          this.otherLoans = true;
          break;
      }
    });
  }

  chooseNatureOfLoanType(selectedNatureOfLoanTypeArray) {
    this.selectedNatureOfLoanArray = selectedNatureOfLoanTypeArray;
    this.overdraft = this.termLoans = this.demandLoans
        = this.otherNatureOfLoans = false;
    selectedNatureOfLoanTypeArray.forEach(selectedValue => {
      switch (selectedValue) {
        case 'Overdraft':
          this.overdraft = true;
          break;
        case 'TermLoan':
          this.termLoans = true;
          break;
        case 'DemandLoans':
          this.demandLoans = true;
          break;
        case 'OtherNatureOfLoans':
          this.otherNatureOfLoans = true;
          break;
      }
    });
  }

  removeProposal(index: number) {
    (this.form.get('proposalData') as FormArray).removeAt(index);
  }

  removeOtherLoan(index: number) {
    (this.form.get('otherLoan') as FormArray).removeAt(index);
  }
}
