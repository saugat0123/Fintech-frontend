import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';

@Component({
    selector: 'app-hayer-purchase',
    templateUrl: './hayer-purchase.component.html',
    styleUrls: ['./hayer-purchase.component.scss']
})
export class HayerPurchaseComponent implements OnInit {
    // todo replace enum constant string compare
    selectedLoanArray = [];
    hayarPurchase: FormGroup;
    spinner = false;
    existingOfferLetter = false;
    autoLoan = false;
    hirePurchase = false;
    heavyEquipment = false;
    isForEdit = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    hayerPurchaseLetter: OfferDocument;
    isPresentPrevious = false;
    ckeConfig = NepaliEditor.CK_CONFIG;
    note = '<ul><li><span style="font-family:Preeti">C0fL tyf JolQmutsf] ;DklQ v\'nfpg] lnvt -</span><span>Net Worth Statement<span style="font-family:Preeti">_ kmf]6f] tyf ;Dks{ 7]ufgf ;lxt k]z ug\'kg]{5 .</span></li>' +
        '<li><span style="font-family:Preeti">tcGo a}+sx?;+u u/]sf] sf/f]jf/ af/] lnlvt ?kdf v\'nfpg\'kg]{ -</span><span>Multiple Banking Declaration<span style="font-family:Preeti">_ k]z ug\'{kg]{5 .</span></li> ' +
        '<li><span style="font-family:Preeti">tpNn]lvt k|:tfljt crn ;DklQsf] k"0f{ d\'Nofªsg k|ltj]bg -</span><span>Complete Valuation Report<span style="font-family:Preeti">_ k]z ePkZrft dfq shf{ e\'Qmfg ul/g]5 .</span></li> </ul>';

