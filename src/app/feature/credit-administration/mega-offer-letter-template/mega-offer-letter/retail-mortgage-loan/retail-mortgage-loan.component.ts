import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {ToastService} from '../../../../../@core/utils';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';

@Component({
    selector: 'app-retail-mortgage-loan',
    templateUrl: './retail-mortgage-loan.component.html',
    styleUrls: ['./retail-mortgage-loan.component.scss']
})
export class RetailMortgageLoanComponent implements OnInit {
    form: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    nepaliNumber = new NepaliNumberAndWords();
    nepaliAmount = [];
    finalNepaliWord = [];
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;

    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

   loanHolderInfo;
    external = [];
    nepData;


    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepPercentWordPipe: NepaliPercentWordPipe
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
        this.checkOfferLetterData();    }

    buildForm() {
        this.form = this.formBuilder.group({
            dateOfGeneration: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            applicationDate: [undefined],
            loanAmount: [undefined],
            loanNameInWord: [undefined],
            drawingPowerRate: [undefined],
            signatureDate : [undefined],
            district: [undefined],
            witnessName: [undefined],
            wardNum: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            staffName: [undefined],
            floatingRate: [undefined],
            serviceCharge: [undefined],
            serviceChargeWords: [undefined],
            communicationFees: [undefined],
            emiAmount: [undefined],
            emiAmountInWords: [undefined],
            numberOfEMI: [undefined],
            firstEMIMonth: [undefined],
            loanCommitmentFee: [undefined],
            yearlyLoanRate: [undefined],
            ownerName: [undefined],
            ownersAddress: [undefined],
            loanAmountWords: [undefined],
            branchName: [undefined],
            propertyPlotNumber: [undefined],
            secondDisbursementAmountWords: [undefined],
            firstConstructionCompletionAmount: [undefined],
            firstDisbursementAmountWords: [undefined],
            secondDisbursementAmount: [undefined],
            firstDisbursementAmount: [undefined],
            secondConstructionCompletionAmount: [undefined],
            thirdConstructionCompletionAmount: [undefined],
            thirdDisbursementAmount : [undefined],
            thirdDisbursementAmountWords: [undefined],
            changeFeeBelow1Cr: [undefined],
            LateFee : [undefined],
            changeFeeAbove1Cr: [undefined],
            collateralReleaseFee: [undefined],
            pledgeAmount : [undefined],
            documentAccessFee: [undefined],
            promissoryNoteAmount: [undefined],
            sheetNumber  : [undefined],
            propertyArea: [undefined],
            loanDeedAmount: [undefined],
            insuranceAmount: [undefined],
            insuranceAmountWords: [undefined],
            guarantorName1: [undefined],
            guarantorAmount1: [undefined],
            guarantorAmountWords1: [undefined],
            security: this.formBuilder.array([])
        });
    }
    setLoanConfigData(data) {
        let cadNepData = {
            numberNepali: ')',
            nepaliWords: 'सुन्य',
        };
        const customerAddress =
            data.permanentMunicipality + ' , ' +
            data.permanentWard + ' , ' +
            data.permanentProvince + ' , ' +
            data.permanentDistrict;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
            cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
        }
        this.form.patchValue({
            customerName: data.name ? data.name : '',
            customerAddress: customerAddress ? customerAddress : '',
            loanAmount: cadNepData.numberNepali,
            loanNameInWords: cadNepData.nepaliWords,
        });
    }
    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.form.patchValue(initialInfo, {emitEvent: false});
                this.initialInfoPrint = initialInfo;
            }
        } else {
            if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
                this.setLoanConfigData(this.loanHolderInfo);
            }
        }

    }


    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_MORTGAGE_LOAN);
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

    getNumAmountWord(numLabel, wordLabel) {
        console.log('Number label', numLabel);
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        console.log('dfghjk', wordLabel);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    calcYearlyRate() {
        const baseRate = this.nepToEngNumberPipe.transform(this.form.get('baseRate').value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.form.get('premiumRate').value);
        const addRate = parseFloat(baseRate) + parseFloat(premiumRate);
        const asd = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
        this.form.get('yearlyLoanRate').patchValue(asd);
    }
}
