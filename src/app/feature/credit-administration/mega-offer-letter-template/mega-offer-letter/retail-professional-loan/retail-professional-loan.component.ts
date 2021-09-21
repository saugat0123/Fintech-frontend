import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {Router} from '@angular/router';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';

@Component({
    selector: 'app-retail-professional-loan',
    templateUrl: './retail-professional-loan.component.html',
    styleUrls: ['./retail-professional-loan.component.scss']
})
export class RetailProfessionalLoanComponent implements OnInit {
    retailProfessionalLoan: FormGroup;
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    offerLetterConst = MegaOfferLetterConst;
    offerLetterDocument: OfferDocument;
    selectedArray = [];
    ckeConfig = NepaliEditor.CK_CONFIG;
    nepData;
    loanHolderInfo;
    proTermLoanSelected = false;
    afterSave = false;
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() selectedCountry;
    @Input() selectedSecurity;
    @Input() nameOfEmbassy;
    @Input() translatedValue;
    @Input() loanLimit;
    @Output() newSavedVal = new EventEmitter();
    constructor(private formBuilder: FormBuilder,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService,
                private router: Router,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
        this.checkOfferLetterData();
    }

    buildForm() {
        this.retailProfessionalLoan = this.formBuilder.group({
            dateOfApproval: [undefined],
            referenceNumber: [undefined],
            nameOfCustomer: [undefined],
            addressOfCustomer: [undefined],
            dateOfApplication: [undefined],
            purposeOfLoan: [undefined],
            loanAmountFigure: [undefined],
            amountInWords: [undefined],
            fixedDepositReceiptAmountFigure: [undefined],
            fixedDepositReceiptAmountWords: [undefined],
            fixedDepositAmountNumber: [undefined],
            distressValue: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            loanAdminFeeFigure: [undefined],
            loanAdminFeeWords: [undefined],
            emiAmountFigure: [undefined],
            emiAmountWords: [undefined],
            loanPeriodInMonths: [undefined],
            moratoriumPeriodInMonths: [undefined],
            loanCommitmentFeeInPercentage: [undefined],
            fixedDepositHolderName: [undefined],
            fixedDepositAmountFigure: [undefined],
            tenureFixedDeposit: [undefined],
            tenureDepositReceiptNumber: [undefined],
            guarantorName: [undefined],
            guaranteedAmountFigure: [undefined],
            guaranteedAmountWords: [undefined],
            nameOfBranch: [undefined],
            nameOfFixedDeposit: [undefined],
            pledgeAmountFigure: [undefined],
            insuranceAmountFigure: [undefined],
            relationshipOfficerName: [undefined],
            branchManager: [undefined],
            sakhshiDistrict: [undefined],
            sakhshiMunicipality: [undefined],
            sakhshiWardNo: [undefined],
            sakhshiName: [undefined],
            approvalStaffName: [undefined],
            ownersName: [undefined],
            district: [undefined],
            municipality: [undefined],
            wardNo: [undefined],
            seatNo: [undefined],
            kittaNo: [undefined],
            landArea: [undefined],
            promissoryNoteAmount: [undefined],
            loanDeedAmount: [undefined]
        });
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.retailProfessionalLoan.patchValue(initialInfo, {emitEvent: false});
                this.selectedArray = initialInfo.loanTypeSelectedArray;
                this.initialInfoPrint = initialInfo;
            }
        } else {
            this.fillForm(this.translatedValue);
        }
    }

submit(): void {
        console.log('Check Value', this.retailProfessionalLoan.value);
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.RETAIL_PROFESSIONAL_LOAN);
            offerDocument.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.afterSave = true;
            this.newSavedVal.emit(this.afterSave);
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.afterSave = false;
            this.newSavedVal.emit(this.afterSave);
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }

    fillForm(data) {
        if (!ObjectUtil.isEmpty(data)) {
            this.retailProfessionalLoan.patchValue(data);
        }
        let cadNepData = {
            numberNepali: ')',
            nepaliWords: 'सुन्य',
        };
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
            cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
        }
        const customerAddress = this.loanHolderInfo.permanentMunicipality + ' ' +
            this.loanHolderInfo.permanentWard + ', ' + this.loanHolderInfo.permanentDistrict;
        this.retailProfessionalLoan.patchValue({
            nameOfCustomer: this.loanHolderInfo.name ? this.loanHolderInfo.name : '',
            addressOfCustomer: customerAddress ? customerAddress : '',
            loanAmountFigure: cadNepData.numberNepali,
            amountInWords: cadNepData.nepaliWords,
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.retailProfessionalLoan.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.retailProfessionalLoan.get(wordLabel).patchValue(returnVal);
    }

    calculateData(baseRateName, premiumRateName) {
        const baseRate = this.nepToEngNumberPipe.transform(this.retailProfessionalLoan.get(baseRateName).value);
        const premiumRate = this.nepToEngNumberPipe.transform(this.retailProfessionalLoan.get(premiumRateName).value);
        const calculatedValue = parseFloat(baseRate) + parseFloat(premiumRate);
        const finalVal = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(calculatedValue));
        this.retailProfessionalLoan.get('interestRate').patchValue(finalVal);
    }
}
