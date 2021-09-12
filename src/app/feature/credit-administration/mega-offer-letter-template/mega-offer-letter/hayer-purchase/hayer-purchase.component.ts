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
    ckeConfig = NepaliEditor.CK_CONFIG;
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
            this.setLoanConfigData(this.loanHolderInfo);
        }
    }

    buildForm() {
        this.hayarPurchase = this.formBuilder.group({
            dateOfGeneration: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            applicationDateInAd: [undefined],
            vehicleDescription: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            drawingPower: [undefined],
            baseRate: [undefined],
            preimumRate: [undefined],
            floatingRate: [undefined],
            serviceCharge: [undefined],
            serviceChargeWords: [undefined],
            communicationFee: [undefined],
            emiAmount: [undefined],
            emiAmountWords: [undefined],
            numberOfEmi: [undefined],
            loanCommitmentFee: [undefined],
            ownersName: [undefined],
            ownersProperty: [undefined],
            propertyPlotNumber: [undefined],
            propertyArea: [undefined],
            branchName: [undefined],
            dealerName: [undefined],
            lateFee: [undefined],
            changeFeeBelow1Cr: [undefined],
            changeFeeAbove1Cr: [undefined],
            CollateralReleaseFee: [undefined],
            documentAccessFee: [undefined],
            promissoryNoteAmount: [undefined],
            loanDeedAmount: [undefined],
            pledgeAmount: [undefined],
            guaranteeAmount: [undefined],
            signatureDate: [undefined],

            // hayarPurchaseLoanArray: this.formBuilder.array([this.buildHayarPurchaseArrayForm()]),
            // riskCoverageArray: this.formBuilder.array([this.buildRiskCoverageArrayForm()]),
        });
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

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.hayarPurchase.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.hayarPurchase.get(wordLabel).patchValue(returnVal);
    }

    setLoanConfigData(data) {
        console.log(data);
        const customerAddress =
            data.permanentMunicipality + ' j8f g ' +
            data.permanentWard + ' , ' +
            ' k|b]z ' + data.permanentProvince + ',' +
            data.permanentDistrict;

        this.hayarPurchase.patchValue({
            customerName: data.name ? data.name : '',
            customerAddress: customerAddress ? customerAddress : '',
        });
    }
}




