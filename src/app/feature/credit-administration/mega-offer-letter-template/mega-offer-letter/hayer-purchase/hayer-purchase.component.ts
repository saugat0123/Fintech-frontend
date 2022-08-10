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
    hayarPurchase: FormGroup;
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    hayerPurchaseLetter: OfferDocument;
    isPresentPrevious = false;
    ckeConfig = NepaliEditor.CK_CONFIG;
    note = '<ul><li><span style="font-family:Preeti">C0fL tyf JolQmutsf] ;DklQ v\'nfpg] lnvt -</span><span>Net Worth Statement<span style="font-family:Preeti">_ kmf]6f] tyf ;Dks{ 7]ufgf ;lxt k]z ug\'kg]{5 .</span></li>' +
        '<li><span style="font-family:Preeti">tcGo a}+sx?;+u u/]sf] sf/f]jf/ af/] lnlvt ?kdf v\'nfpg\'kg]{ -</span><span>Multiple Banking Declaration<span style="font-family:Preeti">_ k]z ug\'{kg]{5 .</span></li> ' +
        '<li><span style="font-family:Preeti">tpNn]lvt k|:tfljt crn ;DklQsf] k"0f{ d\'Nofªsg k|ltj]bg -</span><span>Complete Valuation Report<span style="font-family:Preeti">_ k]z ePkZrft dfq shf{ e\'Qmfg ul/g]5 .</span></li> </ul>';

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
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
    }

    buildForm() {
        this.hayarPurchase = this.formBuilder.group({
            refNo: [undefined],
            name: [undefined],
            borrowerAddress: [undefined],
            contactNumber: [undefined],

            guarantor: [undefined],
            guarantorFlag: [true],
            addedPercentage: [undefined],
            identityCardNo1: [undefined],
            identityCardNo2: [undefined],
            date: [undefined],
            pageCount: [undefined],
            clausesTextEditor: this.note,
            expiryDateTimeDuration: [undefined],
            timeDuration: [undefined],
            sadhanDhani: [undefined],

            hayarPurchaseLoanArray: this.formBuilder.array([this.buildHayarPurchaseArrayForm()]),
            riskCoverageArray: this.formBuilder.array([this.buildRiskCoverageArrayForm()]),
        });
    }

    buildHayarPurchaseArrayForm() {
        return this.formBuilder.group({
            amount: [undefined],
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
    changeToNepAmount(event: any, i , formArrayName) {
        this.hayarPurchase.get([formArrayName, i, 'amountInWord']).patchValue(event.nepVal);
        this.hayarPurchase.get([formArrayName, i, 'amount']).patchValue(event.val);
    }
    changeToEmiAmount(event: any, i , formArrayName) {
        this.hayarPurchase.get([formArrayName, i, 'emiAmountInWord']).patchValue(event.nepVal);
        this.hayarPurchase.get([formArrayName, i, 'emiAmount']).patchValue(event.val);
    }
    patchFunction(formArrayName, i, formControlName) {
            return this.hayarPurchase.get([formArrayName, i, formControlName]).value;
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
}




