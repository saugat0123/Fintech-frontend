import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {LoanType} from '../../../../../loan/model/loanType';
import {SubLoanType} from '../../../../../loan/model/subLoanType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LaxmiPurpose} from '../../../../../loan/model/laxmi-purpose';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {OfferDocument} from '../../../../model/OfferDocument';
import {LaxmiOfferLetterConst} from '../laxmi-offer-letter-const';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Security} from '../../../../../loan/model/security';
import {ShareSecurity} from '../../../../../admin/modal/shareSecurity';
import {SiteVisit} from '../../../../../admin/modal/siteVisit';

@Component({
    selector: 'app-offer-letter-laxmi',
    templateUrl: './offer-letter-laxmi.component.html',
    styleUrls: ['./offer-letter-laxmi.component.scss']
})
export class OfferLetterLaxmiComponent implements OnInit {

    @Input() cadData;
    @Input() documentId;
    @Input() customerLoanId;
    @Input() offerLetterType;
    @ViewChild('select', {static: true}) modal: TemplateRef<any>;
    offerLetterForm: FormGroup;
    spinner = false;
    initialInfoPrint;
    cadCheckListEnum = CadCheckListTemplateEnum;
    offerLetterConst = LaxmiOfferLetterConst;
    nepaliData;
    proposedAmount;
    customerInfo;
    loanName = [];
    loanTypes = LoanType;
    subloanTypes;
    subloanType;
    subloanTypeEnum = SubLoanType;
    offerLetterDocument;
    hasSubLoanType = false;
    purpose = LaxmiPurpose.enumObject();
    tempPurposeFlag = {
        workingCapitalOther: false,
        selectShareLoanOther: false,
        selectGoldOther: false,
        selectHomeEquityOther: false,
        selectBridgeOther: false,
        selectCapitalOther: false,
        selectFixedAssetsOther: false,
        selectVehicleOther: false,
        selectRefinancingOther: false,
        selectLetterOther: false,
        selectLoanAgainstOther: false,
        selectLoanAgainstTOther: false,
        selectPurchaseOther: false,
        selectConstructionOther: false,
        selectHireOther: false,
        selectcommercialOther: false,
        selectBidOther: false,
        selectPerformanceOther: false,
        selectPersonalOther: false,
    };
    ckeConfig = NepaliEditor.CK_CONFIG;
    existingOfferLetter = false;
    multipleSecurity = false;
    selectedArray = [];
    arrayOfSubloan = [];
    test111 = [];
    subLoanData = [];
    loanType = [];
    commissionTime = ['त्रैमासिक', 'मासिक', 'Other'];
    loanWithSubloan = [];
    loanNature = [];
    loanWithOutSubLoan = [];
    proposalData = [];
    commissionFrequency = [];
    securityPresent = false;
    siteVisitPresent = false;
    currentAssetstPresent = false;
    isCollateral = false;
    securityData;
    shareData;
    landSecurity;
    landBuildingSecurity;
    taggedGuarantor = [];
    corporateGuarantor = false;

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private modalService: NgbModal,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private nepaliToEnglishPipe: NepaliToEngNumberPipe,
                private nepaliNumber: NepaliNumberPipe) {
    }

    ngOnInit() {
        console.log('cadData', this.cadData);
        this.buildForm();
        this.parseAssignedLoanData();
        this.checkOfferLetter();
        this.convertProposed();
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER);
            this.fillForm();
            this.addOtherCovenants();
            this.addAcceptance();
            this.addEventDefault();
            this.addEventDefault1();
            this.addRepresentation();
            this.addPrecedent();
            // this.saveLoanSubLoan();
        } else {
            // this.fillForm();
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.offerLetterForm.patchValue(initialInfo);
            this.arrayOfSubloan = initialInfo.subLoanType;
            // this.setSubLoanData(initialInfo.purpose);
            this.setOtherCovenants(initialInfo.covenant);
            this.setAcceptance(initialInfo.acceptance);
            this.setEventDefaul(initialInfo.eventDefault);
            this.setEventDefaul1(initialInfo.eventDefault1);
            this.setRepresentation(initialInfo.representation);
            this.setPrecedent(initialInfo.precedent);
            console.log('initialInfo', initialInfo);
        }
    }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
        console.log('nepaliData', this.nepaliData);
        // const address = this.nepaliData.perma
        if (!ObjectUtil.isEmpty(this.nepaliData)) {
            this.offerLetterForm.patchValue({
                borrowerName: this.nepaliData.name,
            });
        }
    }

    buildForm() {
        this.offerLetterForm = this.formBuilder.group({
            signature1: [undefined],
            refNo: [undefined],
            empoweredName: [undefined],
            signature2: [undefined],
            signature3: [undefined],
            designation2: [undefined],
            designation3: [undefined],
            name2: [undefined],
            name3: [undefined],
            contactNumber: [undefined],
            address: [undefined],
            borrowerName: [undefined],
            branchName: [undefined],
            telephoneNumber: [undefined],
            faxNumber: [undefined],
            subLoanType: [undefined],

            // new/enhance Security
            fixedAssetsCollateral: this.formBuilder.array([]),
            landOwnerName1: [undefined],
            securityDistrict1: [undefined],
            securityVdc1: [undefined],
            securityWard1: [undefined],
            securityKitta1: [undefined],
            securityArea1: [undefined],

            vehicleDetails: [undefined],
            engineNo: [undefined],
            chasisNo: [undefined],
            vehicleNo: [undefined],

            shareOwnerName: [undefined],
            shareCompanyName: [undefined],
            shareUnit: [undefined],
            shareType: [undefined],

            personalName: [undefined],
            personalAmount: [undefined],
            personalAmountWord: [undefined],

            corporateName: [undefined],
            corporateAmount: [undefined],
            corporateAmountWord: [undefined],

            letterCM: [undefined],
            guarnateeCM: [undefined],

            accountName: [undefined],
            accountNo: [undefined],
            accountAmount: [undefined],
            accountAmountWord: [undefined],

            loanAmount: [undefined],
            loanAmountWord: [undefined],
            promiseAmount: [undefined],
            promiseAmountWord: [undefined],

            ligLoan: [undefined],
            landLoanAmount: [undefined],
            loanBorrower: [undefined],
            consumptionAmount: [undefined],
            totalConsumptionAmount: [undefined],
            totalConsumptionAmountWord: [undefined],

            // renew
            landOwnerName2: [undefined],
            securityDistrict2: [undefined],
            securityVdc2: [undefined],
            securityWard2: [undefined],
            securityKitta2: [undefined],
            securityArea2: [undefined],

            landOwnerName3: [undefined],
            securityDistrict3: [undefined],
            securityVdc3: [undefined],
            securityWard3: [undefined],
            securityKitta3: [undefined],
            securityArea3: [undefined],

            vehicleDetails1: [undefined],
            engineNo1: [undefined],
            chasisNo1: [undefined],
            vehicleNo1: [undefined],

            shareOwnerName1: [undefined],
            shareCompanyName1: [undefined],
            shareUnit1: [undefined],
            shareType1: [undefined],

            personalName1: [undefined],
            personalAmount1: [undefined],
            personalAmountWord1: [undefined],

            corporateName1: [undefined],
            corporateAmount1: [undefined],
            corporateAmountWord1: [undefined],

            letterCM1: [undefined],
            guarnateeCM1: [undefined],

            accountName1: [undefined],
            accountNo1: [undefined],
            accountAmount1: [undefined],
            accountAmountWord1: [undefined],

            loanAmount1: [undefined],
            loanAmountWord1: [undefined],
            promiseAmount1: [undefined],
            promiseAmountWord1: [undefined],

            ligLoan1: [undefined],
            landLoanAmount1: [undefined],
            loanBorrower1: [undefined],
            consumptionAmount1: [undefined],
            totalConsumptionAmount1: [undefined],
            totalConsumptionAmountWord1: [undefined],

            date1: [undefined],
            amount1: [undefined],
            date2: [undefined],
            date3: [undefined],
            date4: [undefined],
            date5: [undefined],
            date6: [undefined],
            date7: [undefined],
            amount7: [undefined],
            date8: [undefined],
            amount8: [undefined],
            date9: [undefined],
            date10: [undefined],
            date11: [undefined],
            date12: [undefined],

            // subLoantype
            samjhautapatra: [undefined],
            samjhautapatra1: [undefined],
            patraDate: [undefined],
            date: [undefined],
            borrowerName1: [undefined],
            address1: [undefined],
            phoneNo: [undefined],
            attention: [undefined],
            workingRate: [undefined],
            workingLandBuildingRate: [undefined],
            autoRate: [undefined],
            autoModel: [undefined],

            // other Clauses
            reviewDate: [undefined],
            premiumRate: [undefined],
            monthlyRate: [undefined],
            quaterlyRate: [undefined],
            anurupRate: [undefined],
            interestMonth: [undefined],
            interestPremiumRate: [undefined],
            interestRate: [undefined],
            repaymentAmount: [undefined],
            repaymentAmountWord: [undefined],
            repaymentMonthly: [undefined],
            repaymentMonthlyRate: [undefined],
            repaymentMonth: [undefined],
            repaymentAmount1: [undefined],
            repaymentAmountWord1: [undefined],
            totalBorrowerAmount: [undefined],
            borrowerAmount: [undefined],
            borrowerAmount1: [undefined],
            borrowerAmount2: [undefined],
            administrationRate: [undefined],
            administrationAmount: [undefined],
            reviewRate: [undefined],
            reviewAmount: [undefined],

            educationOther: [undefined],
            commercialOther: [undefined],
            educationPurpose: [undefined],
            commercialPurpose: [undefined],
            swapFee: [true],
            otherSwapFeeChecked: [false],
            swapFeeOther: [undefined],
            agmiPurpose: [undefined],
            prepaymentCharge: [true],
            prepaymentOtherCheck: [false],
            prepaymentOther: [undefined],
            commitmentFee: [true],
            commitmentFeeOtherCheck: [false],
            commitmentFeeOther: [undefined],
            informationFee: [true],
            informationFeeOtherCheck: [false],
            informationFeeOther: [undefined],
            valuationFee: [true],
            valuationFeeOtherCheck: [false],
            valuationFeeOther: [undefined],
            penalInterest: [true],
            penalInterestOtherCheck: [false],
            penalInterestOther: [undefined],
            educationalDrawdown: [undefined],
            purpose: this.formBuilder.array([]),
            covenant: this.formBuilder.array([]),
            eventDefault: this.formBuilder.array([]),
            eventDefault1: this.formBuilder.array([]),
            representation: this.formBuilder.array([]),
            acceptance: this.formBuilder.array([]),
            precedent: this.formBuilder.array([]),
            security: this.formBuilder.array([]),
            shareSecurity: this.formBuilder.array([]),
            vehicleSecurity: this.formBuilder.array([]),
            renewSecurity: this.formBuilder.array([]),

            coGuaranteeOtherCheck: [false],
            coGuaranteeOther: [undefined],
            peGuaranteeOtherCheck: [false],
            peGuaranteeOther: [undefined],
            fixedAssetOtherCheck: [false],
            fixedAssetOther: [undefined],
            currentAssetsOtherCheck: [false],
            currentAssetsOther: [undefined],
            personalLoanOtherCheck: [false],
            personalLoanOther: [undefined],
            cashlienOtherCheck: [false],
            cashlienOther: [undefined],
            cashLetterOtherCheck: [false],
            cashLetterOther: [undefined],
            cashGuaranteeOtherCheck: [false],
            cashGuaranteeOther: [undefined],
            loanTamsukOtherCheck: [false],
            loanTamsukOther: [undefined],
            promiseOtherCheck: [false],
            promiseOther: [undefined],
        });
    }

    submit() {
        this.spinner = true;
        // this.cadData.docStatus = CadDocStatus.OFFER_PENDING;
        if (this.existingOfferLetter) {
            this.cadData.offerDocumentList.forEach(singleCadFile => {
                if (singleCadFile.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER).toString()) {
                    singleCadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER);
            offerDocument.initialInformation = JSON.stringify(this.offerLetterForm.value);
            this.cadData.offerDocumentList.push(offerDocument);
        }
        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
            this.dialogRef.close();
            this.spinner = false;
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
        });
    }

    log(loan, data) {
        const data12 = {loan: loan.loanName, isFunded: loan.isFunded,
            loanNature: loan.loanNature, subLoan: data, commissionFrequency: loan.commissionFrequency};
        this.arrayOfSubloan.push(data12);
    }

    saveLoanSubLoan() {
        const arrUniq = [...new Map(this.arrayOfSubloan.map(v => [v.loan, v])).values()];
        this.arrayOfSubloan = arrUniq;
        if (!ObjectUtil.isEmpty(arrUniq)) {
            arrUniq.forEach((d, i) => {
                if (!ObjectUtil.isEmpty(this.offerLetterForm.get(['purpose', i]))) {
                    this.offerLetterForm.get(['purpose', i]).patchValue({loan: d.loan, subLoan: d.subLoan, isFunded: d.isFunded,
                        loanNature: d.loanNature, commissionFrequency: d.commissionFrequency});
                } else {
                    this.offerLetterForm.get(['purpose', i]).patchValue({loan: d.loan, subLoan: d.subLoan, isFunded: d.isFunded,
                        loanNature: d.loanNature, commissionFrequency: d.commissionFrequency});
                }
            });
        }
        this.close();
    }

    close() {
        this.modalService.dismissAll();
    }

    checkSubLoanType() {
        if ((this.loanName.includes('DEMAND LOAN') ||
            this.loanName.includes('TERM LOAN') ||
            this.loanName.includes('HOME LOAN') ||
            this.loanName.includes('SANA BYAWASAI KARJA') ||
            this.loanName.includes('SANA BYAWASAI KARJA - LITE') ||
            this.loanName.includes('BANK GUARANTEE') ||
            this.loanName.includes('TRUST RECEIPT LOAN')) && this.offerLetterForm.get('subLoanType').value === null) {
            this.hasSubLoanType = true;
        }
    }

    valueChange(value, i, formControlName) {
        if (formControlName === 'purpose') {
            this.offerLetterForm.get(['purpose', i, formControlName]).patchValue(value);
            this.offerLetterForm.get(['purpose', i, 'otherPurpose']).patchValue(null);
        } else if (formControlName === 'rateMode') {
            this.offerLetterForm.get(['purpose', i, 'rateMode']).patchValue(value);
            this.offerLetterForm.get(['purpose', i, 'premiumRate']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'monthlyRate']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'quarterlyRate']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'otherInterestRate']).patchValue(null);
        } else if (formControlName === 'repaymentMode') {
            this.offerLetterForm.get(['purpose', i, formControlName]).patchValue(value);
            this.offerLetterForm.get(['purpose', i, 'repaymentAmount']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'repaymentAmount1']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'repaymentAmount2']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'repaymentAmount3']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'repaymentAmountWord']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'repaymentMonthly']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'repaymentRate']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'repaymentRate1']).patchValue(null);
            this.offerLetterForm.get(['purpose', i, 'otherRepayment']).patchValue(null);
        } else {
            this.offerLetterForm.get(['purpose', i, formControlName]).patchValue(value);
        }
    }

    otherValueCheck(checked, i, formControlName) {
        switch (formControlName) {
            case 'drawDownCheck':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'drawDownCheck']).patchValue(checked);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'drawDownCheck']).patchValue(false);
                    this.offerLetterForm.get(['purpose', i, 'drawDown']).patchValue(null);
                }
                break;
            case 'drawDownPeriodNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'drawDownPeriodNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'drawDownDate']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'downPeriodValue']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'drawDownPeriodNeeded']).patchValue(checked);
                }
                break;
            case 'drawDownOtherPeriodCheck':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'drawDownOtherPeriodCheck']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'drawDownDate']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'drawDownOtherPeriodCheck']).patchValue(false);
                    this.offerLetterForm.get(['purpose', i, 'downPeriodValue']).patchValue(null);
                }
                break;
            case 'moratariumPeriodNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'moratariumPeriodNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'moratariumMonth']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'moratariumValue']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'moratariumPeriodNeeded']).patchValue(checked);
                }
                break;
            case 'moratariumOtherCheck':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'moratariumOtherCheck']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'moratariumMonth']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'moratariumOtherCheck']).patchValue(false);
                    this.offerLetterForm.get(['purpose', i, 'moratariumValue']).patchValue(null);
                }
                break;
            case 'commissionOtherChecked':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'commissionOtherChecked']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'rate']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'commissionOtherChecked']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'commissionOther']).patchValue(null);
                }
                break;
            case 'commissionNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'commissionNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'rate']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'commissionOther']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'commissionNeeded']).patchValue(checked);
                }
                break;
            case 'maturityNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'maturityNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'maturityDate']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'maturityNeeded']).patchValue(checked);
                }
                break;
            case 'maturityOtherCheck':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'maturityOtherCheck']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'maturityValue']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'maturityOtherCheck']).patchValue(checked);
                }
                break;
            case 'tenureNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'tenureNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'reviewDate']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'tenureNeeded']).patchValue(checked);
                }
                break;
            case 'processingNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'processingNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'loanProcessingRate']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'loanProcessingAmount']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'processingNeeded']).patchValue(checked);
                }
                break;
            case 'adNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'adNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'administrationRate']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'administrationAmount']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'adNeeded']).patchValue(checked);
                }
                break;
        }
    }

    parseAssignedLoanData() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.cadData.assignedLoan.forEach((l, i) => {
                this.loanType.push(l.loanType);
                if (!ObjectUtil.isEmpty(l.taggedGuarantors)) {
                    l.taggedGuarantors.forEach(t => {
                        if (t.consentOfLegalHeirs) {
                            this.corporateGuarantor = true;
                        }
                    });
                }
                this.addPurpose(l);
            });
            const security: Security = this.cadData.loanHolder.security;
            const siteVisit: SiteVisit = this.cadData.loanHolder.siteVisit;
            if (!ObjectUtil.isEmpty(siteVisit)) {
                this.siteVisitPresent = true;
                const siteVisitData = JSON.parse(siteVisit.data);
                if (siteVisitData.currentAssetsInspectionFormChecked) {
                    this.currentAssetstPresent = true;
                }
            }
            if (!ObjectUtil.isEmpty(security)) {
                this.securityPresent = true;
                this.securityData = JSON.parse(security.approvedData);
                this.selectedArray = this.securityData.selectedArray;
                if (this.selectedArray.length > 0) {
                    this.multipleSecurity = true;
                }
                if (this.securityData.collateralSiteVisit) {
                    this.isCollateral = true;
                }
            }
            const shareSecurity: ShareSecurity = this.cadData.loanHolder.shareSecurity;
            if (!ObjectUtil.isEmpty(shareSecurity)) {
                this.shareData = JSON.parse(shareSecurity.approvedData);
            }

            // security Data patch
            this.selectedArray.forEach(s => {
                if (s === 'LandSecurity') {
                    this.addSecurity(this.securityData['initialForm']['landDetails']);
                }
                // if (s === 'Land and Building Security') {
                //     this.addSecurity(this.securityData['initialForm']['landBuilding']);
                // }
                // if (s === 'ApartmentSecurity') {
                //     this.addSecurity(this.securityData['initialForm']['buildingDetails']);
                // }
                // if (s === 'VehicleSecurity') {
                //     this.addVehicleSecurity(this.securityData['initialForm']['vehicleDetails']);
                // }
                if (s === 'ShareSecurity') {
                    this.addShareSecurity(this.shareData);
                }
            });
        }
    }

    addSecurity(data) {
        console.log('data', data);
        const security = this.offerLetterForm.get('security') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(d => {
                security.push(
                    this.formBuilder.group({
                        ownerName: [d.ownerNepali],
                        district: [undefined],
                        vdc: [undefined],
                        wardNo: [undefined],
                        plotNumber: [d.plotNumber],
                        area: [d.area]
                    })
                );
            });
        }
    }

    addShareSecurity(data) {
        const shareSecurityDetail = data.shareSecurityDetails;
        const security = this.offerLetterForm.get('shareSecurity') as FormArray;
        if (!ObjectUtil.isEmpty(shareSecurityDetail)) {
            shareSecurityDetail.forEach(d => {
                security.push(
                    this.formBuilder.group({
                        shareHolderName: [undefined],
                        companyName: [d.companyName],
                        totalShareUnit: [d.totalShareUnit],
                        shareType: [d.shareType],
                    })
                );
            });
        }
    }

    addVehicleSecurity(data) {
        const security = this.offerLetterForm.get('vehicleSecurity') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(d => {
                security.push(
                    this.formBuilder.group({
                        vehicleDetail: [undefined],
                        engineNumber: [d.engineNumber],
                        chassisNumber: [d.chassisNumber],
                        model: [d.model]
                    })
                );
            });
        }
    }

    securityValueChange(value: any, i: number, formControlName) {
        this.offerLetterForm.get(['shareSecurity', i, formControlName]).patchValue(value);
    }

    addPurpose(data) {
        const purposeData = this.offerLetterForm.get('purpose') as FormArray;
        purposeData.push(
            this.formBuilder.group({
                loan: [data.loan.name],
                loanLimitAmount: [data.proposal.proposedLimit],
                loanLimitWord: [undefined],
                isFunded: [data.loan.isFunded],
                loanNature: [data.loan.loanNature],
                loanType: [data.loanType],
                purpose: [undefined],
                drawDown: [undefined],
                drawDownCheck: [true],
                otherPurpose: [undefined],
                periodOtherCheck: [false],
                drawDownOtherPeriodCheck: [false],
                maturityOtherCheck: [false],
                moratariumOtherCheck: [false],
                drawDownPeriodNeeded: [true],
                commissionNeeded: [true],
                maturityNeeded: [true],
                tenureNeeded: [true],
                adNeeded: [true],
                processingNeeded: [true],
                moratariumPeriodNeeded: [true],
                moratariumValue: [undefined],
                maturityValue: [undefined],
                downPeriodValue: [undefined],
                moratariumMonth: [undefined],
                drawDownDate: [undefined],
                termMonth: [undefined],
                periodValue: [undefined],
                rate: [undefined],
                commissionFrequency: [data.proposal.commissionFrequency],
                commissionOther: [undefined],
                commissionOtherChecked: [undefined],
                creditRate: [undefined],
                creditAmount: [undefined],
                maturityDate: [undefined],
                telexAmount: [undefined],
                // Rate model
                rateMode: [undefined],
                reviewDate: [undefined],
                premiumRate: [undefined],
                monthlyRate: [undefined],
                quarterlyRate: [undefined],
                // Repayment
                repaymentMode: [undefined],
                repaymentAmount: [undefined],
                repaymentAmount1: [undefined],
                repaymentAmount2: [undefined],
                repaymentAmount3: [undefined],
                repaymentAmountWord: [undefined],
                repaymentMonthly: [undefined],
                repaymentRate: [undefined],
                repaymentRate1: [undefined],
                administrationRate: [undefined],
                administrationAmount: [undefined],
                reviewRate: [undefined],
                reviewAmount: [undefined],
                loanProcessingRate: [undefined],
                loanProcessingAmount: [undefined],
                otherRepayment: [undefined],
                otherInterestRate: [undefined],
                otherAdFeeChecked: [false],
                otherloanProcessingChecked: [false],
                adFeeOther: [undefined],
                otherloanProcessing: [undefined]
            })
        );
    }

    otherCheck(event, value) {
        switch (value) {
            case 'swapFee':
                if (event) {
                    this.offerLetterForm.get('swapFee').patchValue(event);
                } else {
                    this.offerLetterForm.get('swapFee').patchValue(false);
                    this.offerLetterForm.get('otherSwapFeeChecked').patchValue(false);
                    this.offerLetterForm.get('swapFeeOther').patchValue(null);
                }
                break;
            case 'otherSwapFeeChecked':
                if (event) {
                    this.offerLetterForm.get('otherSwapFeeChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('otherSwapFeeChecked').patchValue(false);
                    this.offerLetterForm.get('swapFeeOther').patchValue(null);
                }
                break;
            case 'prepaymentCharge':
                if (event) {
                    this.offerLetterForm.get('prepaymentCharge').patchValue(event);
                } else {
                    this.offerLetterForm.get('prepaymentCharge').patchValue(false);
                    this.offerLetterForm.get('prepaymentOtherCheck').patchValue(false);
                    this.offerLetterForm.get('prepaymentOther').patchValue(null);
                }
                break;
            case 'prepaymentOtherCheck':
                if (event) {
                    this.offerLetterForm.get('prepaymentOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('prepaymentOtherCheck').patchValue(false);
                    this.offerLetterForm.get('prepaymentOther').patchValue(null);
                }
                break;
            case 'commitmentFee':
                if (event) {
                    this.offerLetterForm.get('commitmentFee').patchValue(event);
                } else {
                    this.offerLetterForm.get('commitmentFee').patchValue(false);
                    this.offerLetterForm.get('commitmentFeeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('commitmentFeeOther').patchValue(null);
                }
                break;
            case 'commitmentFeeOtherCheck':
                if (event) {
                    this.offerLetterForm.get('commitmentFeeOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('commitmentFeeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('commitmentFeeOther').patchValue(null);
                }
                break;
            case 'informationFee':
                if (event) {
                    this.offerLetterForm.get('informationFee').patchValue(event);
                } else {
                    this.offerLetterForm.get('informationFee').patchValue(false);
                    this.offerLetterForm.get('informationFeeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('informationFeeOther').patchValue(null);
                }
                break;
            case 'informationFeeOtherCheck':
                if (event) {
                    this.offerLetterForm.get('informationFeeOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('informationFeeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('informationFeeOther').patchValue(null);
                }
                break;
            case 'valuationFee':
                if (event) {
                    this.offerLetterForm.get('valuationFee').patchValue(event);
                } else {
                    this.offerLetterForm.get('valuationFee').patchValue(false);
                    this.offerLetterForm.get('valuationFeeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('valuationFeeOther').patchValue(null);
                }
                break;
            case 'valuationFeeOtherCheck':
                if (event) {
                    this.offerLetterForm.get('valuationFeeOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('valuationFeeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('valuationFeeOther').patchValue(null);
                }
                break;
            case 'penalInterest':
                if (event) {
                    this.offerLetterForm.get('penalInterest').patchValue(event);
                } else {
                    this.offerLetterForm.get('penalInterest').patchValue(false);
                    this.offerLetterForm.get('penalInterestOtherCheck').patchValue(false);
                    this.offerLetterForm.get('penalInterestOther').patchValue(null);
                }
                break;
            case 'penalInterestOtherCheck':
                if (event) {
                    this.offerLetterForm.get('penalInterestOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('penalInterestOtherCheck').patchValue(false);
                    this.offerLetterForm.get('penalInterestOther').patchValue(null);
                }
                break;
            case 'peGuaranteeOtherCheck':
                if (event) {
                    this.offerLetterForm.get('peGuaranteeOtherCheck').patchValue(event);
                    this.offerLetterForm.get('personalName').patchValue(null);
                    this.offerLetterForm.get('personalAmount').patchValue(null);
                    this.offerLetterForm.get('personalAmountWord').patchValue(null);
                } else {
                    this.offerLetterForm.get('peGuaranteeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('peGuaranteeOther').patchValue(null);
                }
                break;
            case 'coGuaranteeOtherCheck':
                if (event) {
                    this.offerLetterForm.get('coGuaranteeOtherCheck').patchValue(event);
                    this.offerLetterForm.get('corporateName').patchValue(null);
                    this.offerLetterForm.get('corporateAmount').patchValue(null);
                    this.offerLetterForm.get('corporateAmountWord').patchValue(null);
                } else {
                    this.offerLetterForm.get('coGuaranteeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('coGuaranteeOther').patchValue(null);
                }
                break;
            case 'currentAssetsOtherCheck':
                if (event) {
                    this.offerLetterForm.get('currentAssetsOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('currentAssetsOtherCheck').patchValue(false);
                    this.offerLetterForm.get('currentAssetsOther').patchValue(null);
                }
                break;
            case 'fixedAssetOtherCheck':
                if (event) {
                    this.offerLetterForm.get('fixedAssetOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('fixedAssetOtherCheck').patchValue(false);
                    this.offerLetterForm.get('fixedAssetOther').patchValue(null);
                }
                break;
            case 'personalLoanOtherCheck':
                if (event) {
                    this.offerLetterForm.get('personalLoanOtherCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('personalLoanOtherCheck').patchValue(false);
                    this.offerLetterForm.get('personalLoanOther').patchValue(null);
                }
                break;
            case 'cashlienOtherCheck':
                if (event) {
                    this.offerLetterForm.get('cashlienOtherCheck').patchValue(event);
                    this.offerLetterForm.get('accountName').patchValue(null);
                    this.offerLetterForm.get('accountNo').patchValue(null);
                    this.offerLetterForm.get('accountAmount').patchValue(null);
                    this.offerLetterForm.get('accountAmountWord').patchValue(null);
                } else {
                    this.offerLetterForm.get('cashlienOtherCheck').patchValue(false);
                    this.offerLetterForm.get('cashlienOther').patchValue(null);
                }
                break;
            case 'loanTamsukOtherCheck':
                if (event) {
                    this.offerLetterForm.get('loanTamsukOtherCheck').patchValue(event);
                    this.offerLetterForm.get('loanAmount').patchValue(null);
                    this.offerLetterForm.get('loanAmountWord').patchValue(null);
                } else {
                    this.offerLetterForm.get('loanTamsukOtherCheck').patchValue(false);
                    this.offerLetterForm.get('loanTamsukOther').patchValue(null);
                }
                break;
            case 'promiseOtherCheck':
                if (event) {
                    this.offerLetterForm.get('promiseOtherCheck').patchValue(event);
                    this.offerLetterForm.get('promiseAmount').patchValue(null);
                    this.offerLetterForm.get('promiseAmountWord').patchValue(null);
                } else {
                    this.offerLetterForm.get('promiseOtherCheck').patchValue(false);
                    this.offerLetterForm.get('promiseOther').patchValue(null);
                }
                break;

            case 'cashLetterOtherCheck':
                if (event) {
                    this.offerLetterForm.get('cashLetterOtherCheck').patchValue(event);
                    this.offerLetterForm.get('letterCM').patchValue(null);
                } else {
                    this.offerLetterForm.get('cashLetterOtherCheck').patchValue(false);
                    this.offerLetterForm.get('cashLetterOther').patchValue(null);
                }
                break;

            case 'cashGuaranteeOtherCheck':
                if (event) {
                    this.offerLetterForm.get('cashGuaranteeOtherCheck').patchValue(event);
                    this.offerLetterForm.get('guarnateeCM').patchValue(null);
                } else {
                    this.offerLetterForm.get('cashGuaranteeOtherCheck').patchValue(false);
                    this.offerLetterForm.get('cashGuaranteeOther').patchValue(null);
                }
                break;
            case 'otherAdFeeChecked':
                if (event) {
                    this.offerLetterForm.get('otherAdFeeChecked').patchValue(event);
                    this.offerLetterForm.get('administrationAmount').patchValue(null);
                    this.offerLetterForm.get('administrationRate').patchValue(null);
                } else {
                    this.offerLetterForm.get('otherAdFeeChecked').patchValue(false);
                    this.offerLetterForm.get('adFeeOther').patchValue(null);
                }
                break;
        }
    }

    addOtherCovenants() {
        (this.offerLetterForm.get('covenant') as FormArray).push(
            this.formBuilder.group({
                otherCovenant: [undefined]
            })
        );
    }

    setOtherCovenants(data) {
        const dataArray = this.offerLetterForm.get('covenant') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    otherCovenant: [singleData.otherCovenant]
                }));
            });
        }
    }

    removeOtherCovenants(index: number) {
        (<FormArray>this.offerLetterForm.get('covenant')).removeAt(index);
    }

    addEventDefault() {
        (this.offerLetterForm.get('eventDefault') as FormArray).push(
            this.formBuilder.group({
                otherEventDeafult: [undefined]
            })
        );
    }

    setEventDefaul(data) {
        const dataArray = this.offerLetterForm.get('eventDefault') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    otherEventDeafult: [singleData.otherEventDeafult]
                }));
            });
        }
    }

    removeEventDefault(index: number) {
        (<FormArray>this.offerLetterForm.get('eventDefault')).removeAt(index);
    }

    addEventDefault1() {
        (this.offerLetterForm.get('eventDefault1') as FormArray).push(
            this.formBuilder.group({
                otherEventDeafult: [undefined]
            })
        );
    }

    setEventDefaul1(data) {
        const dataArray = this.offerLetterForm.get('eventDefault1') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    otherEventDeafult: [singleData.otherEventDeafult]
                }));
            });
        }
    }

    removeEventDefault1(index: number) {
        (<FormArray>this.offerLetterForm.get('eventDefault1')).removeAt(index);
    }

    addRepresentation() {
        (this.offerLetterForm.get('representation') as FormArray).push(
            this.formBuilder.group({
                otherRepresentation: [undefined]
            })
        );
    }

    removeRepresentation(i: number) {
        (<FormArray>this.offerLetterForm.get('representation')).removeAt(i);
    }

    setRepresentation(data) {
        const dataArray = this.offerLetterForm.get('representation') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    otherRepresentation: [singleData.otherRepresentation]
                }));
            });
        }
    }

    addAcceptance() {
        (this.offerLetterForm.get('acceptance') as FormArray).push(
            this.formBuilder.group({
                otherAcceptance: [undefined]
            })
        );
    }

    removeAcceptance(i: number) {
        (<FormArray>this.offerLetterForm.get('acceptance')).removeAt(i);
    }

    setAcceptance(data) {
        const dataArray = this.offerLetterForm.get('acceptance') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    otherAcceptance: [singleData.otherAcceptance]
                }));
            });
        }
    }

    addPrecedent() {
        (this.offerLetterForm.get('precedent') as FormArray).push(
            this.formBuilder.group({
                otherPrecedent: [undefined]
            })
        );
    }

    removePrecedent(i: number) {
        (<FormArray>this.offerLetterForm.get('precedent')).removeAt(i);
    }

    setPrecedent(data) {
        const dataArray = this.offerLetterForm.get('precedent') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    otherPrecedent: [singleData.otherPrecedent]
                }));
            });
        }
    }

    convertProposed() {
        const data = this.offerLetterForm.get('purpose') as FormArray;
        data.value.forEach((d, i) => {
            const amount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(d.loanLimitAmount));
            const word = this.nepaliCurrencyWordPipe.transform(d.loanLimitAmount);
            this.offerLetterForm.get(['purpose', i, 'loanLimitAmount']).patchValue(amount);
            this.offerLetterForm.get(['purpose', i, 'loanLimitWord']).patchValue(word);
        });
    }
}
