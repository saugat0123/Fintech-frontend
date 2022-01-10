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
import {validate} from 'codelyzer/walkerFactory/walkerFn';

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
    loanType;
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
    securityData: Security;
    singleSecurity = false;
    selectedArray = [];
    subLoanTypeEnum1 = [];
    arrayOfSubloan = [];
    test111 = [];
    subLoanData = [];

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
        this.parseSiteVisitSecurityData();
        console.log('cadData', this.cadData);
        this.buildForm();
        this.checkOfferLetter();
        this.checkSubLoanType();
        this.modalService.open(this.modal);
        // if (this.hasSubLoanType) {
        //   this.modalService.open(this.modal);
        // }
        this.addFixedAssetsCollateral();
        console.log('initial arrayOfSubloan', this.arrayOfSubloan);
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            console.log('offerLetterDocument', this.offerLetterDocument);
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER);
            this.saveLoanSubLoan();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.offerLetterForm.patchValue(initialInfo);
            this.arrayOfSubloan = initialInfo.subLoanType;
            const purposeData = initialInfo.purpose;
            console.log('purposeData', purposeData);
            this.setSubLoanData(purposeData);
            // this.setSubLoanType(initialInfo.subLoanType);
            console.log('initialInfo', initialInfo);
            console.log('offerLetterForm', this.offerLetterForm);
        }
    }

    buildForm() {
        this.offerLetterForm = this.formBuilder.group({
            signature1: [undefined],
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
            // landOwnerName: [undefined],
            // securityDistrict: [undefined],
            // securityVdc: [undefined],
            // securityWard: [undefined],
            // securityKitta: [undefined],
            // securityArea: [undefined],

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
            amount2: [undefined],
            date3: [undefined],
            amount3: [undefined],
            date4: [undefined],
            date5: [undefined],
            date6: [undefined],
            date7: [undefined],
            date8: [undefined],
            date9: [undefined],
            date10: [undefined],

            // subLoantype
            samjhautapatra: [undefined],
            samjhautapatra1: [undefined],
            samjhautapatra2: [undefined],
            date: [undefined],
            borrowerName1: [undefined],
            address1: [undefined],
            phoneNo: [undefined],
            attention: [undefined],
            workingRate: [undefined],
            workingCapitalPurpose: [undefined],
            workingCapitalDrawDown: [undefined],
            workingOther: [undefined],
            workingLandBuildingRate: [undefined],
            month: [undefined],
            creditRate: [undefined],
            creditAmount: [undefined],
            creditMaturityDate: [undefined],
            creditTelexAmount: [undefined],
            moratariumRate: [undefined],
            autoRate: [undefined],
            autoModel: [undefined],
            bidRate: [undefined],
            performanceRate: [undefined],
            advanceRate: [undefined],

            shareDrawdown: [undefined],
            goldLoanDrawdown: [undefined],
            homeEquityDrawDown: [undefined],
            bridgeGapDrawdown: [undefined],
            capitalDrawdown: [undefined],
            fixedAssetsDrawdown: [undefined],
            vehiceDrawdown: [undefined],
            refinancingDrawDown: [undefined],
            loanAgainstDrawdown: [undefined],
            ttDrawdown: [undefined],
            purchaseDrawdown: [undefined],
            constructionDrawdown: [undefined],
            hirePurchaseDrawdown: [undefined],
            commercialAutoDrawdown: [undefined],
            educationalDrawdown: [undefined],
            agmiDrawdown: [undefined],

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

            // textArea formcontrol
            letterPurpose: [undefined],
            letterOther: [undefined],
            vehiclePurpose: [undefined],
            vehicleOther: [undefined],
            fixedPurpose: [undefined],
            fixedOther: [undefined],
            capitalPurpose: [undefined],
            capitalOther: [undefined],
            bridgeGapPurpose: [undefined],
            bridgeGapOther: [undefined],
            homeEquityPurpose: [undefined],
            homeEquityOther: [undefined],
            goldLoanPurpose: [undefined],
            goldLoanOther: [undefined],
            shareLoanPurpose: [undefined],
            shareLoanOther: [undefined],
            refinancingPurpose: [undefined],
            refinancingOther: [undefined],
            loanAgainstPurpose: [undefined],
            loanAgainstOther: [undefined],
            loanAgainstTPurpose: [undefined],
            loanAgainstTOther: [undefined],
            purchasePurpose: [undefined],
            purchaseOther: [undefined],
            constructionPurpose: [undefined],
            constructionOther: [undefined],
            hirePurpose: [undefined],
            hireOther: [undefined],
            commercialPurpose: [undefined],
            commercialOther: [undefined],
            personalPurpose: [undefined],
            personalOther: [undefined],
            bidPurpose: [undefined],
            bidOther: [undefined],
            performancePurpose: [undefined],
            performanceOther: [undefined],
            purpose: this.formBuilder.array([])
        });
    }

    submit() {
        this.spinner = true;
        this.cadData.docStatus = CadDocStatus.OFFER_PENDING;
        if (this.existingOfferLetter) {
            this.cadData.offerDocumentList.forEach(singleCadFile => {
                if (singleCadFile.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER).toString()) {
                    this.offerLetterForm.get('subLoanType').patchValue(this.arrayOfSubloan);
                    // singleCadFile.subLoanArray = this.arrayOfSubloan;
                    singleCadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER);
            // offerDocument.subLoanArray = this.arrayOfSubloan;
            // this.arrayOfSubloan.forEach(l => {
            //     l.subLoan.filter((aa, i) => aa === 'Working Capital Financing');
            //     if (l.length > 0) {
            //         this.offerLetterForm.get('').patchValue(null);
            //     }
            // });
            this.offerLetterForm.get('subLoanType').patchValue(this.arrayOfSubloan);
            offerDocument.initialInformation = JSON.stringify(this.offerLetterForm.value);
            this.cadData.offerDocumentList.push(offerDocument);
        }
        console.log('Submit Data', this.cadData);
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

    log(loanName, data) {
        const data12 = {loan: loanName, subLoan: data};
        this.arrayOfSubloan.push(data12);
    }

    saveLoanSubLoan() {
        const arrUniq = [...new Map(this.arrayOfSubloan.map(v => [v.loan, v])).values()];
        this.arrayOfSubloan = arrUniq;
        console.log('arrayOfSubloan', this.arrayOfSubloan);
        // this.modalService.dismissAll();
        this.arrayOfSubloan.forEach((d, i) => {
            if (!ObjectUtil.isEmpty(d.loan)) {
                this.addPurpose();
                this.offerLetterForm.get(['purpose', i]).patchValue({loan: d.loan, subLoan: d.subLoan});
                // this.offerLetterForm.get(['purpose', i, 'subLoan']).patchValue(d.subLoan);
            }
        });
        console.log('this is form array, ', this.offerLetterForm.get('purpose'));
    }

    close() {
        this.modalService.dismissAll();
    }

    checkSubLoanType() {
        if ((this.loanName.includes('demand loan') ||
            this.loanName.includes('term loan') ||
            this.loanName.includes('home loan') ||
            this.loanName.includes('sana byawasai karja') ||
            this.loanName.includes('sana byawasai karja - lite') ||
            this.loanName.includes('bank guarantee') ||
            this.loanName.includes('trust receipt loan')) && this.offerLetterForm.get('subLoanType').value === null) {
            console.log('open model');
            this.hasSubLoanType = true;
        }
    }

    addFixedAssetsCollateral() {
        const data = this.offerLetterForm.get('fixedAssetsCollateral') as FormArray;
        data.push(
            this.formBuilder.group({
                landOwnerName: [undefined],
                securityDistrict: [undefined],
                securityVdc: [undefined],
                securityWard: [undefined],
                securityKitta: [undefined],
                securityArea: [undefined],
            })
        );
    }

    addPurpose() {
        const data = this.offerLetterForm.get('purpose') as FormArray;
        data.push(
            this.formBuilder.group({
                loan: [undefined],
                subLoan: [undefined],
                purpose: [undefined],
                drawDown: [undefined],
                other: [undefined]
            })
        );
    }

    removeFixedAssetsCollateral(i) {
        (<FormArray>this.offerLetterForm.get('fixedAssetsCollateral')).removeAt(i);
    }

    purposeChange(formControlName, i) {
        console.log('event', formControlName);
        console.log('iiii', i);
        if (!ObjectUtil.isEmpty(this.offerLetterForm.get('workingCapitalPurpose').value)) {
            if (this.offerLetterForm.get('workingCapitalPurpose').value.includes('Other')) {
                this.tempPurposeFlag.workingCapitalOther = true;
            } else {
                this.tempPurposeFlag.workingCapitalOther = false;
                this.offerLetterForm.get('workingOther').setValue(null);
            }
        }
        if (!ObjectUtil.isEmpty(this.offerLetterForm.get('purchasePurpose').value)) {
            if (this.offerLetterForm.get('purchasePurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectPurchaseOther = true;
            } else {
                this.tempPurposeFlag.selectPurchaseOther = false;
                this.offerLetterForm.get('purchaseOther').setValue(null);
            }
        }
        if (!ObjectUtil.isEmpty(this.offerLetterForm.get('shareLoanPurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('goldLoanPurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('homeEquityPurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('bridgeGapPurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('capitalPurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('fixedPurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('vehiclePurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('refinancingPurpose').value) ||
            !ObjectUtil.isEmpty(this.offerLetterForm.get('letterPurpose').value)) {
            if (this.offerLetterForm.get('shareLoanPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectShareLoanOther = true;
            } else {
                this.tempPurposeFlag.selectShareLoanOther = false;
                this.offerLetterForm.get('shareLoanOther').setValue(null);
            }
            if (this.offerLetterForm.get('goldLoanPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectGoldOther = true;
            } else {
                this.tempPurposeFlag.selectGoldOther = false;
                this.offerLetterForm.get('goldLoanOther').setValue(null);
            }
            if (this.offerLetterForm.get('homeEquityPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectGoldOther = true;
            } else {
                this.tempPurposeFlag.selectGoldOther = false;
                this.offerLetterForm.get('homeEquityOther').setValue(null);
            }
            if (this.offerLetterForm.get('bridgeGapPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectBridgeOther = true;
            } else {
                this.tempPurposeFlag.selectBridgeOther = false;
                this.offerLetterForm.get('bridgeGapOther').setValue(null);
            }
            if (this.offerLetterForm.get('capitalPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectCapitalOther = true;
            } else {
                this.tempPurposeFlag.selectCapitalOther = false;
                this.offerLetterForm.get('capitalOther').setValue(null);
            }
            if (this.offerLetterForm.get('fixedPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectFixedAssetsOther = true;
            } else {
                this.tempPurposeFlag.selectFixedAssetsOther = false;
                this.offerLetterForm.get('fixedOther').setValue(null);
            }
            if (this.offerLetterForm.get('vehiclePurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectVehicleOther = true;
            } else {
                this.tempPurposeFlag.selectVehicleOther = false;
                this.offerLetterForm.get('vehicleOther').setValue(null);
            }
            if (this.offerLetterForm.get('refinancingPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectRefinancingOther = true;
            } else {
                this.tempPurposeFlag.selectRefinancingOther = false;
                this.offerLetterForm.get('refinancingOther').setValue(null);
            }
            if (this.offerLetterForm.get('letterPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectLetterOther = true;
            } else {
                this.tempPurposeFlag.selectLetterOther = false;
                this.offerLetterForm.get('letterOther').setValue(null);
            }
            if (this.offerLetterForm.get('loanAgainstPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectLoanAgainstOther = true;
            } else {
                this.tempPurposeFlag.selectLoanAgainstOther = false;
                this.offerLetterForm.get('loanAgainstOther').setValue(null);
            }
            if (this.offerLetterForm.get('loanAgainstTPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectLoanAgainstTOther = true;
            } else {
                this.tempPurposeFlag.selectLoanAgainstTOther = false;
                this.offerLetterForm.get('loanAgainstTOther').setValue(null);
            }
            if (this.offerLetterForm.get('constructionPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectConstructionOther = true;
            } else {
                this.tempPurposeFlag.selectConstructionOther = false;
                this.offerLetterForm.get('constructionOther').setValue(null);
            }
            if (this.offerLetterForm.get('hirePurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectHireOther = true;
            } else {
                this.tempPurposeFlag.selectHireOther = false;
                this.offerLetterForm.get('hireOther').setValue(null);
            }
            if (this.offerLetterForm.get('commercialPurpose').value.includes('Other')) {
                this.tempPurposeFlag.selectcommercialOther = true;
            } else {
                this.tempPurposeFlag.selectcommercialOther = false;
                this.offerLetterForm.get('commercialOther').setValue(null);
            }
        }
        this.setPurposeValue(i, formControlName);
    }

    parseSiteVisitSecurityData() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            let loanData;
            this.cadData.assignedLoan.forEach((l, i) => {
                loanData = l.loan.name;
                const subLoan = SubLoanType.value(loanData);
                this.loanName.push(loanData);
                this.subLoanTypeEnum1.push(subLoan);
            });
            console.log('subLo', this.subLoanTypeEnum1);
            console.log('LoanName', this.loanName);
            // if (this.cadData.assignedLoan.length > 1) {
            //     let loanData;
            //     this.cadData.assignedLoan.forEach((l, i) => {
            //         loanData = l.loan.name;
            //         const subLoan = SubLoanType.value(loanData);
            //         this.loanName.push(loanData);
            //         this.subLoanTypeEnum1.push(subLoan);
            //     });
            //     console.log('subLo', this.subLoanTypeEnum1);
            //     console.log('LoanName', this.loanName);
            // } else {
            //     this.loanName = this.cadData.assignedLoan[0].loan.name;
            //     console.log('loanName', this.loanName);
            //     this.subloanTypes = SubLoanType.value(this.loanName.toString());
            //     this.loanType = this.cadData.assignedLoan[0].loanType;
            //     console.log('loanType', this.loanType);
            //     this.securityData = this.cadData.loanHolder.security;
            //     const sitevisit = this.cadData.loanHolder.siteVisit;
            //     if (!ObjectUtil.isEmpty(this.securityData)) {
            //         console.log(this.securityData);
            //         const data = JSON.parse(this.securityData.data);
            //         this.selectedArray = data.selectedArray;
            //         console.log('selectedArray', this.selectedArray);
            //         if (this.selectedArray.length > 0) {
            //             this.singleSecurity = false;
            //         } else {
            //             this.singleSecurity = true;
            //         }
            //     }
            //     if (!ObjectUtil.isEmpty(sitevisit)) {
            //         const siteVisitData = JSON.parse(sitevisit.data);
            //         console.log('siteVisitData', siteVisitData);
            //     }
            // }
        }
    }

    setPurposeValue(i, value) {
        console.log('Purpose', value);
        this.offerLetterForm.get(['purpose', i, 'purpose']).patchValue(value);
        console.log('this is asdasdasd',  this.offerLetterForm.get('purpose') );
    }
    drawChange(value, i) {
        console.log('drawDown', value);
        this.offerLetterForm.get(['purpose', i, 'drawDown']).patchValue(value);
        console.log('this is drawDown',  this.offerLetterForm.get('purpose') );
    }

    otherPurposeChange(value, i) {
        console.log('other Purpose', value);
        this.offerLetterForm.get(['purpose', i, 'other']).patchValue(value);
        console.log('this is other',  this.offerLetterForm.get('purpose') );
    }

    setSubLoanType(value) {
        value.forEach((l, i) => {
            console.log('i', i);
            console.log('subLoan', l.subLoan);
            // this.offerLetterForm.get(['subLoanType', i]).patchValue(l.subLoan);
            // this.subLoanTypeEnum1 = l.subLoan;
        });
    }

    setSubLoanData(data) {
        console.log('setData', data);
        let count = 0;
        console.log('before', count);
        data.forEach(test1 => {
            if (test1.subLoan === this.subloanTypeEnum.WORKING_CAPITAL_FINANCING) {
                console.log('I am here');
                count++;
            }
            console.log('After', count);
            if (count > 0) {
                this.addWorkingCapital();
            }
        });
        const test = this.offerLetterForm.get('purpose') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((p) => {
                test.push(this.formBuilder.group({
                    loan: [p.loan],
                    subLoan: [p.subLoan],
                    purpose: [p.purpose],
                    drawDown: [p.drawDown],
                    other: [p.other]
                }));
            });
        }
    }


    addWorkingCapital() {
        return this.formBuilder.group({
            purpose: [undefined],
            otherPurpose: [undefined],
            drawDown: [undefined],
        });
        // const data = this.offerLetterForm.get('workingCapital') as FormArray;
        // data.push(
        //
        // );
    }
}
