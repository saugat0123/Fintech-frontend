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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LaxmiPurpose} from '../../../../../loan/model/laxmi-purpose';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {OfferDocument} from '../../../../model/OfferDocument';
import {LaxmiOfferLetterConst} from '../laxmi-offer-letter-const';
import {ClientTypeShortFormPipe} from '../../../../../../@core/pipe/client-type-short-form.pipe';
import {formatDate} from '@angular/common';
import {NepaliCurrencyFormatterPipe} from '../../../../../../@core/pipe/nepali-currency-formatter.pipe';
import {event} from 'd3';

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
    buttonSpinner = false;
    initialInfoPrint;
    cadCheckListEnum = CadCheckListTemplateEnum;
    offerLetterConst = LaxmiOfferLetterConst;
    nepaliData;
    offerLetterDocument;
    purpose = LaxmiPurpose.enumObject();
    ckeConfig = NepaliEditor.CK_CONFIG;
    existingOfferLetter = false;
    loanType = [];
    documentWord = [' गर्नुपर्नेछ |', ' गराएको यथावत रहने छ |'];
    hypoDocument = [' गरिदिनु पर्नेछ |', ' बैंकलाई उपलब्ध गराएको यथावत रहने छ ।'];
    commissionFreq = ['मासिक', 'त्रैमासिक', 'वार्षिक', 'अर्ध वार्षिक'];

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
                private nepaliNumber: NepaliNumberPipe,
                private clientTypeShort: ClientTypeShortFormPipe,
                private nepaliCurrencyFormatterPipe: NepaliCurrencyFormatterPipe) {
    }

    ngOnInit() {
        this.buildForm();
        this.parseAssignedLoanData();
        this.checkOfferLetter();
        // this.convertProposed();
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER);
            this.fillForm();
            this.convertProposed();
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            this.existingOfferLetter = true;
            this.offerLetterForm.patchValue(initialInfo);
            this.setRemarks(initialInfo.purpose);
            this.setMoreSecurity(initialInfo.moreSecurity);
            this.setOtherCovenants(initialInfo.covenant);
            this.setAcceptance(initialInfo.acceptance);
            this.setEventDefaul(initialInfo.eventDefault);
            this.setEventDefaul1(initialInfo.eventDefault1);
            this.setRepresentation(initialInfo.representation);
            this.setPrecedent(initialInfo.precedent);
            this.setSecrityData(initialInfo.security);
            this.setCrossSecurityData(initialInfo.crossSecurity);
            this.setVehicleData(initialInfo.vehicleSecurity);
            this.setShareData(initialInfo.shareSecurity);
            this.setGuarantor(initialInfo.personalGuarantee, 'personalGuarantee');
            this.setGuarantor(initialInfo.corporateGuarantee, 'corporateGuarantee');
            this.initialInfoPrint = initialInfo;
        }
        console.log('this.cadData.offerDocumentList', this.cadData.offerDocumentList);
    }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
        if (!ObjectUtil.isEmpty(this.nepaliData)) {
            this.offerLetterForm.patchValue({
                borrowerName: this.nepaliData.nepaliName,
            });
        }
    }

    buildForm() {
        this.offerLetterForm = this.formBuilder.group({
            signature1: [undefined],
            signatureDate: [undefined],
            refNo: [undefined],
            empoweredName: [undefined],
            signature2: [undefined],
            signature3: [undefined],
            designation2: [undefined],
            designation3: [undefined],
            name2: [undefined],
            name3: [undefined],
            address: [undefined],
            borrowerName: [undefined],
            branchName: [undefined],
            telephoneNumber: [undefined],
            faxNumber: [undefined],
            letterCM: [undefined],
            guarnateeCM: [undefined],
            accountName: [undefined],
            accountNo: [undefined],
            accountAmount: [undefined],
            nepaliAccountAmount: [undefined],
            accountAmountWord: [undefined],
            loanAmount: [undefined],
            nepaliLoanAmount: [undefined],
            loanAmountWord: [undefined],
            promiseAmount: [undefined],
            nepaliPromiseAmount: [undefined],
            promiseAmountWord: [undefined],
            ligLoan: [undefined],
            landLoanAmount: [undefined],
            loanBorrower: [undefined],
            consumptionAmount: [undefined],
            totalConsumptionAmount: [undefined],
            totalNepaliConsumptionAmount: [undefined],
            totalConsumptionAmountWord: [undefined],
            date1: [undefined],
            amount1: [undefined],
            date2: [undefined],
            date3: [undefined],
            date4: [undefined],
            date7: [undefined],
            amount7: [undefined],
            date8: [undefined],
            amount8: [undefined],
            date9: [undefined],
            date10: [undefined],
            date11: [undefined],
            date12: [undefined],

            patraDate: [undefined],
            date: [undefined],
            phoneNo: [undefined],
            attention: [undefined],
            swapFee: [true],
            otherSwapFeeChecked: [false],
            swapFeeOther: [undefined],
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
            moreSecurity: this.formBuilder.array([]),
            crossSecurity: this.formBuilder.array([]),
            reRegisterSecurity: this.formBuilder.array([]),
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
            fixedChecked: [true],
            collateralChecked: [false],
            reRegisterChecked: [false],
            peGuaranteeCheck: [true],
            coGuaranteeCheck: [false],
            currentAssetsNeeded: [true],
            creditFacilityNeeded: [true],
            guaranteeFacilityNeeded: [true],
            personalSecurityNeeded: [true],
            cashLienNeeded: [true],
            vehicleSecurityNeeded: [true],
            shareSecurityNeeded: [true],
            fixedAssetsNeeded: [true],
            branchCode: [undefined],
            personalGuarantee: this.formBuilder.array([]),
            corporateGuarantee: this.formBuilder.array([]),
            fixedRenewWithEnhance: [false],
            reRegisterEnhance: [false],
            fixedAssetsWord: [undefined],
            crossRenewWithEnhance: [false],
            crossCollateralWord: [undefined],
            reRegisterWord: [undefined],
            shareRenewWith: [false],
            shareWord: [undefined],
            currentAssetsRenew: [false],
            currentAssetsWord: [undefined],
            fixedHypoRenew: [false],
            fixedHypoWord: [undefined],
            karjaRenewChecked: [false],
            karjaWord: [undefined],
            creditLetterRenewChecked: [false],
            creditLetterWord: [undefined],
            shareOtherChecked: [false],
            shareOther: [undefined],
            reRegisterDate: [undefined],
            reRegisterAmount: [undefined],
            existingChecked: [false],
            registerMortgageOtherChecked: [false],
            registerMortgageOther: [undefined],
            crossCollateralOtherChecked: [false],
            crossCollateralOther: [undefined],
            reRegisterOtherChecked: [false],
            reRegisterOther: [undefined],
            vehicleSecurityOtherChecked: [false],
            vehicleSecurityOther: [undefined]
        });
    }

    submit() {
        this.spinner = true;
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

    close() {
        this.modalService.dismissAll();
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
            this.offerLetterForm.get(['purpose', i, 'nepaliRepaymentAmount']).patchValue(null);
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
            case 'repaymentNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'repaymentNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'otherRepayment']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentAmount']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentAmountWord']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentMonthly']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentRate']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentRate1']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentAmount1']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentAmount2']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'repaymentAmount3']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'repaymentNeeded']).patchValue(checked);
                }
                break;
            case 'inPercentage':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'inPercentage']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'administrationRate']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'adFeeOther']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'otherAdFeeChecked']).patchValue(false);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'inPercentage']).patchValue(checked);
                }
                break;
            case 'inAmount':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'inAmount']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'administrationAmount']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'adFeeOther']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'otherAdFeeChecked']).patchValue(false);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'inAmount']).patchValue(checked);
                }
                break;
            case 'otherAdFeeChecked':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'otherAdFeeChecked']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'administrationAmount']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'administrationRate']).patchValue(null);
                    this.offerLetterForm.get(['purpose', i, 'inAmount']).patchValue(false);
                    this.offerLetterForm.get(['purpose', i, 'inPercentage']).patchValue(false);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'otherAdFeeChecked']).patchValue(checked);
                }
                break;
            case 'facilityNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'facilityNeeded']).patchValue(checked);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'facilityNeeded']).patchValue(checked);
                }
                break;
            case 'otherLimitChecked':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'otherLimitChecked']).patchValue(checked);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'otherLimitChecked']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'otherLimit']).patchValue(null);
                }
                break;
            case 'interestNeeded':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'interestNeeded']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'rateMode']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'interestNeeded']).patchValue(checked);
                }
                break;
            case 'commissionOtherCheck':
                if (checked) {
                    this.offerLetterForm.get(['purpose', i, 'commissionOtherCheck']).patchValue(checked);
                    this.offerLetterForm.get(['purpose', i, 'commissionValue']).patchValue(null);
                } else {
                    this.offerLetterForm.get(['purpose', i, 'commissionOtherCheck']).patchValue(checked);
                }
                break;
        }
    }

    parseAssignedLoanData() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.cadData.assignedLoan.forEach((l, i) => {
                this.loanType.push(l.loanType);
                this.addPurpose(l);
            });
            const loanShortForm = this.clientTypeShort.transform(this.cadData.loanHolder.clientType);
            const branchCode = this.cadData.loanHolder.branch.branchCode.concat('-').concat(loanShortForm);
            this.offerLetterForm.get('branchCode').patchValue(branchCode);
            this.offerLetterForm.get('patraDate').patchValue(formatDate(new Date(), 'dd-MM-yyyy', 'en'));
            const refNumber = (this.cadData.id).toString().padStart(4, '0');
            this.offerLetterForm.get('refNo').patchValue(refNumber);
        }
    }

    addSecurity(securityType) {
        const security = this.offerLetterForm.get(securityType) as FormArray;
        security.push(
            this.formBuilder.group({
                ownerName: [undefined],
                district: [undefined],
                vdc: [undefined],
                wardNo: [undefined],
                plotNumber: [undefined],
                area: [undefined]
            })
        );
    }

    addShareSecurity() {
        const shSecurity = this.offerLetterForm.get('shareSecurity') as FormArray;
        shSecurity.push(
            this.formBuilder.group({
                shareHolderName: [undefined],
                companyName: [undefined],
                totalShareUnit: [undefined],
                shareType: [undefined],
            })
        );
    }

    addVehicleSecurity() {
        const vSecurity = this.offerLetterForm.get('vehicleSecurity') as FormArray;
        vSecurity.push(
            this.formBuilder.group({
                vehicleDetail: [undefined],
                engineNumber: [undefined],
                chassisNumber: [undefined],
                model: [undefined]
            })
        );
    }

    securityValueChange(value: any, i: number, securityType, formControlName) {
        switch (securityType) {
            case 'collateralSecurity':
                this.offerLetterForm.get(['security', i, formControlName]).patchValue(value);
                break;
            case 'shareSecurity':
                this.offerLetterForm.get(['shareSecurity', i, formControlName]).patchValue(value);
                break;
            case 'vehicleSecurity':
                this.offerLetterForm.get(['vehicleSecurity', i, formControlName]).patchValue(value);
                break;
            case 'crossCollateralSecurity':
                this.offerLetterForm.get(['crossSecurity', i, formControlName]).patchValue(value);
                break;
            case 'reRegisterSecurity':
                this.offerLetterForm.get(['reRegisterSecurity', i, formControlName]).patchValue(value);
                break;
        }
    }

    addPurpose(data) {
        const purposeData = this.offerLetterForm.get('purpose') as FormArray;
        purposeData.push(
            this.formBuilder.group({
                loan: [data.loan.name],
                loanTag: [data.loan.loanTag],
                loanLimitAmount: [data.proposal.proposedLimit],
                nepaliLoanLimitAmount: [undefined],
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
                commissionOtherCheck: [false],
                moratariumOtherCheck: [false],
                drawDownPeriodNeeded: [true],
                commissionNeeded: [true],
                repaymentNeeded: [true],
                maturityNeeded: [true],
                inAmount: [false],
                inPercentage: [true],
                tenureNeeded: [true],
                adNeeded: [true],
                // processingNeeded: [true],
                moratariumPeriodNeeded: [true],
                moratariumValue: [undefined],
                maturityValue: [undefined],
                commissionValue: [undefined],
                downPeriodValue: [undefined],
                moratariumMonth: [undefined],
                drawDownDate: [undefined],
                termMonth: [undefined],
                periodValue: [undefined],
                rate: [undefined],
                commissionFrequency: [undefined],
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
                nepaliRepaymentAmount: [undefined],
                repaymentAmount1: [undefined],
                repaymentAmount2: [undefined],
                repaymentAmount3: [undefined],
                repaymentAmountWord: [undefined],
                repaymentMonthly: [undefined],
                repaymentRate: [undefined],
                repaymentRate1: [undefined],
                administrationRate: [undefined],
                administrationAmount: [undefined],
                nepaliAdministrationAmount: [undefined],
                reviewRate: [undefined],
                reviewAmount: [undefined],
                otherRepayment: [undefined],
                otherInterestRate: [undefined],
                otherAdFeeChecked: [false],
                adFeeOther: [undefined],
                addRemark: this.formBuilder.array([]),
                facilityNeeded: [true],
                otherLimitChecked: [false],
                otherLimit: [undefined],
                interestNeeded: [undefined]
            })
        );
    }

    otherCheckedValue(event, formControlName, word) {
        if (event) {
            this.offerLetterForm.get(formControlName).patchValue(event);
        } else {
            this.offerLetterForm.get(formControlName).patchValue(event);
            this.offerLetterForm.get(word).patchValue(null);
        }
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
                    this.offerLetterForm.get('nepaliAccountAmount').patchValue(null);
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
                    this.offerLetterForm.get('nepaliLoanAmount').patchValue(null);
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
                    this.offerLetterForm.get('nepaliPromiseAmount').patchValue(null);
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
            case 'fixedChecked':
                if (event) {
                    this.offerLetterForm.get('fixedChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('fixedChecked').patchValue(false);
                }
                break;
            case 'collateralChecked':
                if (event) {
                    this.offerLetterForm.get('collateralChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('collateralChecked').patchValue(false);
                }
                break;
            case 'peGuaranteeCheck':
                if (event) {
                    this.offerLetterForm.get('peGuaranteeCheck').patchValue(event);
                    // this.offerLetterForm.get('coGuaranteeCheck').patchValue(false);
                } else {
                    this.offerLetterForm.get('peGuaranteeCheck').patchValue(false);
                }
                break;
            case 'coGuaranteeCheck':
                if (event) {
                    this.offerLetterForm.get('coGuaranteeCheck').patchValue(event);
                } else {
                    this.offerLetterForm.get('coGuaranteeCheck').patchValue(false);
                }
                break;
            case 'currentAssetsNeeded':
                if (event) {
                    this.offerLetterForm.get('currentAssetsNeeded').patchValue(event);
                } else {
                    this.offerLetterForm.get('currentAssetsNeeded').patchValue(false);
                }
                break;
            case 'personalSecurityNeeded':
                if (event) {
                    this.offerLetterForm.get('personalSecurityNeeded').patchValue(event);
                    this.offerLetterForm.get('personalLoanOther').patchValue(null);
                } else {
                    this.offerLetterForm.get('personalSecurityNeeded').patchValue(false);
                }
                break;
            case 'cashLienNeeded':
                if (event) {
                    this.offerLetterForm.get('cashLienNeeded').patchValue(event);
                    this.offerLetterForm.get('cashlienOther').patchValue(null);
                } else {
                    this.offerLetterForm.get('cashLienNeeded').patchValue(false);
                }
                break;
            case 'vehicleSecurityNeeded':
                if (event) {
                    this.offerLetterForm.get('vehicleSecurityNeeded').patchValue(event);
                } else {
                    this.offerLetterForm.get('vehicleSecurityNeeded').patchValue(false);
                }
                break;
            case 'shareSecurityNeeded':
                if (event) {
                    this.offerLetterForm.get('shareSecurityNeeded').patchValue(event);
                } else {
                    this.offerLetterForm.get('shareSecurityNeeded').patchValue(false);
                }
                break;
            case 'fixedAssetsNeeded':
                if (event) {
                    this.offerLetterForm.get('fixedAssetsNeeded').patchValue(event);
                } else {
                    this.offerLetterForm.get('fixedAssetsNeeded').patchValue(false);
                }
                break;
            case 'creditFacilityNeeded':
                if (event) {
                    this.offerLetterForm.get('creditFacilityNeeded').patchValue(event);
                } else {
                    this.offerLetterForm.get('creditFacilityNeeded').patchValue(false);
                }
                break;
            case 'guaranteeFacilityNeeded':
                if (event) {
                    this.offerLetterForm.get('guaranteeFacilityNeeded').patchValue(event);
                } else {
                    this.offerLetterForm.get('guaranteeFacilityNeeded').patchValue(false);
                }
                break;
            case 'reRegisterChecked':
                if (event) {
                    this.offerLetterForm.get('reRegisterChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('reRegisterChecked').patchValue(false);
                }
                break;
            case 'shareOtherChecked':
                if (event) {
                    this.offerLetterForm.get('shareOtherChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('shareOtherChecked').patchValue(false);
                    this.offerLetterForm.get('shareOther').patchValue(null);
                }
                break;
            case 'registerMortgageOtherChecked':
                if (event) {
                    this.offerLetterForm.get('registerMortgageOtherChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('registerMortgageOtherChecked').patchValue(false);
                    this.offerLetterForm.get('registerMortgageOther').patchValue(null);
                }
                break;
            case 'crossCollateralOtherChecked':
                if (event) {
                    this.offerLetterForm.get('crossCollateralOtherChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('crossCollateralOtherChecked').patchValue(false);
                    this.offerLetterForm.get('crossCollateralOther').patchValue(null);
                }
                break;
            case 'reRegisterOtherChecked':
                if (event) {
                    this.offerLetterForm.get('reRegisterOtherChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('reRegisterOtherChecked').patchValue(false);
                    this.offerLetterForm.get('reRegisterOther').patchValue(null);
                }
                break;
            case 'vehicleSecurityOtherChecked':
                if (event) {
                    this.offerLetterForm.get('vehicleSecurityOtherChecked').patchValue(event);
                } else {
                    this.offerLetterForm.get('vehicleSecurityOtherChecked').patchValue(false);
                    this.offerLetterForm.get('vehicleSecurityOther').patchValue(null);
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

    addRepresentation() {
        (this.offerLetterForm.get('representation') as FormArray).push(
            this.formBuilder.group({
                otherRepresentation: [undefined]
            })
        );
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
            const word = this.nepaliCurrencyWordPipe.transform(d.loanLimitAmount);
            const nepaliFormat = this.engToNepNumberPipe.transform(this.nepaliCurrencyFormatterPipe.transform(d.loanLimitAmount));
            this.offerLetterForm.get(['purpose', i, 'loanLimitAmount']).patchValue(d.loanLimitAmount);
            this.offerLetterForm.get(['purpose', i, 'nepaliLoanLimitAmount']).patchValue(nepaliFormat);
            this.offerLetterForm.get(['purpose', i, 'loanLimitWord']).patchValue(word);
        });
    }

    removeSecurity(ii: number, securityType) {
        (<FormArray>this.offerLetterForm.get(securityType)).removeAt(ii);
    }

    setSecrityData(data) {
        const dataArray = this.offerLetterForm.get('security') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    ownerName: [singleData.ownerName],
                    district: [singleData.district],
                    vdc: [singleData.vdc],
                    wardNo: [singleData.wardNo],
                    plotNumber: [singleData.plotNumber],
                    area: [singleData.area]
                }));
            });
        }
    }

    setVehicleData(data) {
        const dataArray = this.offerLetterForm.get('vehicleSecurity') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    vehicleDetail: [singleData.vehicleDetail],
                    engineNumber: [singleData.engineNumber],
                    chassisNumber: [singleData.chassisNumber],
                    model: [singleData.model]
                }));
            });
        }
    }

    setShareData(data) {
        const dataArray = this.offerLetterForm.get('shareSecurity') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    shareHolderName: [singleData.shareHolderName],
                    companyName: [singleData.companyName],
                    totalShareUnit: [singleData.totalShareUnit],
                    shareType: [singleData.shareType],
                }));
            });
        }
    }

    convertProposedAmount(value, i: number, arrayType) {
        const word = this.nepaliCurrencyWordPipe.transform(value);
        const nepaliFormat = this.engToNepNumberPipe.transform(this.nepaliCurrencyFormatterPipe.transform(value));
        switch (arrayType) {
            case 'purpose':
                this.offerLetterForm.get(['purpose', i, 'loanLimitAmount']).patchValue(value);
                this.offerLetterForm.get(['purpose', i, 'nepaliLoanLimitAmount']).patchValue(nepaliFormat);
                this.offerLetterForm.get(['purpose', i, 'loanLimitWord']).patchValue(word);
                break;
            case 'repaymentAmount' :
                this.offerLetterForm.get(['purpose', i, 'repaymentAmount']).patchValue(value);
                this.offerLetterForm.get(['purpose', i, 'nepaliRepaymentAmount']).patchValue(nepaliFormat);
                this.offerLetterForm.get(['purpose', i, 'repaymentAmountWord']).patchValue(word);
                break;
            case 'personalGuarantee' :
                this.offerLetterForm.get([arrayType, i, 'amount']).patchValue(value);
                this.offerLetterForm.get([arrayType, i, 'nepaliAmount']).patchValue(nepaliFormat);
                this.offerLetterForm.get([arrayType, i, 'amountInWord']).patchValue(word);
                break;
            case 'corporateGuarantee' :
                this.offerLetterForm.get([arrayType, i, 'amount']).patchValue(value);
                this.offerLetterForm.get([arrayType, i, 'nepaliAmount']).patchValue(nepaliFormat);
                this.offerLetterForm.get([arrayType, i, 'amountInWord']).patchValue(word);
                break;
            case 'administrationAmount':
                this.offerLetterForm.get(['purpose', i, 'administrationAmount']).patchValue(value);
                this.offerLetterForm.get(['purpose', i, 'nepaliAdministrationAmount']).patchValue(nepaliFormat);
                break;
        }
    }

    customerDetailChange(value: any, type) {
        this.offerLetterForm.get(type).patchValue(value);
    }

    convertAmount(value, type) {
        const nepaliFormat = this.engToNepNumberPipe.transform(this.nepaliCurrencyFormatterPipe.transform(value));
        const word = this.nepaliCurrencyWordPipe.transform(value);
        this.offerLetterForm.get(type).patchValue(value);
        switch (type) {
            case 'promiseAmount':
                this.offerLetterForm.get('promiseAmountWord').patchValue(word);
                this.offerLetterForm.get('nepaliPromiseAmount').patchValue(nepaliFormat);
                break;
            case 'totalConsumptionAmount':
                this.offerLetterForm.get('totalConsumptionAmountWord').patchValue(word);
                this.offerLetterForm.get('totalNepaliConsumptionAmount').patchValue(nepaliFormat);
                break;
            case 'accountAmount':
                const word2 = this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(value));
                this.offerLetterForm.get(type).patchValue(value);
                this.offerLetterForm.get('accountAmountWord').patchValue(word);
                this.offerLetterForm.get('nepaliAccountAmount').patchValue(nepaliFormat);
                break;
            case 'loanAmount':
                this.offerLetterForm.get('loanAmountWord').patchValue(word);
                this.offerLetterForm.get('nepaliLoanAmount').patchValue(nepaliFormat);
                break;
        }
    }

    addMoreSecurity() {
        (this.offerLetterForm.get('moreSecurity') as FormArray).push(
            this.formBuilder.group({
                otherSecurity: [undefined]
            })
        );
    }

    setMoreSecurity(data) {
        const dataArray = this.offerLetterForm.get('moreSecurity') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    otherSecurity: [singleData.otherSecurity]
                }));
            });
        }
    }

    addRemark(i: number) {
        const controls = this.offerLetterForm.get(['purpose' , i, 'addRemark']) as FormArray;
        controls.push(this.formBuilder.group({
            remark: [undefined]
        }));
    }

    removeRemarks(ix: number, i) {
        (<FormArray>this.offerLetterForm.get(['purpose', i, 'addRemark'])).removeAt(ix);
    }

    setRemarks(data) {
        data.forEach((d, index) => {
            const remark = this.offerLetterForm.get(['purpose', index, 'addRemark']) as FormArray;
            if (!ObjectUtil.isEmpty(d.addRemark)) {
                d.addRemark.forEach(r => {
                    remark.push(this.formBuilder.group({
                        remark: [r.remark],
                    }));
                });
            }
        });
    }

    remarkValueChange(value: any, ix: number, i: number) {
        const rem = this.offerLetterForm.get(['purpose', i, 'addRemark']) as FormArray;
        rem.at(ix).patchValue({
            remark: value
        });
    }

    setCrossSecurityData(data) {
        const dataArray = this.offerLetterForm.get('crossSecurity') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                dataArray.push(this.formBuilder.group({
                    ownerName: [singleData.ownerName],
                    district: [singleData.district],
                    vdc: [singleData.vdc],
                    wardNo: [singleData.wardNo],
                    plotNumber: [singleData.plotNumber],
                    area: [singleData.area]
                }));
            });
        }
    }

    addGuarantee(arrayType) {
        const guarantee = this.offerLetterForm.get(arrayType) as FormArray;
        guarantee.push(
            this.formBuilder.group({
                name: [undefined],
                amount: [undefined],
                nepaliAmount: [undefined],
                amountInWord: [undefined],
                date: [undefined],
                other: [undefined],
                otherChecked: [false],
                renewWithChecked: [false],
                renewWithWord: [undefined]
            })
        );
    }

    private setGuarantor(data, guaranteeType) {
        const g = this.offerLetterForm.get(guaranteeType) as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(d => {
                g.push(
                    this.formBuilder.group({
                        name: [d.name],
                        amount: [d.amount],
                        nepaliAmount: [d.nepaliAmount],
                        amountInWord: [d.amountInWord],
                        date: [d.date],
                        other: [d.other],
                        otherChecked: [d.otherChecked],
                        renewWithChecked: [d.renewWithChecked],
                        renewWithWord: [d.renewWithWord]
                    })
                );
            });
        }
    }

    guarantorValueChange(value: any, i: number, guarantorType, formControlName) {
        this.offerLetterForm.get([guarantorType, i, formControlName]).patchValue(value);
    }

    guarantorValueCheck(checked: any, i: number, formControlName: string, gtype: string) {
        switch (formControlName) {
            case 'otherChecked':
                if (checked) {
                    this.offerLetterForm.get([gtype, i, formControlName]).patchValue(checked);
                } else {
                    this.offerLetterForm.get([gtype, i, formControlName]).patchValue(checked);
                    this.offerLetterForm.get([gtype, i, 'name']).patchValue(null);
                    this.offerLetterForm.get([gtype, i, 'amount']).patchValue(null);
                }
                break;
            case 'renewWithChecked':
                if (checked) {
                    this.offerLetterForm.get([gtype, i, formControlName]).patchValue(checked);
                } else {
                    this.offerLetterForm.get([gtype, i, formControlName]).patchValue(checked);
                    this.offerLetterForm.get([gtype, i, 'renewWithWord']).patchValue(null);
                }
                break;
        }
    }

    wordChange(value: any, formControl: string) {
        this.offerLetterForm.get(formControl).patchValue(value);
    }
}
