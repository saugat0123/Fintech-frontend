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
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

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
    offerLetterConst = NabilOfferLetterConst;
    offerLetterDocument: OfferDocument;
    selectedArray = [];
    ckeConfig = NepaliEditor.CK_CONFIG;
    nepData;
    loanHolderInfo;
    mapData;
    proTermLoanSelected = false;
    afterSave = false;
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() preview;
    selectedCountry;
    selectedSecurity;
    nameOfEmbassy;
    loanLimit;
    docSecurityName;
    guarantorData;
    offerLetterData;
    offerDocumentDetails;
    nepaliNumber = new NepaliNumberAndWords();
    guarantorNames: Array<String> = [];
    allguarantorNames;
    guarantorAmount: number = 0;
    guarantorAmountNepali;
    finalName;

    constructor(private formBuilder: FormBuilder,
                private customerOfferLetterService: CustomerOfferLetterService,
                private toastService: ToastService,
                private router: Router,
                private administrationService: CreditAdministrationService,
                protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                public engToNepNumberPipe: EngToNepaliNumberPipe,
                public currencyFormatPipe: CurrencyFormatterPipe,
                public nepToEngNumberPipe: NepaliToEngNumberPipe,
                private ref: NbDialogRef<RetailProfessionalLoanComponent>,
                private translateService: SbTranslateService,
                private datePipe: DatePipe,
                private engNepDatePipe: EngNepDatePipe
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
        this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
            // tslint:disable-next-line:max-line-length
            this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
        }
        this.calulation();
        this.checkOfferLetterData();
        this.guarantorDetails();
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
            pledgeAmountFigure: [undefined],
            insuranceAmountFigure: [undefined],
            relationshipOfficerName: [undefined],
            branchManager: [undefined],
            sakhshiDistrict: [undefined],
            sakhshiMunicipality: [undefined],
            sakhshiWardNo: [undefined],
            sakhshiName: [undefined],
            ownersName: [undefined],
            district: [undefined],
            municipality: [undefined],
            wardNo: [undefined],
            seatNo: [undefined],
            kittaNo: [undefined],
            landArea: [undefined],
            promissoryNoteAmount: [undefined],
            loanDeedAmount: [undefined],
            selectedCountry: [undefined],
            selectedSecurity: [undefined],
            embassyName: [undefined],
            loanLimitChecked: [undefined],
            additionalGuarantorDetails: [undefined],
        });
    }

    guarantorDetails(){
        if (this.guarantorData.length == 1){
            let temp = JSON.parse(this.guarantorData[0].nepData);
            this.finalName =  temp.guarantorName.ct;
        }
        else if(this.guarantorData.length == 2){
            for (let i = 0; i < this.guarantorData.length; i++){
                let temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(" र ");
            this.finalName = this.allguarantorNames;
        }
        else{
            for (let i = 0; i < this.guarantorData.length-1; i++){
                let temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(" , ");
            let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length-1].nepData);
            this.finalName =  this.allguarantorNames + " र " + temp1.guarantorName.ct;
        }
        console.log('Guarantor Name:', this.finalName);
    }

    checkOfferLetterData() {
        if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
            this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
                === this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL).toString())[0];
            if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
                this.offerLetterDocument = new OfferDocument();
                this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL);
            } else {
                const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
                if (!ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)) {
                    this.offerLetterData = this.offerLetterDocument;
                    this.retailProfessionalLoan.get('additionalGuarantorDetails').patchValue(this.offerLetterData.supportedInformation);
                }
                this.selectedSecurity = initialInfo.selectedSecurity.en;
                this.selectedCountry = initialInfo.selectedCountry.en;
                this.loanLimit = initialInfo.loanLimitChecked.en;
                this.nameOfEmbassy = initialInfo.embassyName.np;
                this.initialInfoPrint = initialInfo;
                this.existingOfferLetter = true;
                // this.retailProfessionalLoan.patchValue(initialInfo, {emitEvent: false});
                this.selectedArray = initialInfo.loanTypeSelectedArray;
                this.fillForm();
                this.initialInfoPrint = initialInfo;
            }
        } else {
            this.fillForm();
        }
    }