    loanTypes = [
        {key: 'AutoLoan', value: 'सवारी साधन कर्जा (Auto Loan)'},
        {key: 'HirePurchase', value: 'हायर पर्चेज कर्जा (Hire Purchase)'},
        {key: 'HeavyEquipment', value: 'हेभी इक्यूपमेन्ट कर्जा (Heavy Equipment)'},
    ];
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    loanHolderInfo;


    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private router: Router,
                private routerUtilsService: RouterUtilsService,
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
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.isForEdit = true;
            if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder.nepData)) {
                this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
                if (this.isForEdit) {
                    this.fillForm ();
                }
            }
        }
    }

    buildForm() {
        this.hayarPurchase = this.formBuilder.group({
            refNo: [undefined],
            addressedPerson: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipality: [undefined],
            permanentWard: [undefined],
            currentProvience: [undefined],
            currentMunicipality: [undefined],
            currentWard: [undefined],
            currentDistrict: [undefined],
            currentTole: [undefined],
            currentHouseNumber: [undefined],
            currentStreet: [undefined],
            postBoxNumber: [undefined],
            sanctionedLimitInWords: [undefined],
            bankPostBoxNumber: [undefined],
            sanctionedLimit: [undefined],
            units: [undefined],
            branchOffice: [undefined],
            debtor: [undefined],
            vehicleModal: [undefined],
            debtorPermanentDistrict: [undefined],
            hirePurchaseAndLoanDeedAmount: [undefined],
            debtorCurrentHouseNumber: [undefined],
            debtorCurrentStreet: [undefined],
            debtorContactNumber: [undefined],
            debtorPostBoxNumber: [undefined],
            leftInputField1: [undefined],
            leftInputField2: [undefined],
            leftInputField3: [undefined],
            rightInputField1: [undefined],
            rightInputField2: [undefined],
            rightInputField3: [undefined],
            loanSanctionedDate: [undefined],
            witness1: [undefined],
            witness2: [undefined],
            email: [undefined],
            debtorCurrentTole: [undefined],
            debtorPermanentMunicipality: [undefined],
            debtorPermanentWard: [undefined],
            debtorPermanentWard2: [undefined],
            debtorCurrentProvienceNumber: [undefined],
            debtorCurrentWard: [undefined],
            debtorCurrentDistrict: [undefined],
            debtorCurrentMunicipality: [undefined],
            hirePurchaseAndLoanDeedAmountinWords: [undefined],
            personalGuaranteer1: [undefined],
            personalGuaranteer2: [undefined],
            insuranceTypeInNepali: [undefined],
            insuranceTypeInEnglish: [undefined],
            vatPercent: [undefined],
            input: [undefined],
            vehicleName: [undefined],
            vehicleUnits: [undefined],
            EMIAmount: [undefined],
            loanTenure: [undefined],
            equiPrincipalInterestEMIAmount: [undefined],
            administrationFeeRate: [undefined],
            averageBaseRate: [undefined],
            nthQuaterly: [undefined],
            fiscalYear: [undefined],
            premiumRate: [undefined],
            expectedEMIAmount: [undefined],
            expectedEMIAmountInWords: [undefined],
            drawdown: [undefined],
            name: [undefined],
            year: [undefined],
            month: [undefined],
            date1: [undefined],
            day: [undefined],
            guarantorName: [undefined],
            guarantorPermanentDistrict: [undefined],
            guarantorPermanentMunicipality: [undefined],
            guarantorPermanentWard1: [undefined],
            guarantorPermanentWard2: [undefined],
            guarantorCurrentProvience: [undefined],
            guarantorCurrentDistrict: [undefined],
            guarantorCurrentMunicipality: [undefined],
            guarantorCurrentWard: [undefined],
            guarantorContactNumber: [undefined],
            guaranteedYear: [undefined],
            guarantorEmail: [undefined],
            guaranteedMonth: [undefined],
            guaranteedDate: [undefined],
            borrowerAddress: [undefined],
            contactNumber: [undefined],
            guarantor: [undefined],
            guarantorFlag: [true],
            addedPercentage: [undefined],
            identityCardNo1: [undefined],
            identityCardNo2: [undefined],
            date: [undefined],
            autoLoan: this.formBuilder.array([]),
            pageCount: [undefined],
            clausesTextEditor: this.note,
            expiryDateTimeDuration: [undefined],
            timeDuration: [undefined],
            sadhanDhani: [undefined],
            promissoryNotes: [undefined],
            checkBoxFreeText: [undefined],
            buttonFreeText: [undefined],
            moreSecurityClause: [undefined],
            tableData: this.formBuilder.array([]),

            hayarPurchaseLoanArray: this.formBuilder.array([this.buildHayarPurchaseArrayForm()]),
            riskCoverageArray: this.formBuilder.array([this.buildRiskCoverageArrayForm()]),
        });
    }
    fillForm() {
        this.hayarPurchase.patchValue({
            refNo: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.miscellaneousDetail) ? this.loanHolderInfo.miscellaneousDetail.offerReferenceNo : ''],
            date: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.miscellaneousDetail) ? this.loanHolderInfo.miscellaneousDetail.offerIssueDate : ''],
            addressedPerson: [!ObjectUtil.isEmpty(this.loanHolderInfo.nepaliName) ? this.loanHolderInfo.nepaliName : ''],
            permanentDistrict: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.customerPermanentAddress) ? this.loanHolderInfo.customerPermanentAddress.district : ''],
            permanentMunicipality: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.customerPermanentAddress) ? this.loanHolderInfo.customerPermanentAddress.municipality : ''],
            permanentWard: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.customerPermanentAddress) ? this.loanHolderInfo.customerPermanentAddress.wardNo : ''],
            currentDistrict: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.customerTemporaryAddress) ? this.loanHolderInfo.customerTemporaryAddress.district : ''],
            currentMunicipality: [!ObjectUtil.isEmpty
            (this.loanHolderInfo) ? this.loanHolderInfo.customerTemporaryAddress.municipality : ''],
            currentWard: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.customerTemporaryAddress) ? this.loanHolderInfo.customerTemporaryAddress.wardNo : ''],
            currentTole: [!ObjectUtil.isEmpty
            (this.loanHolderInfo.customerTemporaryAddress) ? this.loanHolderInfo.customerTemporaryAddress.tole : ''],
            contactNumber: [!ObjectUtil.isEmpty(this.loanHolderInfo.contactNo) ? this.loanHolderInfo.contactNo : ''],
        });
    }
    autoLoanFormGroup(): FormGroup {
        return this.formBuilder.group({
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
        });
    }

    addMoreAutoLoan() {
        (this.hayarPurchase.get('AutoLoan') as FormArray).push(this.autoLoanFormGroup());
    }

    removeAutoLoan(index: number) {
        (this.hayarPurchase.get('AutoLoan') as FormArray).removeAt(index);
    }

    buildHayarPurchaseArrayForm() {
        return this.formBuilder.group({
            amount: [undefined],
            sanctionedLimit: [undefined],
            amountInWord: [undefined],
            vehicle: [undefined],
            samaya: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            presentRate: [undefined],
            month: [undefined],
            totalMonth: [undefined],
            emiAmount: [undefined],
            emiAmountInWord: [undefined],
            vatPercent: [undefined],
            serviceAmount: [undefined],
            company: [undefined],
            servicePercentage: [undefined],
            servicePercentageWords: [undefined],
            charge: [undefined],
            chargeFlag: [true],
            loanClearanceMonthlyDate: [undefined],
            PurwaBhuktaniSulka: [undefined],
            PurwaBhuktaniSewaSulkaRate: [undefined],
            secureTransactionFees: [undefined]
        });
    }

    buildRiskCoverageArrayForm() {
        return this.formBuilder.group({
            sn: [undefined],
            details: [undefined],
            amount: [undefined],
            riskCoverage: [undefined],
        });
    }

    addMoreHirePurchaseLoan() {
        (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).push(this.buildHayarPurchaseArrayForm());
    }

    removeHirePurchaseLoan(i) {
        (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).removeAt(i);
    }

    addMoreRiskCoverageArray() {
        (this.hayarPurchase.get('riskCoverageArray') as FormArray).push(this.buildRiskCoverageArrayForm());
    }

    removeRiskCoverageArray(i) {
        (this.hayarPurchase.get('riskCoverageArray') as FormArray).removeAt(i);
    }

    removeOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(false);
    }

    undoRemovalOfOptionalField(formGroup, fieldControlName) {
        formGroup.get(fieldControlName).patchValue(true);
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.hayerPurchaseLetter = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
                value.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE).toString())[0];
            if (!ObjectUtil.isEmpty(this.hayerPurchaseLetter) && !ObjectUtil.isEmpty(this.hayerPurchaseLetter.id)) {
                const initialInfo = JSON.parse(this.hayerPurchaseLetter.initialInformation);
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.setTableData(initialInfo.tableData);
                this.hayarPurchase.patchValue(initialInfo, {emitEvent: false});

                (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).clear();
                initialInfo.hayarPurchaseLoanArray.forEach( value => {
                    (this.hayarPurchase.get('hayarPurchaseLoanArray') as FormArray).push(this.formBuilder.group(value));
                });
                (this.hayarPurchase.get('riskCoverageArray') as FormArray).clear();
                initialInfo.riskCoverageArray.forEach( value => {
                    (this.hayarPurchase.get('riskCoverageArray') as FormArray).push(this.formBuilder.group(value));
                });
                this.initialInfoPrint = initialInfo;
            } else {
                this.hayerPurchaseLetter = new OfferDocument();
                this.hayerPurchaseLetter.docName = this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE);
            }
        }
    }


    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.hayarPurchase.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE);
            offerDocument.initialInformation = JSON.stringify(this.hayarPurchase.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Hire Purchase Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Hire Purchase Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }


    chooseLoanType(selectedLoanTypeArray) {
        this.selectedLoanArray = selectedLoanTypeArray;
        this.autoLoan = this.hirePurchase = this.heavyEquipment = false;
        selectedLoanTypeArray.forEach(selectedValue => {
            switch (selectedValue) {
                case 'AutoLoan':
                    this.autoLoan = true;
                    break;
                case 'HirePurchase':
                    this.hirePurchase = true;
                    break;
                case 'HeavyEquipment':
                    this.heavyEquipment = true;
                    break;
            }
        });
    }
    changeToNepAmount(event: any, target, from) {
        this.hayarPurchase.get([target]).patchValue(event.nepVal);
        this.hayarPurchase.get([from]).patchValue(event.val);
    }
    /*changeToEmiAmount(event: any, i , formArrayName) {
        this.hayarPurchase.get([formArrayName, i, 'emiAmountInWord']).patchValue(event.nepVal);
        this.hayarPurchase.get([formArrayName, i, 'emiAmount']).patchValue(event.val);
    }*/
    patchFunction(target) {
        const patchValue1 = this.hayarPurchase.get([target]).value;
        return patchValue1;
    }
    calcPresentRate(formArrayName, i ) {
        const baseRate = this.nepToEngNumberPipe.transform(this.hayarPurchase.get([formArrayName, i , 'baseRate']).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.hayarPurchase.get([formArrayName, i , 'premiumRate']).value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
        const finalValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.hayarPurchase.get([formArrayName, i, 'presentRate']).patchValue(finalValue);
    }
    calcpercent(formArrayName, i ) {
        const serviceChargePercent =
            this.nepToEngNumberPipe.transform(this.hayarPurchase.get([formArrayName, i , 'servicePercentage']).value);
        const returnVal = this.nepPercentWordPipe.transform(serviceChargePercent);
        this.hayarPurchase.get([formArrayName, i, 'servicePercentageWords']).patchValue(returnVal);
    }

    onCheck(e) {
        if (e.target.checked) {
            this.hayarPurchase.get('checkBoxFreeText').patchValue(true);
        } else {
            this.hayarPurchase.get('checkBoxFreeText').patchValue(false);
        }
    }
    removeSecurityPoint(index: number) {
        (this.hayarPurchase.get('tableData') as FormArray).removeAt(index);
    }
    addSecurityPoint() {
        (this.hayarPurchase.get('tableData') as FormArray).push(
            this.formBuilder.group({
                additionalSecurityPoint: [undefined],
            })
        );
    }
    setTableData(details) {
        const multiCollateralDetails = this.hayarPurchase.get('tableData') as FormArray;
        details.forEach(data => {
            multiCollateralDetails.push(
                this.formBuilder.group({
                    additionalSecurityPoint: [data.additionalSecurityPoint],
                })
            );
        });
    }
}




