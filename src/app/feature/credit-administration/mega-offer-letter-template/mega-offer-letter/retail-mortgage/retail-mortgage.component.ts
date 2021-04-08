import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliCurrencyWordPipe} from "../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../@core/pipe/currency-formatter.pipe";
import {NepaliToEngNumberPipe} from "../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliPercentWordPipe} from "../../../../../@core/pipe/nepali-percent-word.pipe";

@Component({
    selector: 'app-retail-mortgage',
    templateUrl: './retail-mortgage.component.html',
    styleUrls: ['./retail-mortgage.component.scss']
})
export class RetailMortgageComponent implements OnInit {
    form: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    nepaliNumber = new NepaliNumberAndWords();
    nepaliAmount = [];
    finalNepaliWord = [];
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

    nepData;
    external = [];
    loanHolderInfo;
    percentTotal;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private router: Router,
        private administrationService: CreditAdministrationService,
        protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
        private routerUtilsService: RouterUtilsService,
        private engToNepNumberPipe: EngToNepaliNumberPipe,
        private currencyFormatPipe: CurrencyFormatterPipe,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepPercentWordPipe: NepaliPercentWordPipe
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.checkOfferLetterData();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            referenceNo: [undefined],
            name: [undefined],
            date: [undefined],
            permanentAddress: [undefined],
            currentAddress: [undefined],
            mobileNo: [undefined],
            mortgageOverdraft: this.formBuilder.array([]),
            maxTimeLimit: [undefined],
            loanLimit: [undefined],
            loanLimitInWords: [undefined],
            timeLimit: [undefined],
            yearlyRate: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            maxPayment: [undefined],
            fullPaymentFeeBeforeOneYear: [undefined],
            fullPaymentFeeAfterOneYear: [undefined],
            fullPaymentFeeForTransfer: [undefined],
            usedApprovedOverdraft: [undefined],
            assuranceFee: [undefined],
            assuranceFeeInWords: [undefined],
            serviceCharge: [undefined],
            serviceChargeInWords: [undefined],
            kaSuKCharge: [undefined],
            kittaAddress: [undefined],
            kittaNumber: [undefined],
            kittaArea: [undefined],
            spouseName: [undefined],
            overdueInterest: [undefined],
            adhikrit1: [undefined],
            adhikrit2: [undefined],
        });
    }

    checkOfferLetterData() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_OVERDRAFT).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.addEmptyMortgageOverdraft();
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_OVERDRAFT);
        } else {
            const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
            console.log(initialInfo);
            this.initialInfoPrint = initialInfo;
            console.log(this.offerLetterDocument);
            this.existingOfferLetter = true;
            this.form.patchValue(initialInfo, {emitEvent: false});
            if (!ObjectUtil.isEmpty(initialInfo)) {
                this.setMortgageOverdraft(initialInfo.mortgageOverdraft);
            }
            this.initialInfoPrint = initialInfo;
        }
    }


    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_OVERDRAFT).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_OVERDRAFT);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
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


    addEmptyMortgageOverdraft() {
        const formArray = this.form.get('mortgageOverdraft') as FormArray;
        formArray.push(this.formBuilder.group({

            referenceNo: undefined,
            name: undefined,
            date: undefined,
            permanentAddress: undefined,
            currentAddress: undefined,
            mobileNo: undefined,
            mortgageOverdraft: this.formBuilder.array([]),
            maxTimeLimit: undefined,
            loanLimit: undefined,
            loanLimitInWords: undefined,
            timeLimit: undefined,
            yearlyRate: undefined,
            baseRate: undefined,
            premiumRate: undefined,
            maxPayment: undefined,
            fullPaymentFeeBeforeOneYear: undefined,
            fullPaymentFeeAfterOneYear: undefined,
            fullPaymentFeeForTransfer: undefined,
            usedApprovedOverdraft: undefined,
            assuranceFee: undefined,
            assuranceFeeInWords: undefined,
            serviceCharge: undefined,
            serviceChargeInWords: undefined,
            kaSuKCharge: undefined,
            kittaAddress: undefined,
            kittaNumber: undefined,
            kittaArea: undefined,
            spouseName: undefined,
            overdueInterest: undefined,
            adhikrit1: undefined,
            adhikrit2: undefined,
        }));
    }

    setMortgageOverdraft(data) {
        const formArray = this.form.get('mortgageOverdraft') as FormArray;
        if (ObjectUtil.isEmpty(data)) {
            this.addEmptyMortgageOverdraft();
            return;
        }
        data.forEach(value => {
            formArray.push(this.formBuilder.group({
                referenceNo: [value.referenceNo],
                name: [value.name],
                date: [value.date],
                permanentAddress: [value.permanentAddress],
                currentAddress: [value.currentAddress],
                mobileNo: [value.mobileNo],
                mortgageOverdraft: this.formBuilder.array([]),
                maxTimeLimit: [value.maxTimeLimit],
                loanLimit: [value.loanLimit],
                loanLimitInWords: [value.loanLimitInWords],
                timeLimit: [value.timeLimit],
                yearlyRate: [value.yearlyRate],
                baseRate: [value.baseRate],
                premiumRate: [value.premiumRate],
                maxPayment: [value.maxPayment],
                fullPaymentFeeBeforeOneYear: [value.fullPaymentFeeBeforeOneYear],
                fullPaymentFeeAfterOneYear: [value.fullPaymentFeeAfterOneYear],
                fullPaymentFeeForTransfer: [value.fullPaymentFeeForTransfer],
                usedApprovedOverdraft: [value.usedApprovedOverdraft],
                assuranceFee: [value.assuranceFee],
                assuranceFeeInWords: [value.assuranceFeeInWords],
                serviceCharge: [value.serviceCharge],
                serviceChargeInWords: [value.serviceChargeInWords],
                kaSuKCharge: [value.kaSuKCharge],
                kittaAddress: [value.kittaAddress],
                kittaNumber: [value.kittaNumber],
                kittaArea: [value.kittaArea],
                spouseName: [value.spouseName],
                overdueInterest: [value.overdueInterest],
                adhikrit1: [value.adhikrit1],
                adhikrit2: [value.adhikrit2],
            }));
        });
    }

    removeMortgageOverdraft(index) {
        (this.form.get('mortgageOverdraft') as FormArray).removeAt(index);
    }

    changeToNepAmount(event: any, i, formArrayName) {
        this.form.get([formArrayName, i, 'loanLimitInWords']).patchValue(event.nepVal);
        this.form.get([formArrayName, i, 'loanLimit']).patchValue(event.val);
    }

    patchFunction(formArrayName, i, formControlName) {
        const patchValue1 = this.form.get([formArrayName, i, formControlName]).value;
        return patchValue1;
    }

    calcYearlyRate(formArrayName, i) {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get([formArrayName, i, 'baseRate']).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get([formArrayName, i, 'premiumRate']).value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
        const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get([formArrayName, i, 'yearlyRate']).patchValue(asd);
    }

    calcpercent(formArrayName, i) {
        const serviceCharge = this.nepToEngNumberPipe.transform(this.form.get([formArrayName, i, 'serviceCharge']).value);
        const returnVal = this.nepPercentWordPipe.transform(serviceCharge);
        this.form.get([formArrayName, i, 'serviceChargeInWords']).patchValue(returnVal);
    }

    calcAssurance(formArrayName, i) {
        const assuranceFee = this.nepToEngNumberPipe.transform(this.form.get([formArrayName, i, 'assuranceFee']).value);
        const returnVal = this.nepPercentWordPipe.transform(assuranceFee);
        this.form.get([formArrayName, i, 'assuranceFeeInWords']).patchValue(returnVal);
    }

}