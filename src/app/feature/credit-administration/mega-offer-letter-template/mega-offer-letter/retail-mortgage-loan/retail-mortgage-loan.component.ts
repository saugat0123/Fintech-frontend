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
import {NabilOfferLetterConst} from "../../../nabil-offer-letter-const";

@Component({
    selector: 'app-retail-mortgage-loan',
    templateUrl: './retail-mortgage-loan.component.html',
    styleUrls: ['./retail-mortgage-loan.component.scss']
})
export class RetailMortgageLoanComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() preview;
    form: FormGroup;
    // todo replace enum constant string compare
    spinner = false;
    existingOfferLetter = false;
    initialInfoPrint;
    nepaliNumber = new NepaliNumberAndWords();
    nepaliAmount = [];
    finalNepaliWord = [];
    offerLetterConst = NabilOfferLetterConst;
    offerLetterDocument: OfferDocument;
    guarantorData;
    offerLetterData;
    tempData;
    afterSave = false;
    selectedAutoLoan;
    selectedInterest;
    loanLimit;
    loanHolderInfo;
    external = [];
    nepData;
    selectedSecurity;
    offerDocumentDetails;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepPercentWordPipe: NepaliPercentWordPipe,
                private ref: NbDialogRef<RetailMortgageLoanComponent>
) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
            // tslint:disable-next-line:max-line-length
            this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
        }
        console.log('Selected Data:',this.cadOfferLetterApprovedDoc);
        console.log('All Data:',this.tempData);
        console.log('Loan Holder initial data:',this.loanHolderInfo);
        this.checkOfferLetterData();    }

    buildForm() {
        this.form = this.formBuilder.group({
            selectedSecurity: [undefined],
            loanLimitChecked: [undefined],
            referenceNumber: [undefined],
            dateofApproval: [undefined],
            customerName: [undefined],
            customerAddress: [undefined],
            dateofApplication: [undefined],
            loanPurpose: [undefined],
            loanAmountInFigure: [undefined],
            loanAmountInWords: [undefined],
            drawingPowerRate: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyLoanRate: [undefined],
            emiAmountInFigure: [undefined],
            emiAmountInWords: [undefined],
            loanPeriod: [undefined],
            loanAdminFeeInFigure: [undefined],
            loanAdminFeeInWords: [ undefined],
            loanCommitmentFee: [undefined],
            ownerName: [undefined],
            ownerAddress: [undefined],
            propertyPlotNumber: [undefined],
            propertyArea: [undefined],
            sheetNumber: [undefined],
            guarantorName: [undefined],
            guaranteedAmountInFigure: [undefined],
            guaranteedAmountInWord: [undefined],
            branchName: [undefined],
            additionalGuarantorDetails: [undefined],
            additionalDetails: [undefined],
            insuranceAmount: [undefined],
            relationshipOfficerName: [undefined],
            branchManager: [undefined],
            signatureDate: [undefined],
            security: this.formBuilder.array([])
        });
    }
    setLoanConfigData(data: any) {
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
                === this.offerLetterConst.value(this.offerLetterConst.MORTAGE_LOAN).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTAGE_LOAN);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
                    this.offerLetterData = this.offerLetterDocument;
                    this.form.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
                }
                if (!ObjectUtil.isEmpty(this.offerLetterDocument.pointInformation)) {
                    this.offerLetterData = this.offerLetterDocument;
                    this.form.get('additionalDetails').patchValue(this.offerLetterData.pointInformation);
                }
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                this.initialInfoPrint = initialInfo;
                this.selectedSecurity = initialInfo.selectedSecurity.en;
                this.loanLimit = this.tempData.loanLimitChecked.en;
                this.fillForm();
            }
        } else {
            this.fillForm();
        }
    }

    fillForm(){
        const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
        const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
            this.loanHolderInfo.permanentWard.ct + ', ' +
            this.loanHolderInfo.permanentDistrict.ct + ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ';
        const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
        let totalLoanAmount = 0;
        this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
            const val = value.proposal.proposedLimit;
            totalLoanAmount = totalLoanAmount + val;
        });
        let autoRefNumber;
        if (this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo) {
            autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
        }
        this.form.patchValue({
            referenceNumber: autoRefNumber ? autoRefNumber : '',
            customerName: this.loanHolderInfo.name.ct ? this.loanHolderInfo.name.ct : '',
            customerAddress: customerAddress ? customerAddress : '',
            loanPurpose: this.tempData.loanPurpose.ct ? this.tempData.loanPurpose.ct : '',
            loanAmountInFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
            loanAmountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
            drawingPowerRate: this.tempData.drawingPower.ct ? this.tempData.drawingPower.ct : '',
            baseRate: this.tempData.baseRate.ct ? this.tempData.baseRate.ct : '',
            premiumRate: this.tempData.premiumRate.ct ? this.tempData.premiumRate.ct : '',
            yearlyLoanRate: this.tempData.interestRate.ct ? this.tempData.interestRate.ct : '',
            emiAmountInFigure: this.tempData.emiInFigure.ct ? this.tempData.emiInFigure.ct : '',
            emiAmountInWords: this.tempData.emiInWords.ct ? this.tempData.emiInWords.ct : '',
            loanPeriod: this.tempData.loanPeriod.ct ? this.tempData.loanPeriod.ct : '',
            loanAdminFeeInFigure: this.tempData.loanAdminFeeInFigure.ct ? this.tempData.loanAdminFeeInFigure.ct : '',
            loanAdminFeeInWords: this.tempData.loanAdminFeeInWords.ct ? this.tempData.loanAdminFeeInWords.ct : '',
            loanCommitmentFee: this.tempData.loanCommitmentFee.ct ? this.tempData.loanCommitmentFee.ct : '',
            branchName: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
            insuranceAmount: this.tempData.insuranceAmount.ct ? this.tempData.insuranceAmount.ct : '',
            relationshipOfficerName: this.tempData.relationshipOfficerName.ct ? this.tempData.relationshipOfficerName.ct : '',
            branchManager: this.tempData.branchManagerName.ct ? this.tempData.branchManagerName.ct : '',

        })
    }


    submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
        this.form.get('loanLimitChecked').patchValue(this.loanLimit);
        this.form.get('selectedSecurity').patchValue(this.selectedSecurity);

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.MORTAGE_LOAN).toString()) {
                    offerLetterPath.supportedInformation = this.form.get('additionalGuarantorDetails').value;
                    offerLetterPath.pointInformation = this.form.get('additionalDetails').value;
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTAGE_LOAN);
            offerDocument.initialInformation = JSON.stringify(this.form.value);
            offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
            offerDocument.pointInformation = this.form.get('additionalDetails').value;
            this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
        }

        this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.afterSave = true;
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.spinner = false;
            this.dialogRef.close();
            this.afterSave = false;
            this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
        });

    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
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

    close() {
        this.ref.close();
    }

    guarantorParse(nepData, key, trans?) {
        const data = JSON.parse(nepData);
        try {
            if (ObjectUtil.isEmpty(trans)) {
                return data[key].ct;
            } else {
                return data[key].en;
            }
        } catch (exp) {
            console.log(exp);
        }
    }
}
