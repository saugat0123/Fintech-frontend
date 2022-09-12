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
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
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
  selectedInterestLoan = [];
  selectedReviewLoan = [];
  nepData;
  external = [];
  loanHolderInfo;
  loanTypes = [
    {key: 'CommercialAgricultureAndLivestock', nepValue: 'व्यावसायिक कृषि तथा पशुपन्छी', engValue: 'Commercial Agriculture and Livestock'},
    {key: 'EducatedYouthSelfEmployment', nepValue: 'शिक्षित युवा स्वरोजगार', engValue: 'Educated Youth Self Employment'},
    {key: 'YouthProjectLoanForReturneesFromAbroad', nepValue: 'विदेशबाट फर्केका युवा परियोजना', engValue: 'Youth Project Loan For Returnees From Abroad'},
    {key: 'LoansToWomenEntrepreneurs', nepValue: 'महिला उद्यमशिल', engValue: 'Loans to Women Entrepreneurs'},
    {key: 'DalitCommunityBusinessDevelopmentLoan', nepValue: 'दलित समुदाय व्यवसाय विकास', engValue: 'Dalit Community Business Development'},
    {key: 'HigherAndTechnicalAndVocationalEducationLoans', nepValue: 'उच्च र प्राविधिक तथा व्यावसायिक शिक्षा', engValue: 'Higher and Technical and Vocational Education'},
    {key: 'TextileIndustryOperationLoan', nepValue: 'कपडा उधोग सञ्चालन', engValue: 'Textile Industry Operation'},
    {key: 'TrainingLoansFromInstitutionsRecognizedByTheTechnicalEducationAndVocationalTrainingCouncil',
      nepValue: 'प्राविधिक शिक्षा तथा व्यावसायिक तालिम परिषद््बाट मान्यता प्राप्त संस्थाबाट लिईने तालिम',
      engValue: 'Training loans from institutions recognized by the Technical Education and Vocational Training Council'},
    {key: 'YouthClassSelfEmploymentLoan', nepValue: 'युवा बर्ग स्वरोजगार', engValue: 'Youth Class Self Employment'},
    {key: 'AgricultureAndLivestockLoans', nepValue: 'कृषि तथा पशुपन्छी', engValue: 'Agriculture and Livestock'},
    {key: 'DeprivedClassLoans', nepValue: 'विपन्न वर्ग', engValue: 'Deprived Class'},
    {key: 'FlexiLoan', nepValue: 'फ्लेक्सी', engValue: 'Flexi'},
    {key: 'OtherLoans', nepValue: 'अन्य', engValue: 'Other'}
  ];
  natureOfLoanTypes = [
      {key: 'Overdraft', nepValue: 'अधिविकर्ष', engValue: 'Overdraft'},
      {key: 'TermLoans', nepValue: 'आवधिक', engValue: 'Term'},
      {key: 'DemandLoans', nepValue: 'माग', engValue: 'Demand'},
      {key: 'OtherNatureOfLoans', nepValue: 'अन्य', engValue: 'Other'}
  ];
  loanTypesDropdown = [
    {key: 'TermLoans', value: 'आवधिक कर्जा (Term Loans)'},
    {key: 'Overdraft', value: 'अधिविकर्ष कर्जा (Overdraft Loans)'},
    {key: 'OtherNatureOfLoans', value: 'अन्य कर्जाहरु (Other Loans)'}
  ];
  interestLoanTypesDropdown = [
    {key: 'interestSubsidy', value: 'व्याज अनुदान कजा'},
    {key: 'OtherInterestLoans', value: 'अन्य कर्जा'}
  ];
  reviewDropdown = [
    {key: 'Revolving', value: 'नविकरण हुर्ने कर्जा'},
    {key: 'TermLoans', value: 'आवधिक प्रकृतीका कर्जा'},
    {key: 'OtherLoans', value: 'अन्य कर्जा'}
  ];
  listOfLoan = [];
  youthProjectLoanForReturneesFromAbroad = false;
  loansToWomenEntrepreneurs = false;
  commercialAgricultureAndLivestock = false;
  educatedYouthSelfEmployment = false;
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

  interestSubsidy = false;
  otherInterestLoans = false;

  revolving = false;
  termReviewLoans = false;
  otherReviewLoans = false;

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
              protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>) {
  }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetterData();
    this.chooseLoanType(this.selectedLoanArray);
    this.chooseNatureOfLoanType(this.selectedNatureOfLoanArray);
    this.chooseInterestLoanType(this.selectedInterestLoan);
    this.chooseReviewLoanType(this.selectedReviewLoan);
    this.listOfLoan.push(this.form.get('loanTypeSelectedArray').value);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      console.log(this.loanHolderInfo, 'this.loanHolderInfo');
    }
    if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
      this.form.patchValue({
        olRefNo: this.loanHolderInfo.miscellaneousDetail.offerReferenceNo ? this.loanHolderInfo.miscellaneousDetail.offerReferenceNo : '',
        olIssueDate: this.loanHolderInfo.miscellaneousDetail.offerIssueDate ? this.loanHolderInfo.miscellaneousDetail.offerIssueDate : '',
        borrowerName: this.loanHolderInfo.nepaliName ? this.loanHolderInfo.nepaliName : '',
        borrowerPerDis: this.loanHolderInfo.customerPermanentAddress.district ? this.loanHolderInfo.customerPermanentAddress.district : '',
        borrowerPerMun: this.loanHolderInfo.customerPermanentAddress.municipality ? this.loanHolderInfo.customerPermanentAddress.municipality : '',
        borrowerPerWard: this.loanHolderInfo.customerPermanentAddress.wardNo ? this.loanHolderInfo.customerPermanentAddress.wardNo : '',
        borrowerTempDis: this.loanHolderInfo.customerTemporaryAddress.district ? this.loanHolderInfo.customerTemporaryAddress.district : '',
        borrowerTempMun: this.loanHolderInfo.customerTemporaryAddress.municipality ? this.loanHolderInfo.customerTemporaryAddress.municipality : '',
        borrowerTempWard: this.loanHolderInfo.customerTemporaryAddress.wardNo ? this.loanHolderInfo.customerTemporaryAddress.wardNo : '',
        borrowerTempTole: this.loanHolderInfo.customerTemporaryAddress.tole ? this.loanHolderInfo.customerTemporaryAddress.tole : '',
        borrowerMobileNo: this.loanHolderInfo.contactNo ? this.loanHolderInfo.contactNo : '',
        drawdownPercent: this.loanHolderInfo.miscellaneousDetail.drawdownPer ? this.loanHolderInfo.miscellaneousDetail.drawdownPer : '',
        // surakchyanName: this.loanHolderInfo.collateralDetails[0].nameInNepali ? this.loanHolderInfo.collateralDetails[0].nameInNepali : '',
        // surakchyanDis: this.loanHolderInfo.collateralDetails[0].district ? this.loanHolderInfo.collateralDetails[0].district : '',
        // surakchyanMun: this.loanHolderInfo.collateralDetails[0].municipality ? this.loanHolderInfo.collateralDetails[0].municipality : '',
        // surakchyanWard: this.loanHolderInfo.collateralDetails[0].wardNo ? this.loanHolderInfo.collateralDetails[0].wardNo : '',
        // surakchyanKittaNo: this.loanHolderInfo.collateralDetails[0].plotNo ? this.loanHolderInfo.collateralDetails[0].plotNo : '',
        // surakchyanArea: this.loanHolderInfo.collateralDetails[0].area ? this.loanHolderInfo.collateralDetails[0].area : '',
        // perGuarantorName: this.loanHolderInfo.guarantorDetails[0].name ? this.loanHolderInfo.guarantorDetails[0].name : '',
        // guarantorName: this.loanHolderInfo.guarantorDetails[0].name ? this.loanHolderInfo.guarantorDetails[0].name : '',
        branchName: this.loanHolderInfo.branchDetail.branchNameInNepali ? this.loanHolderInfo.branchDetail.branchNameInNepali : '',
        branchDis: this.loanHolderInfo.branchDetail.branchDistrict ? this.loanHolderInfo.branchDetail.branchDistrict : '',
        branchTelNo: this.loanHolderInfo.branchDetail.branchTelNo ? this.loanHolderInfo.branchDetail.branchTelNo : '',
        branchFax: this.loanHolderInfo.branchDetail.branchFaxNo ? this.loanHolderInfo.branchDetail.branchFaxNo : '',
      });
      this.form.get(['proposalData', 0, 'sanctionedLmt']).patchValue(this.loanHolderInfo.miscellaneousDetail.loanAmountInFig);
      this.form.get(['proposalData', 0, 'sanctionedLmtInWord']).patchValue(this.loanHolderInfo.miscellaneousDetail.loanAmountInWord);
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
      perGuarantorName: [undefined],
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
      natureOfLoanTypeSelectedArray: [undefined],
      interestLoanTypeSelectedArray: [undefined],
      reviewLoanTypeSelectedArray: [undefined],
      tenureTermLoan: [undefined],
      otherTenureLoan : [undefined],
      noOfEmi: [undefined],
      repaymentTermLoan: [undefined],
      repaymentEngDate: [undefined],
      proposalData: this.formBuilder.array([this.buildProposalForm()]),
      loanAdminFee: [undefined],
      loanRenewFee: [undefined],
      loanAdminFeeNonFunded: [undefined],
      baseRate: [undefined],
      dcgfPremium: [undefined],
      otherFeeName: [undefined],
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
      hpAmount: [undefined],
      hpAmountInWord: [undefined],
      plantAmount: [undefined],
      plantAmountInWord: [undefined],
      otherFee: this.formBuilder.array([this.buildAddMoreForm()]),
      checkLoanAdmin: true,
      checkLoanRenewal: true,
      checkLoanAdminFeeNonFunded: true,
      checkCommitment: true,
      checkDcgfPremium: true,
      checkOtherLoan: true,
      securityA: true,
      securityB: true,
      securityC: true,
      securityD: true,
      securityE: true,
      securityF: true,
      securityG: true,
      securityJ: true,
      securityL: true,
      securityN: true,
      securityO: true,
      securityP: true,
      securityR: this.formBuilder.array([this.buildAddMoreForm()]),
      chkSplCovenant: true,
      covenants: this.formBuilder.array([this.buildAddMoreForm()]),
      selectReview: [undefined],
      checkCovenant: true,
      checkBranch: true
    });
  }

  buildProposalForm() {
    return this.formBuilder.group({
      facilityType: [undefined],
      natureOfLoan: [undefined],
      isOtherLoan: false,
      otherNatureOfLoanInNep: [undefined],
      otherNatureOfLoanInEng: [undefined],
      sanctionedLmt: [undefined],
      sanctionedLmtInWord: [undefined],
      purpose: [undefined],
      drawdown: [undefined],
      drawdownPercent: [undefined],
      selectLoanTypeTenure: [undefined],
      selectLoanTypeRepay: [undefined],
      selectLoanTypeInterest: [undefined],
      tenureTermLoan: [undefined],
      otherTenureLoan: [undefined],
      noOfEmi: [undefined],
      repaymentTermLoan: [undefined],
      repaymentEngDate: [undefined],
      firstInstallment: [undefined],
      emiAmount: [undefined],
      emiAmountInWords: [undefined],
      nextReviewDate: [undefined],
      otherRepaymentLoan: [undefined],
      premium: [undefined],
      subsidy: [undefined],
      interest: [undefined],
      interestOtherLoan: [undefined],
      subsidyPeriod: [undefined],
      checkInterestSubsidy: true
    });
  }

  buildAddMoreForm() {
    return this.formBuilder.group({
      addField: [undefined],
    });
  }

  checkProposal(e, index, value) {
    if (e.target.selected) {
      this.form.get(['proposalData', index, value]).patchValue(value);
    }
  }

  checkFacilityType(facilityType, index) {
    this.form.get(['proposalData', index, 'facilityType']).patchValue(facilityType);

  }

  checkNatureOfLoan(natureOfLoan, index) {
    this.form.get(['proposalData', index, 'natureOfLoan']).patchValue(natureOfLoan);
  }

  checkLoanType(selectLoanType, index) {
    this.form.get(['proposalData', index, 'selectLoanType']).patchValue(selectLoanType);
  }

  checkReview(selectReview) {
    this.form.get('selectReview').patchValue(selectReview);
  }

  addProposal() {
    const control = this.form.get('proposalData') as FormArray;
    control.push(this.buildProposalForm());
  }

  setProposal(details) {
    const proposal = this.form.get('proposalData') as FormArray;
    details.forEach(data => {
      proposal.push(
          this.formBuilder.group({
            facilityType: [data.facilityType],
            natureOfLoan: [data.natureOfLoan],
            isOtherLoan: [data.isOtherLoan],
            otherNatureOfLoanInNep: [data.otherNatureOfLoanInNep],
            otherNatureOfLoanInEng: [data.otherNatureOfLoanInEng],
            sanctionedLmt: [data.sanctionedLmt],
            sanctionedLmtInWord: [data.sanctionedLmtInWord],
            purpose: [data.purpose],
            drawdown: [data.drawdown],
            drawdownPercent: [data.drawdownPercent],
            selectLoanTypeTenure: [data.selectLoanTypeTenure],
            selectLoanTypeRepay: [data.selectLoanTypeRepay],
            selectLoanTypeInterest: [data.selectLoanTypeInterest],
            tenureTermLoan: [data.tenureTermLoan],
            otherTenureLoan: [data.otherTenureLoan],
            noOfEmi: [data.noOfEmi],
            repaymentTermLoan: [data.repaymentTermLoan],
            repaymentEngDate: [data.repaymentEngDate],
            firstInstallment: [data.firstInstallment],
            emiAmount: [data.emiAmount],
            emiAmountInWords: [data.emiAmountInWords],
            nextReviewDate: [data.nextReviewDate],
            otherRepaymentLoan: [data.otherRepaymentLoan],
            premium: [data.premium],
            subsidy: [data.subsidy],
            interest: [data.interest],
            interestOtherLoan: [data.interestOtherLoan],
            subsidyPeriod: [data.subsidyPeriod],
            checkInterestSubsidy: [data.checkInterestSubsidy]
          })
      );
    });
  }

  setMore(details, formArrayName) {
    const addMore = this.form.get(formArrayName) as FormArray;
    details.forEach(data => {
      addMore.push(
          this.formBuilder.group({
            addField: [data.addField],
          })
      );
    });
  }

  addMore(formArrayName) {
    const control = this.form.get(formArrayName) as FormArray;
    control.push(this.buildAddMoreForm());
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
        this.selectedInterestLoan = initialInfo.interestLoanTypeSelectedArray;
        this.selectedReviewLoan = initialInfo.reviewLoanTypeSelectedArray;
        this.chooseLoanType(this.selectedLoanArray);
        this.chooseNatureOfLoanType(this.selectedNatureOfLoanArray);
        this.setProposal(initialInfo.proposalData);
        this.setMore(initialInfo.otherFee, 'otherFee');
        this.setMore(initialInfo.securityR, 'securityR');
        this.setMore(initialInfo.covenants, 'covenants');
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.form.patchValue(initialInfo, {emitEvent: false});
        this.initialInfoPrint = initialInfo;
      }
    }
  }

  onCheck(e, i, formControlName) {
      if (e.target.checked) {
        this.form.get(['proposalData', i, formControlName]).patchValue(true);
      } else {
        this.form.get(['proposalData', i, formControlName]).patchValue(false);
      }
  }

  onCheck2(e, formControlName) {
    if (e) {
      this.form.get(formControlName).patchValue(e.target.checked);
    } else {
      this.form.get(formControlName).patchValue(e.target.value);
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
          this.form.get('interestLoanTypeSelectedArray').patchValue(this.selectedInterestLoan);
          this.form.get('reviewLoanTypeSelectedArray').patchValue(this.selectedReviewLoan);
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AGRICULTURE_OFFER_LETTER);
      this.form.get('loanTypeSelectedArray').patchValue(this.selectedLoanArray);
      this.form.get('natureOfLoanTypeSelectedArray').patchValue(this.selectedNatureOfLoanArray);
      this.form.get('interestLoanTypeSelectedArray').patchValue(this.selectedInterestLoan);
      this.form.get('reviewLoanTypeSelectedArray').patchValue(this.selectedReviewLoan);
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

  chooseInterestLoanType(selectedInterestLoanTypeArray) {
    this.selectedInterestLoan = selectedInterestLoanTypeArray;
    this.overdraft = this.termLoans = this.demandLoans
        = this.otherNatureOfLoans = false;
    selectedInterestLoanTypeArray.forEach(selectedValue => {
      switch (selectedValue) {
        case 'interestSubsidy':
          this.interestSubsidy = true;
          break;
        case 'OtherInterestLoans':
          this.otherInterestLoans = true;
          break;
      }
    });
  }

  chooseReviewLoanType(selectedReviewLoanTypeArray) {
    this.selectedReviewLoan = selectedReviewLoanTypeArray;
    this.overdraft = this.termLoans = this.demandLoans
        = this.otherNatureOfLoans = false;
    selectedReviewLoanTypeArray.forEach(selectedValue => {
      switch (selectedValue) {
        case 'Revolving':
          this.revolving = true;
          break;
        case 'TermLoans':
          this.termReviewLoans = true;
          break;
        case 'OtherLoans':
          this.otherReviewLoans = true;
          break;
      }
    });
  }

  removeProposal(index: number) {
    (this.form.get('proposalData') as FormArray).removeAt(index);
  }

  removeAddMore(index: number, formArrayName) {
    (this.form.get(formArrayName) as FormArray).removeAt(index);
  }
}
