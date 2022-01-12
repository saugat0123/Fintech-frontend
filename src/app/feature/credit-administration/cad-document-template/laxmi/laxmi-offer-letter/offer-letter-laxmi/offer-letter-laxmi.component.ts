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
    securityData: Security;
    singleSecurity = false;
    selectedArray = [];
    arrayOfSubloan = [];
    test111 = [];
    subLoanData = [];
    loanType = [];

    loanNotHavingSubloan = ['HOME EQUITY LINE OF CREDIT', 'HOME EQUITY INSTALLMENT OF CREDIT', 'HOME EQUITY INSTALLMENT OF CREDIT - LITE',
        'BRIDGE GAP LOAN', 'LETTER OF CREDIT', 'HIRE PURCHASE LOAN', 'COMMERCIAL AUTO LOAN', 'PERSONAL LOAN', 'EDUCATIONAL LOAN', 'AGMI'];
    loanHavingSubLoan = ['OVERDRAFT', 'DEMAND LOAN', 'TERM LOAN', 'TRUST RECEIPT LOAN', 'HOME LOAN', 'BANK GUARANTEE',
        'SANA BYAWASAI KARJA', 'SANA BYAWASAI KARJA - LITE'];
    commissionTime = ['त्रैमासिक', 'मासिक', 'Other'];
    loanWithSubloan = [];
    loanNature = [];
    loanWithOutSubLoan = [];
    proposalData = [];
    commissionFrequency = [];

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
        // this.modalService.open(this.modal);
        if (this.hasSubLoanType) {
          this.modalService.open(this.modal);
        }
        this.addFixedAssetsCollateral();
        this.addOtherCovenants();
        this.addAcceptance();
        this.addEventDefault();
        this.addEventDefault1();
        this.addRepresentation();
        this.addPrecedent();
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER);
            this.saveLoanSubLoan();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.initialInfoPrint = initialInfo;
            this.existingOfferLetter = true;
            this.offerLetterForm.patchValue(initialInfo);
            this.arrayOfSubloan = initialInfo.subLoanType;
            this.setSubLoanData(initialInfo.purpose);
            this.setOtherCovenants(initialInfo.covenant);
            this.setAcceptance(initialInfo.acceptance);
            this.setEventDefaul(initialInfo.eventDefault);
            this.setEventDefaul1(initialInfo.eventDefault1);
            this.setRepresentation(initialInfo.representation);
            this.setPrecedent(initialInfo.precedent);
            console.log('initialInfo', initialInfo);
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
            workingLandBuildingRate: [undefined],
            // month: [undefined],
            creditRate: [undefined],
            creditAmount: [undefined],
            creditMaturityDate: [undefined],
            creditTelexAmount: [undefined],
            moratariumRate: [undefined],
            autoRate: [undefined],
            autoModel: [undefined],
            // bidRate: [undefined],
            // performanceRate: [undefined],
            // advanceRate: [undefined],

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
                    singleCadFile.initialInformation = JSON.stringify(this.offerLetterForm.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER);
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

    log(loan, data) {
        console.log('loanName', loan);
        console.log('data', data);
        const data12 = {loan: loan.loanName, isFunded: loan.isFunded,
            loanNature: loan.loanNature, subLoan: data, commissionFrequency: loan.commissionFrequency};
        this.arrayOfSubloan.push(data12);
    }

    saveLoanSubLoan() {
        const arrUniq = [...new Map(this.arrayOfSubloan.map(v => [v.loan, v])).values()];
        this.arrayOfSubloan = arrUniq;
        console.log('arrUniq', arrUniq);
        console.log('arrayOfSubloan', this.arrayOfSubloan);
        if (!ObjectUtil.isEmpty(arrUniq)) {
            arrUniq.forEach((d, i) => {
                if (!ObjectUtil.isEmpty(this.offerLetterForm.get(['purpose', i]))) {
                    this.offerLetterForm.get(['purpose', i]).patchValue({loan: d.loan, subLoan: d.subLoan, isFunded: d.isFunded,
                        loanNature: d.loanNature, commissionFrequency: d.commissionFrequency});
                } else {
                    this.addPurpose();
                    this.offerLetterForm.get(['purpose', i]).patchValue({loan: d.loan, subLoan: d.subLoan, isFunded: d.isFunded,
                        loanNature: d.loanNature, commissionFrequency: d.commissionFrequency});
                }
            });
        }
        console.log('offerLetterForm purpose', this.offerLetterForm.get('purpose'));
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
        console.log('Add purpose');
        const data = this.offerLetterForm.get('purpose') as FormArray;
        data.push(
            this.formBuilder.group({
                loan: [undefined],
                subLoan: [undefined],
                isFunded: [undefined],
                loanNature: [undefined],
                purpose: [undefined],
                drawDown: [undefined],
                other: [undefined],
                periodOtherCheck: [false],
                termMonth: [undefined],
                periodValue: [undefined],
                rate: [undefined],
                commissionFrequency: [undefined]
            })
        );
    }

    removeFixedAssetsCollateral(i) {
        (<FormArray>this.offerLetterForm.get('fixedAssetsCollateral')).removeAt(i);
    }

    purposeChange(value, i) {
        this.offerLetterForm.get(['purpose', i, 'purpose']).patchValue(value);
        if (this.offerLetterForm.get(['purpose', i, 'purpose']).value !== 'Other') {
            this.offerLetterForm.get(['purpose', i, 'other']).setValue(null);
        }
    }

    purposeChangeNonSubLoan(event) {
        console.log(event);
        if (!ObjectUtil.isEmpty(this.offerLetterForm.get('educationPurpose').value)) {
            console.log('test');
        }

    }

    parseSiteVisitSecurityData() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            let loanData;
            this.cadData.assignedLoan.forEach((l, i) => {
                loanData = l.loan.name;
                const subLoan = SubLoanType.value(loanData);
                this.loanName.push(loanData);
                this.loanHavingSubLoan.forEach(loan => {
                   if (loan === loanData) {
                       // const test = {loanName: l.loan.name, subLoanName: subLoan};
                       this.loanWithSubloan.push({loanName: l.loan.name, subLoanName: subLoan,
                           loanNature: l.loan.loanNature, isFunded: l.loan.isFundable,
                           commissionFrequency: l.proposal.commissionFrequency});
                       console.log('Loan having Sub Loan');
                   }
                });
                this.loanNotHavingSubloan.forEach(loan1 => {
                    if (loan1 === loanData) {
                        console.log('Loan Not having Sub Loan');
                        this.loanWithOutSubLoan.push({loanName: l.loan.name, loanNature: l.loan.loanNature, isFunded: l.loan.isFundable,
                            commissionFrequency: l.proposal.commissionFrequency});
                    }
                });
                this.loanType.push(l.loanType);
                this.loanNature.push(l.loan.loanNature);
                this.commissionFrequency.push(l.proposal.commissionFrequency);
                // this.proposalData.push(l.proposal);
                this.proposalData = l.proposal.commissionFrequency;
            });
            console.log('loanWithSubloan', this.loanWithSubloan);
            console.log('loanNotHavingSubloan', this.loanNotHavingSubloan);
            console.log('LoanName', this.loanName);
            console.log('loanType', this.loanType);
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

    drawChange(value, i) {
        this.offerLetterForm.get(['purpose', i, 'drawDown']).patchValue(value);
    }

    otherPurposeChange(value, i) {
        this.offerLetterForm.get(['purpose', i, 'other']).patchValue(value);
    }

    setSubLoanData(data) {
        console.log('setData', data);
        const test = this.offerLetterForm.get('purpose') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach((p) => {
                test.push(this.formBuilder.group({
                    loan: [p.loan],
                    subLoan: [p.subLoan],
                    purpose: [p.purpose],
                    drawDown: [p.drawDown],
                    other: [p.other],
                    periodOtherCheck: [p.periodOtherCheck],
                    termMonth: [p.termMonth],
                    periodValue: [p.periodValue],
                    rate: [p.rate],
                    commissionFrequency: [p.commissionFrequency],
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
    }

    periodOtherCheck(checked, i) {
        console.log('checked', checked);
        if (checked) {
            this.offerLetterForm.get(['purpose', i, 'periodOtherCheck']).patchValue(checked);
        } else {
            this.offerLetterForm.get(['purpose', i, 'periodOtherCheck']).patchValue(false);
        }
        console.log(this.offerLetterForm.get('purpose').value);
        console.log('index', i);
    }

    periodChangeValue(value: any, i: number) {
        this.offerLetterForm.get(['purpose', i, 'periodValue']).patchValue(value);
    }

    commissionValue(value: any, i: number) {
        this.offerLetterForm.get(['purpose', i, 'rate']).patchValue(value);
    }

    termMonthValue(value: any, i: number) {
        this.offerLetterForm.get(['purpose', i, 'termMonth']).patchValue(value);
    }

    otherCheck(event, value) {
        console.log('event', event);
        console.log('value', value);
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
        }
        console.log(this.offerLetterForm);
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
}
