import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
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

@Component({
    selector: 'app-retail-educational-loan',
    templateUrl: './retail-educational-loan.component.html',
    styleUrls: ['./retail-educational-loan.component.scss']
})
export class RetailEducationalLoanComponent implements OnInit {
    form: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    nepData;
    external = [];
    loanHolderInfo;

    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private toastService: ToastService,
                private routerUtilService: RouterUtilsService,
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
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
        this.checkOfferLetterData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            dateofGeneration: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            applicationDateInAD: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            drawingPowerRate: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyFloatingInterestRate: [undefined],
            serviceCharge: [undefined],
            serviceChargeWords: [undefined],

            emiAmount: [undefined],
            emiAmountInWords: [undefined],
            numberOfEmi: [undefined],
            loanCommitmentFee: [undefined],

            ownersName: [undefined],
            ownersAddress: [undefined],
            propertyPlotNumber: [undefined],
            propertyArea: [undefined],
            sheetNumber: [undefined],

            branchName: [undefined],
            lateFee: [undefined],
            changeFeeBelow1Cr: [undefined],
            changeFeeAbove1Cr: [undefined],
            collateralReleaseFee: [undefined],
            documentAccessFee: [undefined],
            promissoryNoteAmount: [undefined],
            loanDeedAmount: [undefined],
            pledgeAmount: [undefined],
            guarantorName1: [undefined],
            guarantorAmount1: [undefined],
            guarantorAmountWords1: [undefined],
            signatureDate: [undefined],

            sakshiDistrict: [undefined],
            sakshiMunicipality: [undefined],
            sakshiWardNum: [undefined],

            sakshiName: [undefined],
            employeeName: [undefined]
        });
    }


    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL);
                this.fillForm();
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                console.log(initialInfo);
                this.initialInfoPrint = initialInfo;
                console.log(this.offerLetterDocument);
                this.existingOfferLetter = true;
                this.form.patchValue(initialInfo, {emitEvent: false});
                this.initialInfoPrint = initialInfo;
            }
        }
    }

    fillForm() {
        console.log('this.loanHolderInfo', this.cadOfferLetterApprovedDoc);
        let cadNepData = {
            numberNepali: ')',
            nepaliWords: 'सुन्य',
        };
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
            cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
        }
        const customerAddress = this.loanHolderInfo.permanentMunicipality + ' ' +
            this.loanHolderInfo.permanentWard + ', ' + this.loanHolderInfo.permanentDistrict;
        this.form.patchValue({
            customerName: this.loanHolderInfo.name ? this.loanHolderInfo.name : '',
            customerAddress: customerAddress ? customerAddress : '',
            loanAmount: cadNepData.numberNepali,
            loanAmountWords: cadNepData.nepaliWords,
        });
    }


    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL)
                    .toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_EDUCATIONAL);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Retail Educational Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save  Retail Educational Offer Letter'));
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

    calcYearlyRate(base, premium, target) {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get(base).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get(premium).value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
        const finalValue = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get(target).patchValue(finalValue);
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }
}
