import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';


@Component({
    selector: 'app-sme-offer-letter',
    templateUrl: './sme-offer-letter.component.html',
    styleUrls: ['./sme-offer-letter.component.scss']
})
export class SmeOfferLetterComponent implements OnInit {
    loanForm: FormGroup;
    // todo replace enum constant string compare
    smeLoanHolderInfo;
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    selectedLoanTypeArray = [];
    overdraft = false;
    termLoan = false;
    termLoanI = false;
    letterOfCredit = false;
    trustReceipt = false;
    demandLoan = false;
    bankGuarantee = false;
    hirePurchase = false;
    bridgeGap = false;

    listOfLoan = [];
    loanTypes = [
        {key: 'Overdraft', value: 'अधिबिकर्ष (Overdraft)'},
        {key: 'TermLoan', value: 'आवधिक कर्जा (Term Loan)'},
        {key: 'TermLoanI', value: 'आवधिक कर्जा १ (Term Loan-I)'},
        {key: 'LetterOfCredit', value: 'प्रतितपत्र (Letter of Credit- Usance/Sight/Acceptance)'},
        {key: 'TrustReceipt', value: 'ट्रष्ट रिसिट कर्जा (प्रतीत पत्र कर्जाको सिमा भित्र) (Trust Receipt Loan- Within Letter of Credit)'},
        {key: 'DemandLoan', value: 'माग कर्जा (Demand Loan) प्रतितपत्र सीमा regular अन्तर्गत'},
        {key: 'BankGuarantee', value: 'बैंक जमानत (Bank Guarantee- PB / BB/ AP / CSG / Credit Line)'},
        {key: 'HirePurchase', value: 'हायर पर्चेज कर्जा (Hire Purchase Loan)'},
        {key: 'BridgeGap', value: 'ब्रिज ग्याप कर्जा (Bridge Gap Loan)'},
    ];
    ckeConfig = NepaliEditor.CK_CONFIG;
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;


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
        this.listOfLoan.push(this.loanForm.get('loanTypeSelectedArray').value);
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder.nepData)) {
            this.smeLoanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            console.log(this.smeLoanHolderInfo);
            console.log(this.smeLoanHolderInfo.miscellaneousDetail, 'loanFacilityTypeNep');
        }
        if (!ObjectUtil.isEmpty(this.smeLoanHolderInfo)) {
            this.loanForm.patchValue({
                referenceNo: this.smeLoanHolderInfo.miscellaneousDetail.offerReferenceNo ? this.smeLoanHolderInfo.miscellaneousDetail.offerReferenceNo : '',
                issuedDate: this.smeLoanHolderInfo.miscellaneousDetail.offerIssueDate ? this.smeLoanHolderInfo.miscellaneousDetail.offerIssueDate : '',
                borrowerName: this.smeLoanHolderInfo.nepaliName ? this.smeLoanHolderInfo.nepaliName : '',
                instRegDist: this.smeLoanHolderInfo.institutionRegisteredAddress.district ? this.smeLoanHolderInfo.institutionRegisteredAddress.district : '',
                instRegVdcMun: this.smeLoanHolderInfo.institutionRegisteredAddress.municipality ? this.smeLoanHolderInfo.institutionRegisteredAddress.municipality : '',
                instRegWardNo: this.smeLoanHolderInfo.institutionRegisteredAddress.wardNo ? this.smeLoanHolderInfo.institutionRegisteredAddress.wardNo : '',
                authPersonMobileNo: this.smeLoanHolderInfo.contactNo ? this.smeLoanHolderInfo.contactNo : '',
                authPersonName: this.smeLoanHolderInfo.authorizedPersonDetail.name ? this.smeLoanHolderInfo.authorizedPersonDetail.name : '',
                // loanFacilityTypeNep: this.smeLoanHolderInfo.miscellaneousDetail.loanFacilityTypeInNep ? this.smeLoanHolderInfo.miscellaneousDetail.loanFacilityTypeInNep : '',
                // loanFacilityTypeEng: this.smeLoanHolderInfo.miscellaneousDetail.loanFacilityTypeInEng ? this.smeLoanHolderInfo.miscellaneousDetail.loanFacilityTypeInEng : '',
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
            // this.loanForm.get(['proposalData', 0, 'sanctionedLmt']).patchValue(this.smeLoanHolderInfo.miscellaneousDetail.loanAmountInFig);
            // this.loanForm.get(['proposalData', 0, 'sanctionedLmtInWord']).patchValue(this.smeLoanHolderInfo.miscellaneousDetail.loanAmountInWord);
            // this.loanForm.get(['overdraftLoan', 0, 'loanFacilityTypeNep']).patchValue(this.smeLoanHolderInfo.miscellaneousDetail.loanFacilityTypeInNep);
        }
    }

    buildForm() {
        this.loanForm = this.formBuilder.group({
            minChargeAmtWordSme: [undefined],
            minChargeAmtSme: [undefined],
            emiAmtInWordSme: [undefined],
            emiAmtSme: [undefined],
            loanAmountInWordSme: [undefined],
            loanAmountSme: [undefined],
            referenceNo: [undefined],
            overdrafLoanPrices: [undefined],
            date: [undefined],
            address: [undefined],
            to: [undefined],
            sector: [undefined],
            mobileNo: [undefined],
            name: [undefined],
            borrowerLoanType: [undefined],
            borrowerName: [undefined],
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
            overdraftLoan: this.formBuilder.array([]),
            termLoan: this.formBuilder.array([]),
            termLoanI: this.formBuilder.array([]),
            letterOfCredit: this.formBuilder.array([]),
            trustReceipt: this.formBuilder.array([]),
            demandLoanType: this.formBuilder.array([]),
            bankGuarantee: this.formBuilder.array([]),
            hirePurchaseLoan: this.formBuilder.array([]),
            bridgeGap: this.formBuilder.array([]),
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
            postBox: [undefined],
            branchDis: [undefined],
            marfatBank: [undefined],
            branchTelNo: [undefined],
            branchFax: [undefined],
            borrowerTempProvince: [undefined],
            borrowerTempDis: [undefined],
            borrowerTempMun: [undefined],
            borrowerPerWard: [undefined],
            borrowerName2: [undefined],
            branchName: [undefined],
            borrowerTempWard: [undefined],
            borrowerTempTole: [undefined],
            borrowerHouseNo: [undefined],
            borrowerTempStreet: [undefined],
            borrowerEmail: [undefined],
            borrowerPerMun: [undefined],
            borrowerPerDis: [undefined],
            borrowerMobile: [undefined],
            issuedDate: [undefined],
            instRegVdcMun: [undefined],
            instRegWardNo: [undefined],
            instRegDist: [undefined],
            instRegProvince: [undefined],
            instRegProvinceNo: [undefined],
            compRegOffice: [undefined],
            authPersonName: [undefined],
            authPersonMobileNo: [undefined],
            authPersonEmail: [undefined],
            authPersonDist: [undefined],
            authPersonVdcMun: [undefined],
            authPersonWard: [undefined],
            facOwnerName: [undefined],
            facOffice: [undefined],
            facDistrict: [undefined],
            facVdcMun: [undefined],
            facWardNo: [undefined],
            facCurrentDistrict: [undefined],
            facCurrentVdcMun: [undefined],
            facCurrentWardNo: [undefined],
            noOfVehiclesToFinance: [undefined],
            vehicleModel: [undefined],
            plotNo: [undefined],
            plotArea: [undefined],
            valuatorName: [undefined],
            fmvAmount: [undefined],
            fmvAmountInWord: [undefined],
            dvAmount: [undefined],
            dvAmountInWord: [undefined],
            reviewYearIncreased: [undefined],
            DebtEquityAmount: [undefined],
            vatBillPercent: [undefined],
            voucher1District: [undefined],
            voucher1VdcMun: [undefined],
            voucher1Ward: [undefined],
            voucher2District: [undefined],
            voucher2VdcMun: [undefined],
            voucher2Ward: [undefined],
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
            adminFeeFundedAmt: [undefined],
            adminFeeFundedAmtWord: [undefined],
            adminFeeNonFundedAmt: [undefined],
            adminFeeNonFundedAmtWord: [undefined],
            fiscalYear: [undefined],
            quarter: [undefined],
            averageBaseRate: [undefined],
            sawariSadhan: [undefined],
            assestNepali: [undefined],
            assestEnglish: [undefined],
            bankersClause: [undefined],
            loanReviewDate: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            totalLoanAmountDir: [undefined],
            totalLoanAmountInWordDir: [undefined],
            totalLoanAmountHypo: [undefined],
            totalLoanAmountInWordHypo: [undefined],
        });

    }

    overdraftFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            purposeOfLoan: [undefined],
            purposeDate: [undefined],
            drawdownPercent: [undefined],
            loanReviewDate: [undefined],
            premiumRate: [undefined]
        });
    }

    addMoreOverdraftLoan() {
        (this.loanForm.get('overdraftLoan') as FormArray).push(this.overdraftFormGroup());
    }

    removeOverDraftLoan(index: number) {
        (this.loanForm.get('overdraftLoan') as FormArray).removeAt(index);
    }

    demandLoanFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanReviewDate: [undefined],
            dlTenure: [undefined],
            dlDrawdown: [undefined],
            premium: [undefined]
        });
    }

    addMoreDemandLoan() {
        (this.loanForm.get('demandLoanType') as FormArray).push(this.demandLoanFormGroup());
    }

    removeDemandLoan(index: number) {
        (this.loanForm.get('demandLoanType') as FormArray).removeAt(index);
    }

    termLoanIFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            provisional: [undefined],
            netFixAssestPercent: [undefined],
            noOfEmi: [undefined],
            engDate: [undefined],
            emiAmt: [undefined],
            emiAmtInWord: [undefined],
            loanReviewDate: [undefined],
            moratoriumPeriod: [undefined]
        });
    }

    addMoreTermLoanI() {
        (this.loanForm.get('termLoanI') as FormArray).push(this.termLoanIFormGroup());
    }

    removeTermLoanI(index: number) {
        (this.loanForm.get('termLoanI') as FormArray).removeAt(index);
    }

    hirePurchaseLoan(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            noOfVehiclesToFinance: [undefined],
            vehicleModel: [undefined],
            newOrOld: [undefined],
            vatBillDrawdown: [undefined],
            noOfEmi: [undefined],
            emiAmt: [undefined],
            emiAmtInWord: [undefined],
            loanReviewDate: [undefined],
            premium: [undefined]
        });
    }

    addMoreHirePurchaseLoan() {
        (this.loanForm.get('hirePurchaseLoan') as FormArray).push(this.hirePurchaseLoan());
    }

    removeHirePurchaseLoan(index: number) {
        (this.loanForm.get('hirePurchaseLoan') as FormArray).removeAt(index);
    }

    letterOfCreditFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanReviewDate: [undefined],
            lcCommissionRate: [undefined],
            minChargeAmt: [undefined],
            minChargeAmtInWord: [undefined],
            acceptCommissionRate: [undefined],
            lcCashMargin: [undefined]
        });
    }

    addMoreLetterOfCreditForm() {
        (this.loanForm.get('letterOfCredit') as FormArray).push(this.letterOfCreditFormGroup());
    }

    removeLetterOfCreditForm(index: number) {
        (this.loanForm.get('letterOfCredit') as FormArray).removeAt(index);
    }

    trustReceiptFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanReviewDate: [undefined],
            trTenure: [undefined],
            trDrawdown: [undefined],
            premium: [undefined]
        });
    }

    addMoreTrustReceiptForm() {
        (this.loanForm.get('trustReceipt') as FormArray).push(this.trustReceiptFormGroup());
    }

    removeTrustReceiptForm(index: number) {
        (this.loanForm.get('trustReceipt') as FormArray).removeAt(index);
    }

    bankGuaranteeFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            bgPurpose: [undefined],
            loanReviewDate: [undefined],
            bbgCommission: [undefined],
            minChargeAmt: [undefined],
            minChargeAmtInWord: [undefined],
            pbgCommission: [undefined],
            apgCommission: [undefined],
            csgCommission: [undefined],
            lcCashMargin: [undefined]
        });
    }

    bridgeGapFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            loanReviewDate: [undefined],
            renewalFee: [undefined],
            premium: [undefined]
        });
    }

    addMoreBridgeGapLoan() {
        (this.loanForm.get('bridgeGap') as FormArray).push(this.bridgeGapFormGroup());
    }

    removeBridgeGapLoan(index: number) {
        (this.loanForm.get('bridgeGap') as FormArray).removeAt(index);
    }

    termLoanFormGroup(): FormGroup {
        return this.formBuilder.group({
            loanFacilityTypeNep: [undefined],
            loanFacilityTypeEng: [undefined],
            loanAmount: [undefined],
            loanAmountInWord: [undefined],
            purposeOfLoan: [undefined],
            purpose: [undefined],
            drawdownPercent: [undefined],
            loanReviewDate: [undefined],
            noOfEmi: [undefined],
            engDate: [undefined],
            emiAmt: [undefined],
            emiAmtInWord: [undefined],
            premiumInterestRate: [undefined]
        });
    }

    addMoreTermLoan() {
        (this.loanForm.get('termLoan') as FormArray).push(this.termLoanFormGroup());
    }

    removeTermLoanForm(index: number) {
        (this.loanForm.get('termLoan') as FormArray).removeAt(index);
    }

    addMoreBankGuaranteeForm() {
        (this.loanForm.get('bankGuarantee') as FormArray).push(this.bankGuaranteeFormGroup());
    }

    removeBankGuaranteeForm(index: number) {
        (this.loanForm.get('bankGuarantee') as FormArray).removeAt(index);
    }


    setOverDraftLoanData(details) {
        const overDraftDetails = this.loanForm.get('overdraftLoan') as FormArray;
        details.forEach(data => {
            overDraftDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    purposeOfLoan: [data.purposeOfLoan],
                    purposeDate: [data.purposeDate],
                    drawdownPercent: [data.drawdownPercent],
                    loanReviewDate: [data.loanReviewDate],
                    premiumRate: [data.premiumRate]
                })
            );
        });
    }

    setTermLoanData(details) {
        const termLoanDetails = this.loanForm.get('termLoan') as FormArray;
        details.forEach(data => {
            termLoanDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    purposeOfLoan: [data.purposeOfLoan],
                    purpose: [data.purpose],
                    drawdownPercent: [data.drawdownPercent],
                    loanReviewDate: [data.loanReviewDate],
                    noOfEmi: [data.noOfEmi],
                    engDate: [data.engDate],
                    emiAmt: [data.emiAmt],
                    emiAmtInWord: [data.emiAmtInWord],
                    premiumInterestRate: [data.premiumInterestRate]
                })
            );
        });
    }

    setTermLoanIData(details) {
        const termLoanIDetails = this.loanForm.get('termLoanI') as FormArray;
        details.forEach(data => {
            termLoanIDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    provisional: [data.provisional],
                    netFixAssestPercent: [data.netFixAssestPercent],
                    noOfEmi: [data.noOfEmi],
                    engDate: [data.engDate],
                    emiAmt: [data.emiAmt],
                    emiAmtInWord: [data.emiAmtInWord],
                    loanReviewDate: [data.loanReviewDate],
                    moratoriumPeriod: [data.moratoriumPeriod]
                })
            );
        });
    }

    setLetterOfCreditData(details) {
        const letterOfCreditDetails = this.loanForm.get('letterOfCredit') as FormArray;
        details.forEach(data => {
            letterOfCreditDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    loanReviewDate: [data.loanReviewDate],
                    lcCommissionRate: [data.lcCommissionRate],
                    minChargeAmt: [data.minChargeAmt],
                    minChargeAmtInWord: [data.minChargeAmtInWord],
                    acceptCommissionRate: [data.acceptCommissionRate],
                    lcCashMargin: [data.lcCashMargin]
                })
            );
        });
    }

    setTrustReceiptData(details) {
        const trustReceiptDetails = this.loanForm.get('trustReceipt') as FormArray;
        details.forEach(data => {
            trustReceiptDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    loanReviewDate: [data.loanReviewDate],
                    trTenure: [data.trTenure],
                    trDrawdown: [data.trDrawdown],
                    premium: [data.premium]
                })
            );
        });
    }

    setDemandLoanData(details) {
        const demandLoanDetails = this.loanForm.get('demandLoanType') as FormArray;
        details.forEach(data => {
            demandLoanDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    loanReviewDate: [data.loanReviewDate],
                    dlTenure: [data.dlTenure],
                    dlDrawdown: [data.dlDrawdown],
                    premium: [data.premium]
                })
            );
        });
    }

    setBankGuaranteeData(details) {
        const bankGuranteeDetails = this.loanForm.get('bankGuarantee') as FormArray;
        details.forEach(data => {
            bankGuranteeDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    bgPurpose: [data.bgPurpose],
                    loanReviewDate: [data.loanReviewDate],
                    bbgCommission: [data.bbgCommission],
                    minChargeAmt: [data.minChargeAmt],
                    minChargeAmtInWord: [data.minChargeAmtInWord],
                    pbgCommission: [data.pbgCommission],
                    apgCommission: [data.apgCommission],
                    csgCommission: [data.csgCommission],
                    lcCashMargin: [data.lcCashMargin]
                })
            );
        });
    }

    setHirePurchaseLoanData(details) {
        const hirePurchaseDetails = this.loanForm.get('hirePurchaseLoan') as FormArray;
        details.forEach(data => {
            hirePurchaseDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    noOfVehiclesToFinance: [data.noOfVehiclesToFinance],
                    vehicleModel: [data.vehicleModel],
                    newOrOld: [data.newOrOld],
                    vatBillDrawdown: [data.vatBillDrawdown],
                    noOfEmi: [data.noOfEmi],
                    emiAmt: [data.emiAmt],
                    emiAmtInWord: [data.emiAmtInWord],
                    loanReviewDate: [data.loanReviewDate],
                    premium: [data.premium]
                })
            );
        });
    }

    setBridgeGapLoanData(details) {
        const bridgeGapDetails = this.loanForm.get('bridgeGap') as FormArray;
        details.forEach(data => {
            bridgeGapDetails.push(
                this.formBuilder.group({
                    loanFacilityTypeNep: [data.loanFacilityTypeNep],
                    loanFacilityTypeEng: [data.loanFacilityTypeEng],
                    loanAmount: [data.loanAmount],
                    loanAmountInWord: [data.loanAmountInWord],
                    loanReviewDate: [data.loanReviewDate],
                    renewalFee: [data.renewalFee],
                    premium: [data.premium]
                })
            );
        });
    }


    checkOfferLetterData() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.SME_OFFER_LETTER).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.addMoreOverdraftLoan();
            this.addMoreTermLoan();
            this.addMoreTermLoanI();
            this.addMoreLetterOfCreditForm();
            this.addMoreTrustReceiptForm();
            this.addMoreDemandLoan();
            this.addMoreBankGuaranteeForm();
            this.addMoreHirePurchaseLoan();
            this.addMoreBridgeGapLoan();

            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.SME_OFFER_LETTER);
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            console.log(initialInfo, 'initialInfo');
            this.initialInfoPrint = initialInfo;
            console.log(this.offerLetterDocument);
            this.existingOfferLetter = true;
            this.loanForm.patchValue(initialInfo, {emitEvent: false});

            this.selectedLoanTypeArray = initialInfo.loanTypeSelectedArray;
            this.chooseLoanType(this.selectedLoanTypeArray);
            this.setOverDraftLoanData(initialInfo.overdraftLoan);
            this.setTermLoanData(initialInfo.termLoan);
            this.setTermLoanIData(initialInfo.termLoanI);
            this.setLetterOfCreditData(initialInfo.letterOfCredit);
            this.setTrustReceiptData(initialInfo.trustReceipt);
            this.setDemandLoanData(initialInfo.demandLoanType);
            this.setBankGuaranteeData(initialInfo.bankGuarantee);
            this.setHirePurchaseLoanData(initialInfo.hirePurchaseLoan);
            this.setBridgeGapLoanData(initialInfo.bridgeGap);
            this.initialInfoPrint = initialInfo;
        }
    }

    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.SME_OFFER_LETTER).toString()) {
                    this.loanForm.get('loanTypeSelectedArray').patchValue(this.selectedLoanTypeArray);
                    offerLetterPath.initialInformation = JSON.stringify(this.loanForm.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.SME_OFFER_LETTER);
            this.loanForm.get('loanTypeSelectedArray').patchValue(this.selectedLoanTypeArray);
            offerDocument.initialInformation = JSON.stringify(this.loanForm.value);
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
        this.overdraft =  this.termLoan =  this.termLoanI = this.letterOfCredit = this.trustReceipt
            = this.demandLoan = this.bankGuarantee = this.hirePurchase  = this.bridgeGap = false;
        selectedLoanTypeArray.forEach(selectedValue => {
            switch (selectedValue) {
                case 'Overdraft':
                    this.overdraft = true;
                    break;
                case 'TermLoan':
                    this.termLoan = true;
                    break;
                case 'TermLoanI':
                    this.termLoanI = true;
                    break;
                case 'LetterOfCredit':
                    this.letterOfCredit = true;
                    break;
                case 'TrustReceipt':
                    this.trustReceipt = true;
                    break;
                case 'DemandLoan':
                    this.demandLoan = true;
                    break;
                case 'BankGuarantee':
                    this.bankGuarantee = true;
                    break;
                case 'HirePurchase':
                    this.hirePurchase = true;
                    break;
                case 'BridgeGap':
                    this.bridgeGap = true;
                    break;
            }
        });
    }


    changeToNepAmount(event: any, i, formArrayName, target, from) {
        this.loanForm.get([formArrayName, i, target]).patchValue(event.nepVal);
        this.loanForm.get([formArrayName, i, from]).patchValue(event.val);
    }

    patchFunction(formArrayName, i, formControlName) {
        return this.loanForm.get([formArrayName, i, formControlName]).value;
    }

    changeToNepAmount1(event: any, target, from) {
        this.loanForm.get([target]).patchValue(event.nepVal);
        this.loanForm.get([from]).patchValue(event.val);
    }

    patchFunction1(target) {
        return this.loanForm.get([target]).value;
    }


}