submit(): void {
        this.spinner = true;
        this.cadOfferLetterApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

        this.retailProfessionalLoan.get('selectedCountry').patchValue(this.selectedCountry);
        this.retailProfessionalLoan.get('selectedSecurity').patchValue(this.selectedSecurity);
        this.retailProfessionalLoan.get('loanLimitChecked').patchValue(this.loanLimit);
        this.retailProfessionalLoan.get('embassyName').patchValue(this.nameOfEmbassy);

        if (this.existingOfferLetter) {
            this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
                if (offerLetterPath.docName.toString() ===
                    this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL).toString()) {
                    offerLetterPath.supportedInformation = this.retailProfessionalLoan.get('additionalGuarantorDetails').value;
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL);
            offerDocument.initialInformation = JSON.stringify(this.retailProfessionalLoan.value);
            offerDocument.supportedInformation = this.retailProfessionalLoan.get('additionalGuarantorDetails').value;
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

    fillForm() {
        const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
        const customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
            this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct + ' ,' +
            this.loanHolderInfo.permanentProvince.ct;
        const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
        let totalLoanAmount = 0;
        this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
            const val = value.proposal.proposedLimit;
            totalLoanAmount = totalLoanAmount + val;
        });
        let dateOfApprovalTemp;
        if (!ObjectUtil.isEmpty(this.initialInfoPrint.dateOfApproval)) {
            dateOfApprovalTemp = this.dateConversion(this.initialInfoPrint.dateOfApproval);
        }
        let tempDateOfApplication;
        if (!ObjectUtil.isEmpty(this.initialInfoPrint.dateOfApplication)) {
            tempDateOfApplication = this.dateConversion(this.initialInfoPrint.dateOfApplication);
        }
        let temptenureFixedDeposit;
        if (!ObjectUtil.isEmpty(this.initialInfoPrint.tenureFixedDeposit)) {
            temptenureFixedDeposit = this.dateConversion(this.initialInfoPrint.tenureFixedDeposit);
        }
        this.retailProfessionalLoan.patchValue({
            nameOfCustomer: this.loanHolderInfo.name ? this.loanHolderInfo.name.ct : '',
            addressOfCustomer: customerAddress ? customerAddress : '',
            loanAmountFigure: totalLoanAmount ? this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)) : '',
            // guarantorName: this.loanHolderInfo.guarantorDetails[0].guarantorName.np,
            nameOfBranch: this.loanHolderInfo.branch.ct ? this.loanHolderInfo.branch.ct : '',
            amountInWords: this.nepaliCurrencyWordPipe.transform(totalLoanAmount),
            dateOfApproval: dateOfApprovalTemp ? dateOfApprovalTemp : '',
            dateOfApplication: tempDateOfApplication ? tempDateOfApplication : '',
            tenureFixedDeposit: temptenureFixedDeposit ? temptenureFixedDeposit : '',
        });
        // this.retailProfessionalLoan.patchValue(this.loanHolderInfo);
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

    changeDocumentName(securityType) {
        if (securityType === 'FIXED_DEPOSIT') {
            this.docSecurityName = ' Class A';
        } else {
            this.docSecurityName = ' Class E';
        }
    }

    calulation() {
        if (ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
            const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadOfferLetterApprovedDoc.assignedLoan);
            this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.nepaliNumber.engNumber = number;
        }
    }

    dateConversion(controlVal) {
        let dateTemp;
        if (!ObjectUtil.isEmpty(controlVal.en)) {
            if (!ObjectUtil.isEmpty(controlVal.en.nDate)) {
                dateTemp = controlVal.en.nDate;
            } else {
                const date = this.datePipe.transform(controlVal.en);
                dateTemp = this.engNepDatePipe.transform(date, true);
            }
        }
        return dateTemp;
    }

}
