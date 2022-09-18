import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferLetteDocrTypeEnum} from '../../../model/OfferLetteDocrTypeEnum';
import {OfferLetterDocType} from '../../../../cad-documents/cad-document-core/model/OfferLetteDocrTypeEnum';
import {ToastService} from '../../../../../@core/utils';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {OfferDocument} from '../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';

@Component({
  selector: 'app-offer-letter-of-all-other-loan-retail-loan',
  templateUrl: './offer-letter-of-all-other-loan-retail-loan.component.html',
  styleUrls: ['./offer-letter-of-all-other-loan-retail-loan.component.scss']
})
export class OfferLetterOfAllOtherLoanRetailLoanComponent implements OnInit {

    RetailLoan: FormGroup;
    // todo replace enum constant string compare
    smeLoanHolderInfo;
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    selectedLoanTypeArray = [];
    overdraft = false;
    demandLoan = false;
    fixedTermLoan = false;
    hirePurchase = false;
    letterOfCredit = false;
    trustReceipt = false;
    cashCredit = false;
    shortTermLoan = false;
    bankGuarantee = false;
    listOfLoan = [];
    loanTypes = [
        {key: 'Overdraft', value: 'अधिबिकर्ष(Overdraft)'},
        {key: 'DemandLoan', value: 'डिमाण्ड कर्जा(Demand Loan)'},
        {key: 'FixedTermLoan', value: 'आवधिक कर्जा (Fixed Term Loan)'},
        {key: 'HirePurchase', value: 'सवारी साधन कर्जा (Hire Purchase)'},
        {key: 'LetterOfCredit', value: 'प्रतितपत्र (Letter of Credit)'},
        {key: 'TrustReceipt', value: 'विश्वास रसीद (Trust Receipt)'},
        {key: 'CashCredit', value: 'नगद क्रेडिट (Cash Credit)'},
        {key: 'ShortTermLoan', value: 'अल्पकालीन कर्जा (Short Term Loan)'},
        {key: 'BankGuarantee', value: 'बैंक जमानत (Bank Guarantee)'},
    ];
    ckeConfig = NepaliEditor.CK_CONFIG;
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    facility = ['आवास कर्जा (Home Loan)',  'शैक्षिक कर्जा (Education Loan),',
    'ब्यक्तिगत अधिविकर्ष (Personal Overdraft)', 'व्यक्तिगत आवधिक कर्जा (Personal Term Loan)',
    'Rastra Sewak Karja (राष्ट्र सेवक कर्जा)', ' फ्लेक्सी कर्जा (Flexi Loans)'];
    purposeValue = [' व्यक्तिगत आर्थिक आवश्यकता पूर्ति गर्न ।', 'उच्च शिक्षाका लागि ।',
    'कर्जा भुक्तानी गर्न ।', 'जग्गा खरिद गर्न ।', 'घर निमार्ण तथा मर्मत गर्दा लिएको कर्जा भुक्तनी गर्न ।',
    'घर खरिद गर्दा लिएको कर्जा भुक्तानी गर्न ।', 'घर खरिद गर्न ।', ' घर निर्माण गर्ने प्रयोजनको लागि ।',
    'ब्यापारमा लगानी गनर् ।', 'खरिद जग्गामा पुनः लगानी गर्न र व्यक्तिगत आर्थिक आवश्यकता पूर्ति गर्न ।',
    ' घरजग्गामा पुनः लगानी गन ।', 'ब्यापारमा लगानी गर्न ।', 'Other' ];
    drawDown = ['वार्षिक रुपमा घरलाने तलबको २ गुणासम्म ।', 'धितो सुरक्षण लगायत कर्जा सम्वन्धि', 'कर्जा रकम'];
    repaymentValue = ['यो कर्जाको भुक्तानी मोर्‍याटाेरियम अवधि बाहेक (EQI)', 'यो कर्जाको भुक्तानी मोर्‍याटाेरियम अवधि बाहेक (Equated Monthly Installment)',
    'यो अधिविकर्ष सुविधा को सीमा कर्जा प्रवाह भएको मितिले'];
    dhitoSurachanValue = '<p style=\"text-align:justify\"><span style=\"font-size:14px\">धितो सुरक्षण लगायत कर्जा सम्वन्धि सवै लिखतहरु स्वीकार गरी बैंकमा वुझाए पछि स्वीकृत कर्जा तथा सुविधा वा सुरक्षणमा दिईएको घरजग्गाको फेयर मार्केट मूल्य <span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\">(Fair Market Value) </span></span> को ================================ प्रतिशत मध्ये कम हुने रकम बराबरको कर्जा रकम उपभोग गर्न सकिनेछ ।</span></p>\n';
    karjaRakumValue = '<p style=\"text-align:justify\"><span style=\"font-size:14px\">कर्जा रकम ================= चरण प्रवाह गरिने छ । पहिलो चरणमा बैंकमा गर्नूपर्ने आवश्यक कर्जाका कागजातहरु&divide;तमसूकहरु गरे पश्चात र धितो सूरक्षण स्वरुप उपलब्ध गराईएको स्थिर सम्पत्ती यस बैंकको नाममा धितो वन्धकीको लिखत लेखी सम्वन्धित मालपोत कार्यालयमा गई रजिष्ट्रेशन पारित गरिदिए पछि <strong>रू ========================&divide;&ndash; <span style=\"font-family:&quot;Times New Roman&quot;,serif\">(</span>अक्षरेपी रुपैया ===================== मात्र<span style=\"font-family:&quot;Times New Roman&quot;,serif\">)</span></strong>&nbsp;प्रवाह गरिने छ । दोस्रो चरणमा यस बैंकको सुचीकृत मुल्यांकन कर्ताले मुल्यांकन गरेको भवन निर्माण लागतको प्रगती विवरण <span style=\"font-family:&quot;Times New Roman&quot;,serif\">(Progress Report)&nbsp;</span>को आधारमा रहि <strong>रू ========================&divide;&ndash; <span style=\"font-family:&quot;Times New Roman&quot;,serif\">(</span>अक्षरेपी रुपैया ================== मात्र<span style=\"font-family:&quot;Times New Roman&quot;,serif\">)</span></strong>&nbsp;प्रवाह गरिनेछ । तेश्रो तथा &nbsp;चौथो चरणमा कूल कर्जा सिमा भित्र रही धितो सूरक्षण वापत रहने अचल सम्पत्तीको फेयर मार्केट मुल्य <span style=\"font-family:&quot;Times New Roman&quot;,serif\">(Fair Market Value)</span> को ===================== प्रतिशत वा कूल भवन निर्माण लागतको ======================== प्रतिशत ननाघ्ने गरि बांकी कर्जा सिमा <strong>रू ===========================&divide;&ndash; <span style=\"font-family:&quot;Times New Roman&quot;,serif\">(</span>अक्षरेपी रुपैया ========================= मात्र<span style=\"font-family:&quot;Times New Roman&quot;,serif\">)</span></strong>&nbsp;प्रवाह गरिनेछ । अन्तिम चरणको कर्जा प्रवाह गर्नू पुर्व सम्बन्धित निकायबाट भवन निर्माण सम्पन्नताको प्रमाण यस बैंकमा पेश गर्नू पर्नेछ ।</span></p>\n';
    repaymentOneValue = '<p style=\"text-align:justify\"><span style=\"font-size:14px\">यो कर्जाको भुक्तानी मो&yen;याटोरियम अवधि बाहेक =========================================&nbsp;समान त्रैमासिक किस्ता </span><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\"><span style=\"font-size:12.5pt\">(EQI)</span>&nbsp;</span></span><span style=\"font-size:14px\">रुपमा त्रयमास भन्नाले आषाढ, आश्विन, पौष तथा चैत्र मसान्तमा लिइनेछ, तर कर्जा प्रवाह भएको पहिलो किस्ताको रकम भुक्तानी सम्बन्धमा पहिलो पटकका लागि दिन गणना गरी ब्याज रकम मात्र लिइनेछ, दोस्रो पटकदेखि नियमित साँवा&ndash;ब्याज ============================= समान त्रैमासिक किस्ता प्रति किस्ता अनुमानित <strong>रु</strong> ==================================== </span><strong><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\"><span style=\"font-size:12.5pt\">(</span></span></span></strong><span style=\"font-size:14px\"><strong>अक्षरुपि </strong>=================================== <strong>मात्र</strong></span><strong><span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\"><span style=\"font-size:12.5pt\">)</span></span></span></strong><span style=\"font-size:14px\">&nbsp;का दरले बुझाउनु पर्नेछ ।</span></p>\n';
    repaymentTwoValue = '<p style=\"text-align:justify\"><span style=\"font-size:14px\">यो कर्जाको भुक्तानी मोर्&zwj;याटाेरियम अवधि बाहेक <strong>===========================</strong>&nbsp;समान मासिक किस्ता <span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\">(Equated Monthly Installment)&nbsp;</span></span>रुपमा लिइनेछ, &nbsp;तर कर्जा प्रवाह भएको पहिलो मासिक किस्ताको रकम भुक्तानी सम्बन्धमा पहिलो पटकका लागि दिन गणना गरी ब्याज रकम मात्र लिइनेछ, दोस्रो पटकदेखि नियमित साँवा&ndash;ब्याज अनुमानित <strong>&nbsp;रु&nbsp;&nbsp;=========================== <span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\">(</span></span>अक्षरेपि ===========================<span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\">)&nbsp;</span></span></strong>&nbsp;का दरले बुझाउनु पर्नेछ।</span></p>\n';
    repaymentThreeValue = '<p><span style=\"font-size:14px\">यो अधिविकर्ष सुविधा को सीमा कर्जा प्रवाह भएको मितिले <strong>=========================&nbsp;</strong>सम्मका लागि हुनेछ । सन्तोषजनक कारोवारको अवस्थामा बैंकले स्वीकृत सीमा अवधि पटक पटक बढाउन सक्नेछ । तर, बैंकले चाहेको बखतमा सो तोकेको समयावधि भन्दा अघि नै ऋणीलाई जानकारी दिई वा नदिई स्वीकृत कर्जा सुविधाको सीमा रद्द गर्न सक्नेछ ।</span></p>\n';
    tenureValue = ['मोर्‍याटाेरियम अवधि (Moratorium Period)', 'कर्जाको भुक्तानी कर्जा'];
    tenureOneValue = '<p><span style=\"font-size:14px\">मोर्&zwj;याटाेरियम अवधि <span style=\"font-family:&quot;Times New Roman&quot;,serif\"><span style=\"color:black\">(</span></span><span style=\"font-family:&quot;Times New Roman&quot;,serif\">Moratorium Period<span style=\"color:black\">)</span></span><span style=\"font-family:Preeti\">&nbsp;</span>सहित कर्जा प्रवाह भएको मितिले <strong>===========================&nbsp;</strong>वर्ष सम्म मात्र ।</span></p>\n';
    tenureTwoValue = '<p><span style=\"font-size:14px\">कर्जाको भुक्तानी कर्जा प्रवाह भएको मितिले&nbsp;<strong>&nbsp;===========================</strong> वर्ष भित्र हुनेछ ।</span></p>\n';
    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetterData();
        this.chooseLoanType(this.selectedLoanTypeArray);
        this.listOfLoan.push(this.RetailLoan.get('loanTypeSelectedArray').value);
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder.nepData)) {
            this.smeLoanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.smeLoanHolderInfo)) {
            this.RetailLoan.patchValue({
                olRefNo: this.smeLoanHolderInfo.miscellaneousDetail.offerReferenceNo ? this.smeLoanHolderInfo.miscellaneousDetail.offerReferenceNo : '',
                olIssueDate: this.smeLoanHolderInfo.miscellaneousDetail.offerIssueDate ? this.smeLoanHolderInfo.miscellaneousDetail.offerIssueDate : '',
                borrowerName: this.smeLoanHolderInfo.nepaliName ? this.smeLoanHolderInfo.nepaliName : '',
                borrowerPerDis: this.smeLoanHolderInfo.institutionRegisteredAddress.district ? this.smeLoanHolderInfo.institutionRegisteredAddress.district : '',
                borrowerPerMun: this.smeLoanHolderInfo.institutionRegisteredAddress.municipality ? this.smeLoanHolderInfo.institutionRegisteredAddress.municipality : '',
                borrowerPerWard: this.smeLoanHolderInfo.institutionRegisteredAddress.wardNo ? this.smeLoanHolderInfo.institutionRegisteredAddress.wardNo : '',
                borrowerPerTole: this.smeLoanHolderInfo.institutionRegisteredAddress.tole ? this.smeLoanHolderInfo.institutionRegisteredAddress.tole : '',
                borrowerTempDis: this.smeLoanHolderInfo.institutionCurrentAddress.district ? this.smeLoanHolderInfo.institutionCurrentAddress.district : '',
                borrowerTempMun: this.smeLoanHolderInfo.institutionCurrentAddress.municipality ? this.smeLoanHolderInfo.institutionCurrentAddress.municipality : '',
                borrowerTempWard: this.smeLoanHolderInfo.institutionCurrentAddress.wardNo ? this.smeLoanHolderInfo.institutionCurrentAddress.wardNo : '',
                borrowerTempTole: this.smeLoanHolderInfo.institutionCurrentAddress.tole ? this.smeLoanHolderInfo.institutionCurrentAddress.tole : '',
                drawdownPercent: this.smeLoanHolderInfo.miscellaneousDetail.drawdownPer ? this.smeLoanHolderInfo.miscellaneousDetail.drawdownPer : '',
                // surakchyanName: this.loanHolderInfo.collateralDetails[0].nameInNepali ? this.loanHolderInfo.collateralDetails[0].nameInNepali : '',
                // surakchyanDis: this.loanHolderInfo.collateralDetails[0].district ? this.loanHolderInfo.collateralDetails[0].district : '',
                // surakchyanMun: this.loanHolderInfo.collateralDetails[0].municipality ? this.loanHolderInfo.collateralDetails[0].municipality : '',
                // surakchyanWard: this.loanHolderInfo.collateralDetails[0].wardNo ? this.loanHolderInfo.collateralDetails[0].wardNo : '',
                // surakchyanKittaNo: this.loanHolderInfo.collateralDetails[0].plotNo ? this.loanHolderInfo.collateralDetails[0].plotNo : '',
                // surakchyanArea: this.loanHolderInfo.collateralDetails[0].area ? this.loanHolderInfo.collateralDetails[0].area : '',
                // perGuarantorName: this.loanHolderInfo.guarantorDetails[0].name ? this.loanHolderInfo.guarantorDetails[0].name : '',
                // guarantorName: this.loanHolderInfo.guarantorDetails[0].name ? this.loanHolderInfo.guarantorDetails[0].name : '',
                branchName: this.smeLoanHolderInfo.branchDetail.branchNameInNepali ? this.smeLoanHolderInfo.branchDetail.branchNameInNepali : '',
                branchDis: this.smeLoanHolderInfo.branchDetail.branchDistrict ? this.smeLoanHolderInfo.branchDetail.branchDistrict : '',
                branchTelNo: this.smeLoanHolderInfo.branchDetail.branchTelNo ? this.smeLoanHolderInfo.branchDetail.branchTelNo : '',
                branchFax: this.smeLoanHolderInfo.branchDetail.branchFaxNo ? this.smeLoanHolderInfo.branchDetail.branchFaxNo : '',
            });
            // this.form.get(['proposalData', 0, 'sanctionedLmt']).patchValue(this.loanHolderInfo.miscellaneousDetail.loanAmountInFig);
            // this.form.get(['proposalData', 0, 'sanctionedLmtInWord']).patchValue(this.loanHolderInfo.miscellaneousDetail.loanAmountInWord);
        }
    }

    buildForm() {
        this.RetailLoan = this.formBuilder.group({
            olRefNo: [undefined],
            olIssueDate: [undefined],
            borrowerName: [undefined],
            registeredDistrict: [undefined],
            instRegVdcMun: [undefined],
            instRegWardNo: [undefined],
            toleName: [undefined],
            instRegProvince: [undefined],
            instRegDist: [undefined],
            tempMunicipality: [undefined],
            tempWardNo: [undefined],
            toleOrVillageName: [undefined],
            houseNumber: [undefined],
            street: [undefined],
            authPersonEmail: [undefined],
            authPersonMobileNo: [undefined],
            postBox: [undefined],
            overdraftLoan: this.formBuilder.array([]),
            adminFeeNonFundedAmt: [undefined],
            adminFeeNonFundedAmtWord: [undefined],
            averageBaseRate: [undefined],
            quarterlyAverageRate: [undefined],
            quarterlyAveragePercent: [undefined],
            interestRate: [undefined],
            isCommitmentCharge: [undefined],
            isFreeTextOne: [false],
            freeTextOne: [undefined],
            facOwnerName: [undefined],
            facOffice: [undefined],
            facDistrict: [undefined],
            facVdcMun: [undefined],
            facWardNo: [undefined],
            facCurrentDistrict: [undefined],
            facCurrentVdcMun: [undefined],
            facCurrentWardNo: [undefined],
            facCurrentTole: [undefined],
            plotNo: [undefined],
            plotArea: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            isFreeTextTwo: [false],
            freeTextTwo: [undefined],
            valuatorName: [undefined],
            fmvAmount: [undefined],
            dvAmount: [undefined],
            dvAmountInWord: [undefined],
            customerName: [undefined],
            guarantorNameOne: [undefined],
            guarantorNameTwo: [undefined],
            isFreeTextThree: [false],
            freeTextThree: [undefined],
            securityArray: this.formBuilder.array([]),
            premiumRate: [undefined],
            postBoxNumber: [undefined],
            branchName: [undefined],
            borrowerName2: [undefined],
            borrowerPerDis: [undefined],
            borrowerPerMun: [undefined],
            borrowerPerWard: [undefined],
            borrowerPerTole: [undefined],
            borrowerTempProvince: [undefined],
            borrowerTempDis: [undefined],
            borrowerTempMun: [undefined],
            borrowerTempWard: [undefined],
            borrowerTempTole: [undefined],
            borrowerHouseNo: [undefined],
            borrowerTempStreet: [undefined],
            borrowerEmail: [undefined],
            borrowerMobile: [undefined],
            faxNumber: [undefined],
            freeTextFour: [undefined],
            freeTextFive: [undefined],
            freeTextSix: [undefined],
            freeTextSeven: [undefined],
            freeTextEight: [undefined],
            freeTextNine: [undefined],
            loanReviewDate: [undefined],
            individualBorrowerName: [undefined],
            individualBorrowerPerDis: [undefined],
            individualBorrowerPerMun: [undefined],
            individualBorrowerPerWard: [undefined],
            individualBorrowerTole: [undefined],
            individualTempProvince: [undefined],
            individualTempDistrict: [undefined],
            individualTempMun: [undefined],
            individualTempWard: [undefined],
            individualTempTole: [undefined],
            individualBorrowerHouseNo: [undefined],
            individualTempStreet: [undefined],
            individualBorrowerEmail: [undefined],
            individualBorrowerMobile: [undefined],
            faxOrPostBoxNo: [undefined],
            sachiOne: [undefined],
            sachiTwo: [undefined],
            docWrittenYear: [undefined],
            docWrittenMonth: [undefined],
            docWrittenDay: [undefined],
            docWrittenWeek: [undefined],
            guarantorName: [undefined],
            guarantorPerDistrict: [undefined],
            guarantorPerVdcMun: [undefined],
            guarantorPerWard: [undefined],
            guarantorTempPradesh: [undefined],
            guarantorTempDist: [undefined],
            guarantorTempVdcMun: [undefined],
            guarantorTempWard: [undefined],
            guarantorTempTole: [undefined],
            guarantorTempHouseNo: [undefined],
            guarantorTempStreetName: [undefined],
            guarantorEmail: [undefined],
            guarantorMobile: [undefined],
            date: [undefined],
            isNeeded: [true],
            totalYear: [undefined],


            minChargeAmtWordSme: [undefined],
            minChargeAmtSme: [undefined],
            emiAmtInWordSme: [undefined],
            emiAmtSme: [undefined],
            loanAmountInWordSme: [undefined],
            loanAmountSme: [undefined],
            overdrafLoanPrices: [undefined],
            address: [undefined],
            to: [undefined],
            sector: [undefined],
            mobileNo: [undefined],
            name: [undefined],
            borrowerLoanType: [undefined],

            loanBorrowerOneName: [undefined],
            loanBorrowerAddress: [undefined],
            loanBorrowerContactNo: [undefined],
            loanBorrowerName: [undefined],
            signatureDate: [undefined],
            totalLoanAmount: [undefined],
            totalLoanAmountInWord: [undefined],
            currentNonMovableAsset: [undefined],
            equalLoanAsset: [undefined],
            loanAsset: [undefined],
            loanTypeSelectedArray: [undefined],
            printPageCount: [undefined],
            demandLoanType: this.formBuilder.array([]),
            fixTermLoan: this.formBuilder.array([]),
            hirePurchaseLoan: this.formBuilder.array([]),
            letterOfCredit: this.formBuilder.array([]),
            trustReceipt: this.formBuilder.array([]),
            cashCredit: this.formBuilder.array([]),
            shortTermLoan: this.formBuilder.array([]),
            bankGuarantee: this.formBuilder.array([]),
            multiCollateral: this.formBuilder.array([]),
            tableData: this.formBuilder.array([]),
            securityNotes: [undefined],
            citizenShipNo1: [undefined],
            citizenShipNo2: [undefined],
            tempMun: [undefined],
            tempDis: [undefined],
            tempWard: [undefined],
            wardNo: [undefined],
            onlySelf: [undefined],
            faxNo: [undefined],
            branchDis: [undefined],
            marfatBank: [undefined],
            branchTelNo: [undefined],
            branchFax: [undefined],
            compRegOffice: [undefined],
            authPersonName: [undefined],
            authPersonDist: [undefined],
            authPersonVdcMun: [undefined],
            authPersonWard: [undefined],
            noOfVehiclesToFinance: [undefined],
            vehicleModel: [undefined],
            reviewYearIncreased: [undefined],
            DebtEquityAmount: [undefined],
            vatBillPercent: [undefined],
            voucher1District: [undefined],
            voucher1VdcMun: [undefined],
            voucher1Ward: [undefined],
            voucher2District: [undefined],
            voucher2VdcMun: [undefined],
            voucher2Ward: [undefined],
            adminFeeFundedAmt: [undefined],
            adminFeeFundedAmtWord: [undefined],
            fiscalYear: [undefined],
            quarter: [undefined],
            sawariSadhan: [undefined],
            assestNepali: [undefined],
            assestEnglish: [undefined],
            bankersClause: [undefined],
            fmvAmountInWord: [undefined],
            totaladminFeeNonFundedAmtWord: [undefined],
            totaladminFeeNonFundedAmt: [undefined]
        });

    }

    overdraftFormGroup(): FormGroup {
        return this.formBuilder.group({
            facilityType: [undefined],
            adminFeeNonFundedAmt: [undefined],
            adminFeeNonFundedAmtWord: [undefined],
            purposeOfLoan: [undefined],
            otherPurpose: [undefined],
            drawDrown: [undefined],
            dhitoSurachan: [undefined],
            karjaRakum: [undefined],
            loanRepayment: [undefined],
            repaymentOne: [undefined],
            repaymentTwo: [undefined],
            repaymentThree: [undefined],
            tenure: [undefined],
            tenureOne: [undefined],
            tenureTwo: [undefined],
            premiumBaseRate: [undefined],
            totalMonth: [undefined],
            totalMonthOne: [undefined],
            moratoriumPeriodArray: this.formBuilder.array([]),
            interest: [undefined],
            amount: [undefined],
            amountInWord: [undefined],
            loanPeriod: [undefined],
            baseRate: [undefined],
            loanAmountInWord: [undefined],
            loanAmount: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            overdrafLoanEndOfFiscalYear: [undefined],
            overdrafLoanPayment: [undefined],
            overdrafLoanServiceRate: [undefined],
            serviceChargeAmount: [undefined],
            overdrafLoanPrices: [undefined],
            overdrafLoanReturned: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],

            loanReviewDate: [undefined],
            preview: [undefined],
            drawdownPercent: [undefined],
            purposeDate: [undefined]
        });
    }

    addMoreOverdraftLoan() {
        (this.RetailLoan.get('overdraftLoan') as FormArray).push(this.overdraftFormGroup());
    }

    removeOverDraftLoan(index: number) {
        (this.RetailLoan.get('overdraftLoan') as FormArray).removeAt(index);
    }

    demandRetailLoanGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            demandLoanPurpose: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            demandLoanNetTradingAsset: [undefined],
            demandLoanLimitDuration: [undefined],
            demandLoanLimitDurationAmount: [undefined],
            demandLoanDasturAmount: [undefined],
            yearlyRate: [undefined],
            demandLoanDurationRatio: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            purposeOfLoan: [undefined],
            loanReviewDate: [undefined],
            purpose: [undefined],
            preview: [undefined],
            drawdownPercent: [undefined],
            noOfEmi: [undefined],
            emiAmtInWord: [undefined],
            emiAmt: [undefined],
            engDate: [undefined],
            premiumInterestRate: [undefined],
        });
    }

    addMoreDemandLoan() {
        (this.RetailLoan.get('demandLoanType') as FormArray).push(this.demandRetailLoanGroup());
    }

    removeDemandLoan(index: number) {
        (this.RetailLoan.get('demandLoanType') as FormArray).removeAt(index);
    }

    fixTermRetailLoanGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            termLoanPlanBankName: [undefined],
            termLoanTime: [undefined],
            termLoanMonthlyTerm: [undefined],
            loanAmountInNumber: [undefined],
            loanAkchyarupi: [undefined],
            termLoanMonth: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            termLoanBankName: [undefined],
            termLoanPaymentFee: [undefined],
            termLoanBorrowPercent: [undefined],
            termLoanPaymentAmount: [undefined],
            serviceChargeAmount: [undefined],
            secondtermLoan: [undefined],
            secondtermLoanInWord: [undefined],
            termLoanTwoBankName: [undefined],
            termLoanTwoTime: [undefined],
            termLoanTwoMonthlyTerm: [undefined],
            termLoanTwoAmountInNumber: [undefined],
            termLoanTwoAmountInWord: [undefined],
            fixedTermTwoLoanMonth: [undefined],
            secondBaseRate: [undefined],
            secondPremiumRate: [undefined],
            secondYearlyRate: [undefined],
            termLoanTwoPaymentBankName: [undefined],
            termLoanTwoPaymentFee: [undefined],
            termLoanTwoBorrowPercent: [undefined],
            termLoanTwoPaymentAmount: [undefined],
            secondServiceChargeAmount: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            purposeOfLoan: [undefined],
            loanReviewDate: [undefined],
            preview: [undefined],
            drawdownPercent: [undefined],
            noOfEmi: [undefined],
            emiAmtInWord: [undefined],
            emiAmt: [undefined],
            engDate: [undefined],
            premiumInterestRate: [undefined],
            provisional: [undefined],
            netFixAssestPercent: [undefined],
            moratoriumPeriod: [undefined],
        });
    }

    addMoreFixTermLoan() {
        (this.RetailLoan.get('fixTermLoan') as FormArray).push(this.fixTermRetailLoanGroup());
    }

    removeFixTermLoan(index: number) {
        (this.RetailLoan.get('fixTermLoan') as FormArray).removeAt(index);
    }

    hirePurchaseLoan(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            minChargeAmtInWord: [undefined],
            minChargeAmt: [undefined],
            acceptCommissionRate: [undefined],
            lcCommissionRate: [undefined],
            lcCashMargin: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
        });
    }

    addMoreHirePurchaseLoan() {
        (this.RetailLoan.get('hirePurchaseLoan') as FormArray).push(this.hirePurchaseLoan());
    }

    removeHirePurchaseLoan(index: number) {
        (this.RetailLoan.get('hirePurchaseLoan') as FormArray).removeAt(index);
    }

    letterOfCreditFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            letterOfCreditMargin: [undefined],
            letterOfCreditMarginPercent: [undefined],
            letterOfCreditCurrentFiscalYear: [undefined],
            letterOfCreditCommission: [undefined],
            letterOfCreditCommissionPercent: [undefined],
            letterOfCreditDastur: [undefined],
            dasturFlag: [true],
            trTenure: [undefined],
            trDrawdown: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            premiumRate: [undefined],
            premium: [undefined]
        });
    }

    addMoreLetterOfCreditForm() {
        (this.RetailLoan.get('letterOfCredit') as FormArray).push(this.letterOfCreditFormGroup());
    }

    removeLetterOfCreditForm(index: number) {
        (this.RetailLoan.get('letterOfCredit') as FormArray).removeAt(index);
    }

    trustReceiptFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            trustReceiptPayment: [undefined],
            trustReceiptTerm: [undefined],
            trustReceiptFixTerm: [undefined],
            trustReceiptDastur: [undefined],
            dasturFlag: [true],
            dlTenure: [undefined],
            dlDrawdown: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            premium: [undefined]
        });
    }

    addMoreTrustReceiptForm() {
        (this.RetailLoan.get('trustReceipt') as FormArray).push(this.trustReceiptFormGroup());
    }

    removeTrustReceiptForm(index: number) {
        (this.RetailLoan.get('trustReceipt') as FormArray).removeAt(index);
    }

    cashCreditFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            casCreditAim: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            cashCreditPay: [undefined],
            cashCreditPayTill: [undefined],
            cashCreditTerm: [undefined],
            cashCreditFixTerm: [undefined],
            cashCreditSecurity: [undefined],
            cashCreditDastur: [undefined],
            dasturFlag: [true],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            bbgCommission: [undefined],
            pbgCommission: [undefined],
            apgCommission: [undefined],
            csgCommission: [undefined],
            bgPurpose: [undefined],
            minChargeAmtInWord: [undefined],
            minChargeAmt: [undefined],
            lcCashMargin: [undefined],
        });
    }

    addMoreCashCreditForm() {
        (this.RetailLoan.get('cashCredit') as FormArray).push(this.cashCreditFormGroup());
    }

    removeCashCreditForm(index: number) {
        (this.RetailLoan.get('cashCredit') as FormArray).removeAt(index);
    }

    shortTermRetailLoanGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            shortTermLoanAim: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyRate: [undefined],
            shortTermLoanPay: [undefined],
            shortTermLoanPayTill: [undefined],
            shortTermLoanTimePlan: [undefined],
            shortTermLoanTimePlanTill: [undefined],
            shortTermLoanDastur: [undefined],
            dasturFlag: [true],
            noOfVehiclesToFinance: [undefined],
            vehicleModel: [undefined],
            newOrOld: [undefined],
            vatBillDrawdown: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            noOfEmi: [undefined],
            emiAmtInWord: [undefined],
            emiAmt: [undefined],
            premium: [undefined]
        });
    }

    addMoreShortTermRetailLoan() {
        (this.RetailLoan.get('shortTermLoan') as FormArray).push(this.shortTermRetailLoanGroup());
    }

    removeShortTermRetailLoan(index: number) {
        (this.RetailLoan.get('shortTermLoan') as FormArray).removeAt(index);
    }

    bankGuaranteeFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanReviewDate: [undefined],
            adminFeeFundedAmt: [undefined],
            adminFeeFundedAmtWord: [undefined],
            adminFeeNonFundedAmt: [undefined],
            adminFeeNonFundedAmtWord: [undefined],
            renewalFee: [undefined],
            premium: [undefined]
        });
    }

    addMoreBankGuaranteeForm() {
        (this.RetailLoan.get('bankGuarantee') as FormArray).push(this.bankGuaranteeFormGroup());
    }

    removeBankGuaranteeForm(index: number) {
        (this.RetailLoan.get('bankGuarantee') as FormArray).removeAt(index);
    }


    setOverDrafLoanData(details) {
        const overDraftDetails = this.RetailLoan.get('overdraftLoan') as FormArray;
        details.forEach(data => {
            overDraftDetails.push(
                this.formBuilder.group({
                    facilityType: [data.facilityType],
                    adminFeeNonFundedAmt: [data.adminFeeNonFundedAmt],
                    adminFeeNonFundedAmtWord: [data.adminFeeNonFundedAmtWord],
                    purposeOfLoan: [data.purposeOfLoan],
                    otherPurpose: [data.otherPurpose],
                    drawDrown: [data.drawDrown],
                    dhitoSurachan: [data.dhitoSurachan ? data.dhitoSurachan : this.dhitoSurachanValue],
                    karjaRakum: [data.karjaRakum ? data.karjaRakum : this.karjaRakumValue],
                    loanRepayment: [data.loanRepayment],
                    repaymentOne: [data.repaymentOne ? data.repaymentOne : this.repaymentOneValue],
                    repaymentTwo: [data.repaymentTwo ? data.repaymentTwo : this.repaymentTwoValue],
                    repaymentThree: [data.repaymentThree ? data.repaymentThree : this.repaymentThreeValue],
                    // purposePercentage: [data.purposePercentage],
                    tenure: [data.tenure],
                    tenureOne: [data.tenureOne ? data.tenureOne : this.tenureOneValue],
                    tenureTwo: [data.tenureTwo ? data.tenureTwo : this.tenureTwoValue],
                    premiumBaseRate: [data.premiumBaseRate],
                    totalMonth: [data.totalMonth],
                    totalMonthOne: [data.totalMonthOne],
                    moratoriumPeriodArray: this.formBuilder.array([]),
                    amount: [data.amount],
                    amountInWord: [data.amountInWord],
                    loanPeriod: [data.loanPeriod],
                    baseRate: [data.baseRate],
                    loanAmountInWord: [data.loanAmountInWord],
                    loanAmount: [data.loanAmount],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    overdrafLoanEndOfFiscalYear: [data.overdrafLoanEndOfFiscalYear],
                    overdrafLoanPayment: [data.overdrafLoanPayment],
                    overdrafLoanServiceRate: [data.overdrafLoanServiceRate],
                    serviceChargeAmount: [data.serviceChargeAmount],
                    overdrafLoanPrices: [data.overdrafLoanPrices],
                    overdrafLoanReturned: [data.overdrafLoanReturned],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    preview: [data.preview],
                    drawdownPercent: [data.drawdownPercent],
                    purposeDate: [data.purposeDate]
                })
            );
        });
    }

    setdemandLoanData(details) {
        const demandLoanDetails = this.RetailLoan.get('demandLoanType') as FormArray;
        details.forEach(data => {
            demandLoanDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    demandLoanPurpose: [data.demandLoanPurpose],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    demandLoanNetTradingAsset: [data.demandLoanNetTradingAsset],
                    demandLoanLimitDuration: [data.demandLoanLimitDuration],
                    demandLoanLimitDurationAmount: [data.demandLoanLimitDurationAmount],
                    demandLoanDasturAmount: [data.demandLoanDasturAmount],
                    yearlyRate: [data.yearlyRate],
                    demandLoanDurationRatio: [data.demandLoanDurationRatio],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    purposeOfLoan: [data.purposeOfLoan],
                    loanReviewDate: [data.loanReviewDate],
                    purpose: [data.purpose],
                    preview: [data.preview],
                    drawdownPercent: [data.drawdownPercent],
                    noOfEmi: [data.noOfEmi],
                    emiAmtInWord: [data.emiAmtInWord],
                    emiAmt: [data.emiAmt],
                    engDate: [data.engDate],
                    premiumInterestRate: [data.premiumInterestRate],
                })
            );
        });
    }

    setFixTermLoanData(details) {
        const fixTermLoanDetails = this.RetailLoan.get('fixTermLoan') as FormArray;
        details.forEach(data => {
            fixTermLoanDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    termLoanPlanBankName: [data.termLoanPlanBankName],
                    termLoanTime: [data.termLoanTime],
                    termLoanMonthlyTerm: [data.termLoanMonthlyTerm],
                    loanAmountInNumber: [data.loanAmountInNumber],
                    loanAkchyarupi: [data.loanAkchyarupi],
                    termLoanMonth: [data.termLoanMonth],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    termLoanBankName: [data.termLoanBankName],
                    termLoanPaymentFee: [data.termLoanPaymentFee],
                    termLoanBorrowPercent: [data.termLoanBorrowPercent],
                    termLoanPaymentAmount: [data.termLoanPaymentAmount],
                    serviceChargeAmount: [data.serviceChargeAmount],
                    secondtermLoan: [data.secondtermLoan],
                    secondtermLoanInWord: [data.secondtermLoanInWord],
                    termLoanTwoBankName: [data.termLoanTwoBankName],
                    termLoanTwoTime: [data.termLoanTwoTime],
                    termLoanTwoMonthlyTerm: [data.termLoanTwoMonthlyTerm],
                    termLoanTwoAmountInNumber: [data.termLoanTwoAmountInNumber],
                    termLoanTwoAmountInWord: [data.termLoanTwoAmountInWord],
                    fixedTermTwoLoanMonth: [data.fixedTermTwoLoanMonth],
                    secondBaseRate: [data.secondBaseRate],
                    secondPremiumRate: [data.secondPremiumRate],
                    secondYearlyRate: [data.secondYearlyRate],
                    termLoanTwoPaymentBankName: [data.termLoanTwoPaymentBankName],
                    termLoanTwoPaymentFee: [data.termLoanTwoPaymentFee],
                    termLoanTwoBorrowPercent: [data.termLoanTwoBorrowPercent],
                    termLoanTwoPaymentAmount: [data.termLoanTwoPaymentAmount],
                    secondServiceChargeAmount: [data.secondServiceChargeAmount],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    purposeOfLoan: [data.purposeOfLoan],
                    loanReviewDate: [data.loanReviewDate],
                    purpose: [data.purpose],
                    preview: [data.preview],
                    drawdownPercent: [data.drawdownPercent],
                    noOfEmi: [data.noOfEmi],
                    emiAmtInWord: [data.emiAmtInWord],
                    emiAmt: [data.emiAmt],
                    engDate: [data.engDate],
                    premiumInterestRate: [data.premiumInterestRate],
                    provisional: [data.provisional],
                    netFixAssestPercent: [data.netFixAssestPercent],
                    moratoriumPeriod: [data.moratoriumPeriod],
                })
            );
        });
    }

    setHirePurchaseLoanData(details) {
        const hirePurchaseDetails = this.RetailLoan.get('hirePurchaseLoan') as FormArray;
        details.forEach(data => {
            hirePurchaseDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    hirePurchaseLoanPlanBankName: [data.hirePurchaseLoanPlanBankName],
                    hirePurchaseLoanTime: [data.hirePurchaseLoanTime],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    hirePurchaseLoanTerm: [data.hirePurchaseLoanTerm],
                    loanAmountInNumber: [data.loanAmountInNumber],
                    loanAkchyarupi: [data.loanAkchyarupi],
                    hirePurchaseLoanMonth: [data.hirePurchaseLoanMonth],
                    hirPurchaseLoanPaymentBankName: [data.hirPurchaseLoanPaymentBankName],
                    hirPurchaseLoanPaymentPercent: [data.hirPurchaseLoanPaymentPercent],
                    hirePurchaseLoanPaymentMonth: [data.hirePurchaseLoanPaymentMonth],
                    hirePurchaseLoanServiceCharge: [data.hirePurchaseLoanServiceCharge],
                    serviceChargeAmount: [data.serviceChargeAmount],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    minChargeAmtInWord: [data.minChargeAmtInWord],
                    minChargeAmt: [data.minChargeAmt],
                    acceptCommissionRate: [data.acceptCommissionRate],
                    lcCommissionRate: [data.lcCommissionRate],
                    lcCashMargin: [data.lcCashMargin],
                })
            );
        });
    }

    setLetterOfCreditData(details) {
        const letterOfCreditDetails = this.RetailLoan.get('letterOfCredit') as FormArray;
        details.forEach(data => {
            letterOfCreditDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    letterOfCreditMargin: [data.letterOfCreditMargin],
                    letterOfCreditMarginPercent: [data.letterOfCreditMarginPercent],
                    letterOfCreditCurrentFiscalYear: [data.letterOfCreditCurrentFiscalYear],
                    letterOfCreditCommission: [data.letterOfCreditCommission],
                    letterOfCreditCommissionPercent: [data.letterOfCreditCommissionPercent],
                    letterOfCreditDastur: [data.letterOfCreditDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    trTenure: [data.trTenure],
                    trDrawdown: [data.trDrawdown],
                    premiumRate: [data.premiumRate],
                    premium: [data.premium]
                })
            );
        });
    }

    setTrustReceiptData(details) {
        const trustReceiptDetails = this.RetailLoan.get('trustReceipt') as FormArray;
        details.forEach(data => {
            trustReceiptDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    trustReceiptPayment: [data.trustReceiptPayment],
                    trustReceiptTerm: [data.trustReceiptTerm],
                    trustReceiptFixTerm: [data.trustReceiptFixTerm],
                    trustReceiptDastur: [data.trustReceiptDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    dlTenure: [data.dlTenure],
                    dlDrawdown: [data.dlDrawdown],
                    premium: [data.premium]
                })
            );
        });
    }

    setCashCreditData(details) {
        const cashCreditDetails = this.RetailLoan.get('cashCredit') as FormArray;
        details.forEach(data => {
            cashCreditDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    casCreditAim: [data.casCreditAim],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    cashCreditPay: [data.cashCreditPay],
                    cashCreditPayTill: [data.cashCreditPayTill],
                    cashCreditTerm: [data.cashCreditTerm],
                    cashCreditSecurity: [data.cashCreditSecurity],
                    cashCreditFixTerm: [data.cashCreditFixTerm],
                    cashCreditDastur: [data.cashCreditDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    bbgCommission: [data.bbgCommission],
                    pbgCommission: [data.pbgCommission],
                    apgCommission: [data.apgCommission],
                    csgCommission: [data.csgCommission],
                    bgPurpose: [data.bgPurpose],
                    minChargeAmtInWord: [data.minChargeAmtInWord],
                    minChargeAmt: [data.minChargeAmt],
                    lcCashMargin: [data.lcCashMargin],
                })
            );
        });
    }

    setShortTermLoanData(details) {
        const shortTermLoanDetails = this.RetailLoan.get('shortTermLoan') as FormArray;
        details.forEach(data => {
            shortTermLoanDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    shortTermLoanAim: [data.shortTermLoanAim],
                    baseRate: [data.baseRate],
                    premiumRate: [data.premiumRate],
                    yearlyRate: [data.yearlyRate],
                    shortTermLoanPay: [data.shortTermLoanPay],
                    shortTermLoanPayTill: [data.shortTermLoanPayTill],
                    shortTermLoanTimePlan: [data.shortTermLoanTimePlan],
                    shortTermLoanTimePlanTill: [data.shortTermLoanTimePlanTill],
                    shortTermLoanDastur: [data.shortTermLoanDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    noOfVehiclesToFinance: [data.noOfVehiclesToFinance],
                    vehicleModel: [data.vehicleModel],
                    newOrOld: [data.newOrOld],
                    vatBillDrawdown: [data.vatBillDrawdown],
                    noOfEmi: [data.noOfEmi],
                    emiAmtInWord: [data.emiAmtInWord],
                    emiAmt: [data.emiAmt],
                    premium: [data.premium]
                })
            );
        });
    }

    setBankGuaranteeData(details) {
        const bankGuaranteeDetails = this.RetailLoan.get('bankGuarantee') as FormArray;
        details.forEach(data => {
            bankGuaranteeDetails.push(
                this.formBuilder.group({
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    bankGuaranteeAmountAim: [data.bankGuaranteeAmountAim],
                    bankGuaranteeCommission: [data.bankGuaranteeCommission],
                    bankGuaranteeTimePlan: [data.bankGuaranteeTimePlan],
                    bankGuaranteeMargin: [data.bankGuaranteeMargin],
                    bankGuaranteeDastur: [data.bankGuaranteeDastur],
                    dasturFlag: [data.dasturFlag],
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanReviewDate: [data.loanReviewDate],
                    adminFeeFundedAmt: [data.adminFeeFundedAmt],
                    adminFeeFundedAmtWord: [data.adminFeeFundedAmtWord],
                    adminFeeNonFundedAmt: [data.adminFeeNonFundedAmt],
                    adminFeeNonFundedAmtWord: [data.adminFeeNonFundedAmtWord],
                    renewalFee: [data.renewalFee],
                    premium: [data.premium]
                })
            );
        });
    }


    checkOfferLetterData() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.addMoreOverdraftLoan();
            this.addMoreDemandLoan();
            this.addMoreFixTermLoan();
            this.addMoreHirePurchaseLoan();
            this.addMoreLetterOfCreditForm();
            this.addMoreTrustReceiptForm();
            this.addMoreCashCreditForm();
            this.addMoreShortTermRetailLoan();
            this.addMoreBankGuaranteeForm();
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN);
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            console.log(initialInfo);
            this.initialInfoPrint = initialInfo;
            console.log(this.offerLetterDocument);
            this.existingOfferLetter = true;
            this.RetailLoan.patchValue(initialInfo, {emitEvent: false});

            this.selectedLoanTypeArray = initialInfo.loanTypeSelectedArray;
            this.chooseLoanType(this.selectedLoanTypeArray);
            this.setOverDrafLoanData(initialInfo.overdraftLoan);
            this.setdemandLoanData(initialInfo.demandLoanType);
            this.setFixTermLoanData(initialInfo.fixTermLoan);
            this.setHirePurchaseLoanData(initialInfo.hirePurchaseLoan);
            this.setLetterOfCreditData(initialInfo.letterOfCredit);
            this.setTrustReceiptData(initialInfo.trustReceipt);
            this.setCashCreditData(initialInfo.cashCredit);
            this.setShortTermLoanData(initialInfo.shortTermLoan);
            this.setBankGuaranteeData(initialInfo.bankGuarantee);
            this.initialInfoPrint = initialInfo;
        }
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value
                (this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN).toString()) {
                    this.RetailLoan.get('loanTypeSelectedArray').patchValue(this.selectedLoanTypeArray);
                    offerLetterPath.initialInformation = JSON.stringify(this.RetailLoan.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.ALL_OTHER_LOAN_RETAIL_LOAN);
            this.RetailLoan.get('loanTypeSelectedArray').patchValue(this.selectedLoanTypeArray);
            offerDocument.initialInformation = JSON.stringify(this.RetailLoan.value);
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

    chooseLoanType(selectedLoanTypeArray) {
        this.selectedLoanTypeArray = selectedLoanTypeArray;
        this.overdraft = this.demandLoan = this.fixedTermLoan = this.hirePurchase = this.letterOfCredit
            = this.trustReceipt = this.cashCredit = this.shortTermLoan = this.bankGuarantee = false;
        selectedLoanTypeArray.forEach(selectedValue => {
            switch (selectedValue) {
                case 'Overdraft':
                    this.overdraft = true;
                    break;
                case 'DemandLoan':
                    this.demandLoan = true;
                    break;
                case 'FixedTermLoan':
                    this.fixedTermLoan = true;
                    break;
                case 'HirePurchase':
                    this.hirePurchase = true;
                    break;
                case 'LetterOfCredit':
                    this.letterOfCredit = true;
                    break;
                case 'TrustReceipt':
                    this.trustReceipt = true;
                    break;
                case 'CashCredit':
                    this.cashCredit = true;
                    break;
                case 'ShortTermLoan':
                    this.shortTermLoan = true;
                    break;
                case 'BankGuarantee':
                    this.bankGuarantee = true;
                    break;
            }
        });
    }


    changeToNepAmount(event: any, i, formArrayName, formControlName) {
        this.RetailLoan.get([formArrayName, i, formControlName]).patchValue(event.nepVal);
        this.RetailLoan.get([formArrayName, i, formControlName]).patchValue(event.val);
    }

    // patchFunction(formArrayName, i, formControlName) {
    //     return this.RetailLoan.get([formArrayName, i, formControlName]).value;
    // }

    changeToNepAmount1(event: any, target, from) {
        this.RetailLoan.get([target]).patchValue(event.nepVal);
        this.RetailLoan.get([from]).patchValue(event.val);
    }

    patchFunction1(target) {
        return this.RetailLoan.get([target]).value;
    }


    addMoratoriumPeriod(i) {
        (this.RetailLoan.get(['overdraftLoan', i, 'moratoriumPeriodArray']) as FormArray).push(this.formBuilder.group({
            totalMonthOne: [undefined]
        }));
    }

    removeMoratoriumPeriodArray(i: number) {
        (this.RetailLoan.get(['overdraftLoan', i, 'moratoriumPeriodArray']) as FormArray).removeAt(i);
    }

    checkChecked(controlName, checked: any) {
        this.RetailLoan.get(controlName).patchValue(checked);
    }
    addSecurity() {
        (this.RetailLoan.get('securityArray') as FormArray).push(this.formBuilder.group({
            text: [undefined]
        }));
    }

    removeSecurity(i) {
        (this.RetailLoan.get('securityArray') as FormArray).removeAt(i);
    }
}
